import { Product } from "@/models/Product";

/**
 * Types for pagination, filtering and sorting
 */
export type PaginationOptions = {
    page: number;
    pageSize: number;
};

export type FilterOptions = {
    searchQuery?: string;
    category?: string; // Keep for backward compatibility
    categories?: string[]; // New multi-category support
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
};

export type SortOption =
    | "featured"
    | "price-asc"
    | "price-desc"
    | "rating-desc"
    | "name-asc"
    | "name-desc";

export type ProductQueryResult = {
    products: Product[];
    totalCount: number;
    totalPages: number;
};

/**
 * Service for managing product data with live backend API integration
 */
export class ProductService {
    private static instance: ProductService;
    private products: Product[] = [];
    private readonly BASE_URL = "http://localhost:5000";

    /**
     * Initialize the service
     */
    private constructor() {
        this.products = [];
    }

    /**
     * Get singleton instance of the service
     */
    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    /**
     * Fetch products from backend API
     */
    private async fetchProductsFromAPI(): Promise<Product[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/products`);
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status}`);
            }
            const productsData = await response.json();

            // Convert API response to Product instances
            return productsData.map(
                (item: any) =>
                    new Product(
                        item.id,
                        item.name,
                        item.description,
                        item.price,
                        item.category,
                        item.image,
                        item.rating,
                        item.stock
                    )
            );
        } catch (error) {
            console.error("Error fetching products from API:", error);
            // Fallback to empty array if API fails
            return [];
        }
    }

    /**
     * Get all products
     * @returns Promise resolving to array of all products
     */
    public async getAllProducts(): Promise<Product[]> {
        if (this.products.length === 0) {
            this.products = await this.fetchProductsFromAPI();
        }
        return [...this.products];
    }

    /**
     * Get a product by its ID
     * @param id Product ID to find
     * @returns Promise resolving to Product if found, undefined otherwise
     */
    public getProductById(id: string): Product| undefined {
        return this.products.find((product) => product.id === id);
    }

    /**
     * Get products with server-side filtering, sorting, and pagination
     *
     * @param filter Filter options to apply
     * @param sort Sort option to apply
     * @param pagination Pagination options
     * @returns ProductQueryResult containing products and pagination metadata
     */
    public async getProducts(
        filter?: FilterOptions,
        sort?: SortOption,
        pagination?: PaginationOptions
    ): Promise<ProductQueryResult> {
        // Ensure products are loaded from API
        if (this.products.length === 0) {
            this.products = await this.fetchProductsFromAPI();
        }

        let filteredProducts = [...this.products];

        // Apply filters if provided
        if (filter) {
            // Filter by search query
            if (filter.searchQuery) {
                const query = filter.searchQuery.toLowerCase();
                filteredProducts = filteredProducts.filter(
                    (product) =>
                        product.name.toLowerCase().includes(query) ||
                        product.description.toLowerCase().includes(query) ||
                        product.category.toLowerCase().includes(query)
                );
            }

            // Filter by category (supports both single category and multiple categories)
            if (filter.category) {
                filteredProducts = filteredProducts.filter(
                    (product) => product.category === filter.category
                );
            } else if (filter.categories && filter.categories.length > 0) {
                filteredProducts = filteredProducts.filter((product) =>
                    filter.categories!.includes(product.category)
                );
            }

            // Filter by price range
            if (filter.minPrice !== undefined) {
                filteredProducts = filteredProducts.filter(
                    (product) => product.price >= filter.minPrice!
                );
            }
            if (filter.maxPrice !== undefined) {
                filteredProducts = filteredProducts.filter(
                    (product) => product.price <= filter.maxPrice!
                );
            }

            // Filter by rating
            if (filter.minRating !== undefined) {
                filteredProducts = filteredProducts.filter(
                    (product) => product.rating >= filter.minRating!
                );
            }
        }

        // Apply sorting if provided
        if (sort) {
            switch (sort) {
                case "featured":
                    // Sort by in-stock status first, then by rating
                    filteredProducts.sort((a, b) => {
                        if (a.isInStock() && !b.isInStock()) return -1;
                        if (!a.isInStock() && b.isInStock()) return 1;
                        return b.rating - a.rating;
                    });
                    break;
                case "price-asc":
                    filteredProducts.sort((a, b) => {
                        if (a.isInStock() && !b.isInStock()) return -1;
                        if (!a.isInStock() && b.isInStock()) return 1;
                        return a.price - b.price;
                    });
                    break;
                case "price-desc":
                    filteredProducts.sort((a, b) => {
                        if (a.isInStock() && !b.isInStock()) return -1;
                        if (!a.isInStock() && b.isInStock()) return 1;
                        return b.price - a.price;
                    });
                    break;
                case "rating-desc":
                    filteredProducts.sort((a, b) => {
                        if (a.isInStock() && !b.isInStock()) return -1;
                        if (!a.isInStock() && b.isInStock()) return 1;
                        return b.rating - a.rating;
                    });
                    break;
                case "name-asc":
                    filteredProducts.sort((a, b) => {
                        if (a.isInStock() && !b.isInStock()) return -1;
                        if (!a.isInStock() && b.isInStock()) return 1;
                        return a.name.localeCompare(b.name);
                    });
                    break;
                case "name-desc":
                    filteredProducts.sort((a, b) => {
                        if (a.isInStock() && !b.isInStock()) return -1;
                        if (!a.isInStock() && b.isInStock()) return 1;
                        return b.name.localeCompare(a.name);
                    });
                    break;
            }
        }

        // Calculate total count before pagination
        const totalCount = filteredProducts.length;

        // Apply pagination if provided
        let paginatedProducts = filteredProducts;
        let totalPages = 1;

        if (pagination) {
            const { page, pageSize } = pagination;
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            paginatedProducts = filteredProducts.slice(startIndex, endIndex);
            totalPages = Math.ceil(totalCount / pageSize);
        }

        return {
            products: paginatedProducts,
            totalCount,
            totalPages,
        };
    }

    /**
     * Get the minimum and maximum prices of all products
     *
     * @returns Object containing min and max price
     */
    public async getPriceRange(): Promise<{ min: number; max: number }> {
        if (this.products.length === 0) {
            this.products = await this.fetchProductsFromAPI();
        }
        const prices = this.products.map((p) => p.price);
        return {
            min: Math.min(...prices, 0),
            max: Math.max(...prices),
        };
    }

    /**
     * Get all unique categories
     *
     * @returns Array of unique categories
     */
    public async getCategories(): Promise<string[]> {
        if (this.products.length === 0) {
            this.products = await this.fetchProductsFromAPI();
        }
        return [...new Set(this.products.map((p) => p.category))];
    }
}
