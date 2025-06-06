"use client";

import { useEffect, useState } from "react";
import { CartService } from "@/services/CartService";
import { CartItem } from "@/models/CartItem";

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        setCart(CartService.getCart());
    }, []);

    const handleRemove = (productId: string) => {
        CartService.removeItem(productId);
        setCart(CartService.getCart());
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="pt-24 p-6">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

        {cart.length === 0 ? (
            <p>Your cart is empty.</p>
        ) : (
            <>
            {cart.map((item) => (
                <div
                key={item.productId}
                className="mb-4 flex items-center gap-4 border-b pb-2"
                >
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
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

            <a
                href="/order"
                className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
                Proceed to Checkout
            </a>
            </>
        )}
        </div>
    );
}
