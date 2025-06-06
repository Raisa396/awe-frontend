import { useState, useEffect } from "react";
import { WishlistService } from "@/services/WishlistService";
import { CartService } from "@/services/CartService";
import { Product } from "@/models/Product";

/**
 * Simple hook for wishlist management
 */
export function useWishlist() {
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const wishlistService = WishlistService.getInstance();

    // Load initial data
    useEffect(() => {
        const loadWishlist = async () => {
            await wishlistService.reloadWishlist();
            setWishlistProducts(wishlistService.getWishlistProducts());
            setWishlistCount(wishlistService.getWishlistCount());
            setIsLoading(false);
        };

        loadWishlist();
    }, []);

    const addToWishlist = async (product: Product) => {
        const success = await wishlistService.addToWishlist(product);
        if (success) {
            setWishlistProducts(wishlistService.getWishlistProducts());
            setWishlistCount(wishlistService.getWishlistCount());
        }
        return success;
    };

    const removeFromWishlist = async (product: Product) => {
        const success = await wishlistService.removeFromWishlist(product);
        if (success) {
            setWishlistProducts(wishlistService.getWishlistProducts());
            setWishlistCount(wishlistService.getWishlistCount());
        }
        return success;
    };

    const toggleWishlist = async (product: Product) => {
        const added = await wishlistService.toggleWishlist(product);
        setWishlistProducts(wishlistService.getWishlistProducts());
        setWishlistCount(wishlistService.getWishlistCount());
        return added;
    };

    const isInWishlist = (product: Product) => {
        return wishlistService.isInWishlist(product);
    };

    const clearWishlist = async () => {
        await wishlistService.clearWishlist();
        setWishlistProducts([]);
        setWishlistCount(0);
    };

    const moveAllToCart = async () => {
        const cartService = CartService.getInstance();
        // Add all wishlist items to cart
        for (const product of wishlistProducts) {
            if (product.isInStock()) {
                await cartService.addToCart(product, 1);
            }
        }
        // Clear wishlist after moving items
        await clearWishlist();
    };

    return {
        wishlistProducts,
        wishlistCount,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        moveAllToCart,
    };
}
