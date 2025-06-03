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
 * Service for managing product data
 *
 * NOTE: In a real application, this service would:
 * - Fetch data from a backend API using REST or GraphQL
 * - Implement proper error handling and loading states
 * - Use caching mechanisms for better performance
 * - Potentially integrate with a state management library like Redux or React Query
 *
 * The current implementation uses static dummy data for demonstration purposes only.
 * In production, replace the hardcoded data with API calls.
 */
export class ProductService {
    private static instance: ProductService;
    private products: Product[];

    /**
     * Initialize with dummy data
     * In a real application, this would be replaced with API calls
     */
    private constructor() {
        // FIXME: Replace with API call to fetch products from backend
        this.products = [
            new Product(
                "1",
                "Modern Ergonomic Chair",
                "High-quality ergonomic office chair with lumbar support and adjustable height",
                149.99,
                "Furniture",
                "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop",
                4.5,
                15
            ),
            new Product(
                "2",
                "Wireless Noise-Cancelling Headphones",
                "Premium wireless headphones with active noise cancellation and 30-hour battery life",
                199.99,
                "Electronics",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
                4.8,
                0 // Out of stock
            ),
            new Product(
                "3",
                "Smart Fitness Watch",
                "Track your workouts, heart rate, sleep quality and more with this advanced fitness tracker",
                129.99,
                "Electronics",
                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop",
                4.3,
                24
            ),
            new Product(
                "4",
                "Minimalist Desk Lamp",
                "Modern LED desk lamp with adjustable brightness and color temperature",
                59.99,
                "Home",
                "https://images.unsplash.com/photo-1534105555282-7f53a64f4eb8?q=80&w=800&auto=format&fit=crop",
                4.1,
                32
            ),
            new Product(
                "5",
                "Organic Cotton T-Shirt",
                "Soft, breathable 100% organic cotton t-shirt in a relaxed fit",
                29.99,
                "Clothing",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
                4.4,
                0 // Out of stock
            ),
            new Product(
                "6",
                "Smart Home Security Camera with Advanced Motion Detection Technology",
                "HD security camera with motion detection, night vision, and smartphone integration",
                89.99,
                "Electronics",
                "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=800&auto=format&fit=crop",
                4.2,
                17
            ),
            new Product(
                "7",
                "Stainless Steel Water Bottle",
                "Vacuum-insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours",
                34.99,
                "Kitchen",
                "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop",
                4.7,
                42
            ),
            new Product(
                "8",
                "Ceramic Plant Pot",
                "Minimalist ceramic pot perfect for indoor plants and succulents",
                24.99,
                "Home",
                "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop",
                4.0,
                29
            ),
            // Additional products with varied ratings
            new Product(
                "9",
                "Handcrafted Wooden Cutting Board",
                "Premium acacia wood cutting board with juice grooves and handle",
                45.99,
                "Kitchen",
                "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop",
                3.5,
                18
            ),
            new Product(
                "10",
                "Vintage Style Record Player",
                "Bluetooth-enabled record player with built-in speakers and USB recording",
                129.99,
                "Electronics",
                "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=800&auto=format&fit=crop",
                2.8,
                7
            ),
            new Product(
                "11",
                "Professional Art Pencil Set",
                "Set of 24 artist-grade colored pencils in a metal case",
                19.99,
                "Art Supplies",
                "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
                5.0,
                31
            ),
            new Product(
                "12",
                "Natural Bamboo Bath Mat",
                "Eco-friendly non-slip bamboo bath mat with water-resistant finish",
                38.5,
                "Home",
                "https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?q=80&w=800&auto=format&fit=crop",
                3.9,
                0 // Out of stock
            ),
            new Product(
                "13",
                "Leather Bound Journal",
                "Handmade leather journal with recycled paper pages and bookmark",
                27.99,
                "Stationery",
                "https://images.unsplash.com/photo-1518481852452-9415b262eba4?q=80&w=800&auto=format&fit=crop",
                4.2,
                22
            ),
            new Product(
                "14",
                "Smart Wi-Fi Light Bulbs",
                "Color-changing LED bulbs controllable via smartphone app or voice assistant",
                49.99,
                "Electronics",
                "https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=800&auto=format&fit=crop",
                2.5,
                47
            ),
            new Product(
                "15",
                "Minimalist Wall Clock",
                "Modern silent wall clock with Scandinavian design",
                32.5,
                "Home",
                "https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?q=80&w=800&auto=format&fit=crop",
                3.7,
                19
            ),
            new Product(
                "16",
                "Premium Coffee Grinder",
                "Adjustable burr grinder for French press, pour over, and espresso",
                89.99,
                "Kitchen",
                "https://images.unsplash.com/photo-1516224498413-84ecf3a1e7fd?q=80&w=800&auto=format&fit=crop",
                4.9,
                8
            ),
            new Product(
                "17",
                "Portable Bluetooth Speaker",
                "Waterproof speaker with 20-hour battery life and rich bass",
                79.99,
                "Electronics",
                "https://images.unsplash.com/photo-1589001184633-69991e79e0e7?q=80&w=800&auto=format&fit=crop",
                3.2,
                14
            ),
            new Product(
                "18",
                "Yoga Mat with Alignment Lines",
                "Non-slip eco-friendly yoga mat with position guide marks",
                42.5,
                "Fitness",
                "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop",
                4.6,
                25
            ),
            new Product(
                "19",
                "Compact Mechanical Keyboard",
                "Tactile mechanical keyboard with RGB backlighting and programmable keys",
                119.99,
                "Electronics",
                "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
                4.0,
                0 // Out of stock
            ),
            new Product(
                "20",
                "Wool Knit Sweater",
                "Soft, warm sweater made from 100% merino wool in classic style",
                65.5,
                "Clothing",
                "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop",
                3.8,
                12
            ),
            new Product(
                "21",
                "Handmade Ceramic Mug Set",
                "Set of 4 artisan mugs with unique glazing patterns",
                36.99,
                "Kitchen",
                "https://images.unsplash.com/photo-1577918385240-e252d7805a16?q=80&w=800&auto=format&fit=crop",
                4.7,
                19
            ),
            new Product(
                "22",
                "Lightweight Hiking Backpack",
                "Durable 30L backpack with hydration system compatibility",
                89.95,
                "Outdoor",
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
                2.9,
                8
            ),
            new Product(
                "23",
                "Digital Drawing Tablet",
                "Pressure-sensitive tablet for digital artists with wireless connectivity",
                199.5,
                "Electronics",
                "https://images.unsplash.com/photo-1589401945430-77240638bdce?q=80&w=800&auto=format&fit=crop",
                4.5,
                0 // Out of stock
            ),
            new Product(
                "24",
                "Premium Loose Leaf Tea Collection",
                "Six varieties of organic loose leaf tea in reusable tins",
                32.99,
                "Food & Beverage",
                "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop",
                3.3,
                27
            ),
            new Product(
                "25",
                "Minimalist Desk Organizer",
                "Bamboo desk organizer with multiple compartments and device stand",
                45.0,
                "Office",
                "https://images.unsplash.com/photo-1593114970899-7b8c952e757a?q=80&w=800&auto=format&fit=crop",
                4.4,
                33
            ),
            new Product(
                "26",
                "Adjustable Dumbbell Set",
                "Space-saving dumbbell set with adjustable weights from 5-25 pounds each",
                249.99,
                "Fitness",
                "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
                1.7,
                5
            ),
            new Product(
                "27",
                "Handwoven Throw Blanket",
                "Soft cotton throw blanket with geometric patterns and fringed edges",
                59.95,
                "Home",
                "https://images.unsplash.com/photo-1600369671236-e74451ee0f3a?q=80&w=800&auto=format&fit=crop",
                2.0,
                14
            ),
            new Product(
                "28",
                "Stainless Steel Cocktail Set",
                "Complete bartending kit with shaker, jigger, strainer, and recipe book",
                75.0,
                "Kitchen",
                "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
                3.9,
                21
            ),
            new Product(
                "29",
                "Compact Air Purifier",
                "HEPA air purifier ideal for bedrooms and small spaces with quiet operation",
                129.95,
                "Home",
                "https://images.unsplash.com/photo-1585771724684-38269d6933c5?q=80&w=800&auto=format&fit=crop",
                4.1,
                9
            ),
            new Product(
                "30",
                "Wooden Chess Set",
                "Handcrafted wooden chess set with felt-lined storage box",
                89.99,
                "Games",
                "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=800&auto=format&fit=crop",
                2.2,
                0 // Out of stock
            ),
        ];
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
     * Get all products
     *
     * @returns Array of all products
     * @todo Replace with API call to backend
     */
    public getAllProducts(): Product[] {
        // TODO: Replace with API call:
        // return fetch('/api/products').then(res => res.json());
        return [...this.products];
    }

    /**
     * Get a product by its ID
     *
     * @param id Product ID to find
     * @returns Product if found, undefined otherwise
     * @todo Replace with API call to backend
     */
    public getProductById(id: string): Product | undefined {
        // TODO: Replace with API call:
        // return fetch(`/api/products/${id}`).then(res => res.json());
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
    public getProducts(
        filter?: FilterOptions,
        sort?: SortOption,
        pagination?: PaginationOptions
    ): ProductQueryResult {
        // In a real app, this would be a single API call like:
        // return fetch('/api/products?page=1&pageSize=12&sort=price-asc&minPrice=10&maxPrice=100&category=Electronics')
        //    .then(res => res.json());

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
                filteredProducts = filteredProducts.filter(
                    (product) => filter.categories!.includes(product.category)
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
    public getPriceRange(): { min: number; max: number } {
        const prices = this.products.map((p) => p.price);
        return {
            min: Math.min(...prices,0),
            max: Math.max(...prices),
        };
    }

    /**
     * Get all unique categories
     *
     * @returns Array of unique categories
     */
    public getCategories(): string[] {
        return [...new Set(this.products.map((p) => p.category))];
    }
}
