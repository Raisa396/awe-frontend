import { CartItem } from "@/models/CartItem";

const CART_KEY = "awe_cart";

export const CartService = {
    getCart(): CartItem[] {
        if (typeof window === "undefined") return [];
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    saveCart(cart: CartItem[]) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    },

    addToCart(item: CartItem) {
        const cart = this.getCart();
        const existing = cart.find(p => p.productId === item.productId);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        this.saveCart(cart);
    },

    clearCart() {
        localStorage.removeItem(CART_KEY);
    },

    removeItem(productId: string) {
        const updatedCart = this.getCart().filter(
            (item) => item.productId !== productId
        );
        this.saveCart(updatedCart);
    }
};
