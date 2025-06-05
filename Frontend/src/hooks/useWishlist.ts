import { useState, useEffect } from 'react';
import { WishlistService, WishlistChangeEvent } from '@/services/WishlistService';
import { Product } from '@/models/Product';

/**
 * Custom hook for wishlist management
 * 
 * Provides reactive state management for wishlist operations
 * Automatically subscribes/unsubscribes to wishlist changes
 */
export function useWishlist() {
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const wishlistService = WishlistService.getInstance();

    // Load initial data and subscribe to changes
    useEffect(() => {
        const loadWishlist = () => {
            setWishlistProducts(wishlistService.getWishlistProducts());
            setWishlistCount(wishlistService.getWishlistCount());
            setIsLoading(false);
        };

        // Load initial data
        loadWishlist();

        // Subscribe to changes
        const unsubscribe = wishlistService.subscribe((event: WishlistChangeEvent) => {
            loadWishlist();
        });

        // Cleanup subscription
        return unsubscribe;
    }, [wishlistService]);

    const addToWishlist = (productId: string) => {
        return wishlistService.addToWishlist(productId);
    };

    const removeFromWishlist = (productId: string) => {
        return wishlistService.removeFromWishlist(productId);
    };

    const toggleWishlist = (productId: string) => {
        return wishlistService.toggleWishlist(productId);
    };

    const isInWishlist = (productId: string) => {
        return wishlistService.isInWishlist(productId);
    };

    const clearWishlist = () => {
        wishlistService.clearWishlist();
    };

    const moveAllToCart = () => {
        wishlistService.moveAllToCart();
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
