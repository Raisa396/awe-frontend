"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CartService } from "@/services/CartService";
import { CartItem } from "@/models/CartItem";
import Link from "next/link";
import Navbar from "@/components/NavBar";
import { WishlistSidebar } from "@/components/WishlistSidebar";

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlistSidebarOpen, setWishlistSidebarOpen] = useState(false);
    const cartService = CartService.getInstance();

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            await cartService.reloadCart();
            setCart(cartService.getCart());
            setLoading(false);
        };

        loadCart();

        // Subscribe to cart changes
        const unsubscribe = cartService.subscribe(() => {
            setCart(cartService.getCart());
        });

        return unsubscribe;
    }, [cartService]);

    const handleRemove = async (productId: string) => {
        setLoading(true);
        await cartService.removeItem(productId);
        setLoading(false);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <Navbar onWishlistToggle={() => setWishlistSidebarOpen(!wishlistSidebarOpen)} />
            <WishlistSidebar 
                isOpen={wishlistSidebarOpen} 
                onClose={() => setWishlistSidebarOpen(false)} 
            />
            <div className="pt-24 p-6">
                <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

                {loading ? (
                    <p>Loading cart...</p>
                ) : cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
            <>
            {cart.map((item) => (
                <div
                key={item.productId}
                className="mb-4 flex items-center gap-4 border-b pb-2"
                >
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={140}
                    height={140}
                    className="w-30 h-30 object-cover rounded"
                />
                <div className="flex-1">
                    <h2 className="text-lg font-medium">{item.name}</h2>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                </div>
                <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleRemove(item.productId)}
                >
                    Remove
                </button>
                </div>
            ))}

            <h3 className="text-xl font-semibold mt-6">
                                Total: ${total.toFixed(2)}
            </h3>

            <Link
                href="/order"
                className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
                Proceed to Checkout
            </Link>
            </>
        )}
            </div>
        </>
    );
}
