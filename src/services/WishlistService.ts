import { WishlistItem } from "@/models/WishlistItem";
import { Product } from "@/models/Product";
import { ProductService } from "./ProductService";

export type WishlistChangeEvent = {
    type: 'added' | 'removed' | 'cleared';
    productId?: string;
    item?: WishlistItem;
};

/**
 * Service for managing wishlist data using localStorage
 * 
 * Features:
 * - Persistent storage using localStorage
 * - Event-driven architecture for UI updates
 * - Singleton pattern for global state management
 * - Type-safe operations
 * 
 * In a real application, this service would:
 * - Sync with backend API for cross-device wishlist
 * - Handle user authentication and user-specific wishlists
 * - Implement conflict resolution for concurrent modifications
 * - Add analytics tracking for wishlist interactions
 */
export class WishlistService {
    private static instance: WishlistService;
    private wishlistItems: WishlistItem[] = [];
    private readonly STORAGE_KEY = 'awe-wishlist';
    private listeners: ((event: WishlistChangeEvent) => void)[] = [];

    private constructor() {
        this.loadFromStorage();
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
    public subscribe(listener: (event: WishlistChangeEvent) => void): () => void {
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
        this.listeners.forEach(listener => listener(event));
    }

    /**
     * Load wishlist from localStorage
     */
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.wishlistItems = parsed.map((item: any) => 
                    new WishlistItem(item.id, item.productId, new Date(item.addedAt))
                );
            }
        } catch (error) {
            console.error('Failed to load wishlist from storage:', error);
            this.wishlistItems = [];
        }
    }

    /**
     * Save wishlist to localStorage
     */
    private saveToStorage(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wishlistItems));
        } catch (error) {
            console.error('Failed to save wishlist to storage:', error);
        }
    }

    /**
     * Add a product to the wishlist
     */
    public addToWishlist(productId: string): boolean {
        // Check if item already exists
        if (this.isInWishlist(productId)) {
            return false;
        }

        const newItem = new WishlistItem(
            `wishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            productId
        );

        this.wishlistItems.push(newItem);
        this.saveToStorage();
        
        this.notifyListeners({
            type: 'added',
            productId,
            item: newItem
        });

        return true;
    }

    /**
     * Remove a product from the wishlist
     */
    public removeFromWishlist(productId: string): boolean {
        const initialLength = this.wishlistItems.length;
        this.wishlistItems = this.wishlistItems.filter(item => item.productId !== productId);
        
        if (this.wishlistItems.length < initialLength) {
            this.saveToStorage();
            this.notifyListeners({
                type: 'removed',
                productId
            });
            return true;
        }
        
        return false;
    }

    /**
     * Check if a product is in the wishlist
     */
    public isInWishlist(productId: string): boolean {
        return this.wishlistItems.some(item => item.productId === productId);
    }

    /**
     * Get all wishlist items
     */
    public getWishlistItems(): WishlistItem[] {
        return [...this.wishlistItems];
    }

    /**
     * Get wishlist products with full product details
     */
    public getWishlistProducts(): Product[] {
        const productService = ProductService.getInstance();
        const products: Product[] = [];
        
        this.wishlistItems.forEach(item => {
            const product = productService.getProductById(item.productId);
            if (product) {
                products.push(product);
            }
        });
        
        return products;
    }

    /**
     * Get wishlist count
     */
    public getWishlistCount(): number {
        return this.wishlistItems.length;
    }

    /**
     * Clear entire wishlist
     */
    public clearWishlist(): void {
        this.wishlistItems = [];
        this.saveToStorage();
        this.notifyListeners({
            type: 'cleared'
        });
    }

    /**
     * Toggle product in wishlist (add if not present, remove if present)
     */
    public toggleWishlist(productId: string): boolean {
        if (this.isInWishlist(productId)) {
            this.removeFromWishlist(productId);
            return false; // Removed
        } else {
            this.addToWishlist(productId);
            return true; // Added
        }
    }

    /**
     * Move all wishlist items to cart (placeholder for future cart integration)
     */
    public moveAllToCart(): void {
        // TODO: Implement cart integration
        console.log('Moving all wishlist items to cart...');
        // For now, just clear the wishlist
        this.clearWishlist();
    }

    /**
     * Get recently added items (within last 7 days)
     */
    public getRecentlyAddedItems(): WishlistItem[] {
        return this.wishlistItems.filter(item => item.isRecentlyAdded());
    }
}
