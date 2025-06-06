import { Product } from "@/models/Product";
import { ProductService } from "./ProductService";
import { UserService } from "./UserService";

export type WishlistChangeEvent = {
    type: "added" | "removed" | "cleared";
    productId?: string;
};

/**
 * Service for managing wishlist data using backend API
 *
 * Features:
 * - Backend API integration for persistent storage
 * - Event-driven architecture for UI updates
 * - Singleton pattern for global state management
 * - Type-safe operations
 *
 * Features:
 * - Sync with backend API for cross-device wishlist
 * - Handle user authentication and user-specific wishlists
 * - Implement conflict resolution for concurrent modifications
 * - Add analytics tracking for wishlist interactions
 */
export class WishlistService {
    private static instance: WishlistService;
    private wishlistProducts: Product[] = [];
    private readonly API_BASE_URL = "http://localhost:5000";
    private listeners: ((event: WishlistChangeEvent) => void)[] = [];
    private userService: UserService;
    private productsService: ProductService;

    private constructor() {
        this.userService = UserService.getInstance();
        this.productsService = ProductService.getInstance();
        this.loadFromApi();
    }

    /**
     * Get singleton instance of the service
     */
    public static getInstance(): WishlistService {
        if (!WishlistService.instance) {
            WishlistService.instance = new WishlistService();
        }
        return WishlistService.instance;
    }

    /**
     * Subscribe to wishlist changes
     */
    public subscribe(
        listener: (event: WishlistChangeEvent) => void
    ): () => void {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Notify all listeners of wishlist changes
     */
    private notifyListeners(event: WishlistChangeEvent): void {
        this.listeners.forEach((listener) => listener(event));
    }

    /**
     * Load wishlist from backend API
     */
    private async loadFromApi(): Promise<void> {
        try {
            const userId = this.userService.getUserId();
            const response = await fetch(
                `${this.API_BASE_URL}/wishlist/${userId}`
            );
            if (response.ok) {
                const productsData = await response.json();
                // Convert plain objects to Product instances
                this.wishlistProducts = productsData.map((productData: any) => 
                    this.productsService.getProductById(productData.id)
                );
                productsData.forEach((productData: { id: any; }) => {
                    this.notifyListeners({
                      type: "added",
                      productId: productData.id,
                    });
                });
            } else {
                console.error(
                    "Failed to load wishlist from API:",
                    response.statusText
                );
                this.wishlistProducts = [];
            }
        } catch (error) {
            console.error("Failed to load wishlist from API:", error);
            this.wishlistProducts = [];
        }
    }

    /**
     * Sync changes with backend API
     */
    private async syncWithApi(
        action: string,
        product: Product | null = null
    ): Promise<boolean> {
        try {
            const userId = this.userService.getUserId();
            let response: Response;

            switch (action) {
                case "add":
                    if (!product) return false;
                    response = await fetch(
                        `${this.API_BASE_URL}/wishlist/${userId}/add`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(product),
                        }
                    );
                    break;

                case "remove":

                    response = await fetch(
                        `${this.API_BASE_URL}/wishlist/${userId}/remove`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(product),
                        }
                    );
                    break;

                case "clear":
                    response = await fetch(
                        `${this.API_BASE_URL}/wishlist/${userId}/clear`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    break;

                default:
                    return false;
            }

            return response.ok;
        } catch (error) {
            console.error(`Failed to sync ${action} with API:`, error);
            return false;
        }
    }

    /**
     * Add a product to the wishlist
     */
    public async addToWishlist(product: Product): Promise<boolean> {
        // Check if item already exists
        if (this.isInWishlist(product)) {
            return false;
        }

        const success = await this.syncWithApi("add", product);
        if (success) {
            this.wishlistProducts.push(product);

            this.notifyListeners({
                type: "added",
                productId: product.id,
            });

            return true;
        }

        return false;
    }

    /**
     * Remove a product from the wishlist
     */
    public async removeFromWishlist(product: Product): Promise<boolean> {
        const initialLength = this.wishlistProducts.length;

        const success = await this.syncWithApi("remove", product);
        if (success) {
            this.wishlistProducts = this.wishlistProducts.filter(
                (item) => item.id !== product.id
            );

            if (this.wishlistProducts.length < initialLength) {
                this.notifyListeners({
                    type: "removed",
                    productId: product.id,
                });
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a product is in the wishlist
     */
    public isInWishlist(product: Product): boolean {
        return this.wishlistProducts.includes(product);
    }

    /**
     * Get all wishlist product IDs
     */
    public getWishlistProductIds(): string[] {
        return [...this.wishlistProducts.map((product) => product.id)];
    }

    /**
     * Get wishlist products with full product details
     */
    public getWishlistProducts(): Product[] {
        return this.wishlistProducts;
    }

    /**
     * Get wishlist count
     */
    public getWishlistCount(): number {
        return this.wishlistProducts.length;
    }

    /**
     * Reload wishlist from backend API
     */
    public async reloadWishlist(): Promise<void> {
        await this.loadFromApi();
    }

    /**
     * Clear entire wishlist
     */
    public async clearWishlist(): Promise<void> {
        const success = await this.syncWithApi("clear");
        if (success) {
            this.wishlistProducts = [];
            this.notifyListeners({
                type: "cleared",
            });
        }
    }

    /**
     * Toggle product in wishlist (add if not present, remove if present)
     */
    public async toggleWishlist(product: Product): Promise<boolean> {
        if (this.isInWishlist(product)) {
            await this.removeFromWishlist(product);
            return false; // Removed
        } else {
            await this.addToWishlist(product);
            return true; // Added
        }
    }
}
