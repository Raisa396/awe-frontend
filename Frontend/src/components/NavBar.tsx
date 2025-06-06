"use client";
import Link from "next/link";
import { Heart, ShoppingCart, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { WishlistService } from "@/services/WishlistService";
import { CartService } from "@/services/CartService";
import { UserService } from "@/services/UserService";
import Image from "next/image";

interface NavbarProps {
    onWishlistToggle: () => void;
}

export default function Navbar({ onWishlistToggle }: NavbarProps) {
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    const wishlistService = WishlistService.getInstance();
    const cartService = CartService.getInstance();
    const userService = UserService.getInstance();

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            userService.clearUserId();
            window.location.href = "/shop";
        }
    };

    // Load wishlist count when component mounts
    useEffect(() => {
        const loadWishlistCount = async () => {
            await wishlistService.reloadWishlist();
            setWishlistCount(wishlistService.getWishlistCount());
        };

        const loadCartCount = async () => {
            await cartService.reloadCart();
            setCartCount(cartService.getCartCount());
        };

        loadWishlistCount();
        loadCartCount();

        const unsubscribeWishlist = wishlistService.subscribe(() => {
            setWishlistCount(wishlistService.getWishlistCount());
        });

        const unsubscribeCart = cartService.subscribe(() => {
            setCartCount(cartService.getCartCount());
        });

        return () => {
            unsubscribeWishlist?.();
            unsubscribeCart?.();
        };
    }, [wishlistService, cartService]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
            <div className="flex items-center gap-3">
                <Image 
                    src="/shopping-cart.png" 
                    alt="AWE Store Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                /> 
                <div className="text-xl font-bold tracking-wide">AWE Store</div>
            </div>
            <div className="flex items-center gap-6">
                {/* Navigation Links */}
                <Link href="/shop" className="hover:text-gray-300">Shop</Link>
                <Link href="/cart" className="relative hover:text-gray-300">
                    Cart
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-3 h-5 w-5 text-xs font-medium bg-red-500 text-white rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Link>
                <Link href="/orders" className="hover:text-gray-300">My Orders</Link>

                {/* Wishlist Icon */}
                <button
                    onClick={onWishlistToggle}
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                    <Heart
                        className={`h-6 w-6 transition-colors ${
                            wishlistCount > 0
                                ? "text-red-500 fill-red-500"
                                : "text-gray-700 dark:text-gray-200 group-hover:text-red-500"
                        }`}
                    />
                    {/* Wishlist count badge */}
                    {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 text-xs font-medium bg-red-500 text-white rounded-full flex items-center justify-center animate-in zoom-in-50">
                            {wishlistCount}
                        </span>
                    )}
                </button>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-red-400 hover:text-red-300"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
}
