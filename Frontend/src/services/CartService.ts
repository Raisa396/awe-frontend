import { CartItem } from "@/models/CartItem";
import { UserService } from "./UserService";
import { Product } from "@/models/Product";

export type CartChangeEvent = {
    type: "added" | "removed" | "cleared" | "updated";
    productId?: string;
};

/**
 * Service for managing cart data using backend API
 * 
 * Features:
 * - Backend API integration for persistent storage
 * - Event-driven architecture for UI updates
 * - Singleton pattern for global state management
 * - Type-safe operations
 */
export class CartService {
    private static instance: CartService;
    private cartItems: CartItem[] = [];
    private readonly API_BASE_URL = "http://localhost:5000";
    private listeners: ((event: CartChangeEvent) => void)[] = [];
    private userService: UserService;

    private constructor() {
        this.userService = UserService.getInstance();
        this.loadFromApi();
    }

    /**
     * Get singleton instance of the service
     */
    public static getInstance(): CartService {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }

    /**
     * Subscribe to cart changes
     */
    public subscribe(listener: (event: CartChangeEvent) => void): () => void {
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
     * Notify all listeners of cart changes
     */
    private notifyListeners(event: CartChangeEvent): void {
        this.listeners.forEach((listener) => listener(event));
    }

    /**
     * Load cart from backend API
     */
    private async loadFromApi(): Promise<void> {
        try {
            const userId = this.userService.getUserId();
            const response = await fetch(`${this.API_BASE_URL}/cart/${userId}`);
            
            if (response.ok) {
                const cartData = await response.json();
                // Convert API response to CartItem instances
                this.cartItems = cartData.map((item: any) => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl // Backend doesn't store image, will need to be fetched separately
                }));
            } else {
                console.error("Failed to load cart from API:", response.statusText);
                this.cartItems = [];
            }
        } catch (error) {
            console.error("Failed to load cart from API:", error);
            this.cartItems = [];
        }
    }

    /**
     * Sync changes with backend API
     */
    private async syncWithApi(action: string, data?: any): Promise<boolean> {
        try {
            const userId = this.userService.getUserId();
            let response: Response;

            switch (action) {
                case "add":
                    response = await fetch(`${this.API_BASE_URL}/cart/${userId}/add`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });
                    break;

                case "remove":
                    response = await fetch(`${this.API_BASE_URL}/cart/${userId}/remove`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productId: data }),
                    });
                    break;

                case "clear":
                    response = await fetch(`${this.API_BASE_URL}/cart/${userId}/clear`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                    });
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
     * Get current cart items
     */
    public getCart(): CartItem[] {
        return [...this.cartItems];
    }

    /**
     * Add item to cart
     */
    public async addToCart(product: Product, quantity: number = 1): Promise<boolean> {
        const productData = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.image,
            rating: product.rating,
            stock: product.stock,
            quantity: quantity
        };

        const success = await this.syncWithApi("add", productData);
        if (success) {
            // Update local cart
            const existing = this.cartItems.find(item => item.productId === product.id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                this.cartItems.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    imageUrl: product.image
                });
            }

            this.notifyListeners({
                type: "added",
                productId: product.id,
            });

            return true;
        }

        return false;
    }

    /**
     * Remove item from cart
     */
    public async removeItem(productId: string): Promise<boolean> {
        const success = await this.syncWithApi("remove", productId);
        if (success) {
            const initialLength = this.cartItems.length;
            this.cartItems = this.cartItems.filter(item => item.productId !== productId);

            if (this.cartItems.length < initialLength) {
                this.notifyListeners({
                    type: "removed",
                    productId: productId,
                });
                return true;
            }
        }

        return false;
    }

    /**
     * Clear entire cart
     */
    public async clearCart(): Promise<boolean> {
        const success = await this.syncWithApi("clear");
        if (success) {
            this.cartItems = [];
            this.notifyListeners({
                type: "cleared",
            });
            return true;
        }

        return false;
    }

    /**
     * Get cart item count
     */
    public getCartCount(): number {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Get cart total price
     */
    public getCartTotal(): number {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Reload cart from backend API
     */
    public async reloadCart(): Promise<void> {
        await this.loadFromApi();
    }
}
