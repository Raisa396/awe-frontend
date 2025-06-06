"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/models/CartItem";
import { CartService } from "@/services/CartService";

export default function OrderPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

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

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountedTotal = total - discount;

    const handlePromoApply = () => {
        if (promoCode.trim().toUpperCase() === "DISCOUNT10") {
        setDiscount(total * 0.1);
        alert("Promo code applied! 10% discount.");
        } else {
        setDiscount(0);
        alert("Invalid promo code.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !phone || !address) {
        alert("Please fill out all required fields.");
        return;
        }

        const order = {
        id: Date.now(),
        customer: { name, email, phone, address, notes },
        items: cart,
        total: discountedTotal,
        placedAt: new Date().toLocaleString(),
        };

        const existing = JSON.parse(localStorage.getItem("placed_orders") || "[]");
        existing.push(order);
        localStorage.setItem("placed_orders", JSON.stringify(existing));

        alert("✅ Order placed successfully!");
        await cartService.clearCart();
        window.location.href = "/shop";
    };

    return (
        <div className="pt-24 p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {cart.length === 0 ? (
            <p>
            Your cart is empty. Go back to{" "}
            <a href="/shop" className="text-blue-500 underline">
                shop
            </a>.
            </p>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium">Full Name *</label>
                <input
                className="w-full p-2 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </div>

            <div>
                <label className="block font-medium">Email *</label>
                <input
                type="email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div>
                <label className="block font-medium">Phone *</label>
                <input
                type="tel"
                className="w-full p-2 border rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                />
            </div>

            <div>
                <label className="block font-medium">Shipping Address *</label>
                <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                />
            </div>

            <div>
                <label className="block font-medium">Notes (optional)</label>
                <textarea
                className="w-full p-2 border rounded"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <div>
                <label className="block font-medium">Promo Code</label>
                <div className="flex gap-2">
                <input
                    className="flex-1 p-2 border rounded"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                    type="button"
                    onClick={handlePromoApply}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Apply
                </button>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Order Summary:</h3>
                {cart.map((item) => (
                <div key={item.productId} className="mb-2">
                    {item.name} × {item.quantity} — ${item.price.toFixed(2)}
                </div>
                ))}
                <p className="mt-2 font-bold">
                Total: ${total.toFixed(2)}
                {discount > 0 && (
                    <>
                    <br />
                    <span className="text-green-600">
                        Promo applied: -${discount.toFixed(2)}
                    </span>
                    <br />
                    Final: ${discountedTotal.toFixed(2)}
                    </>
                )}
                </p>
            </div>

            <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
                Place Order
            </button>
            </form>
        )}
        </div>
    );
}
