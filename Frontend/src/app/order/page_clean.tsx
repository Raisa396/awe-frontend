"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/models/CartItem";
import { CartService } from "@/services/CartService";
import { UserService } from "@/services/UserService";

export default function OrderPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

    const cartService = CartService.getInstance();
    const userService = UserService.getInstance();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            
            // Load user name from UserService
            const userName = userService.getUserId(); // Using getUserId as name for now
            setName(userName);
            
            // Load cart
            await cartService.reloadCart();
            setCart(cartService.getCart());
            setLoading(false);
        };

        loadData();

        // Subscribe to cart changes
        const unsubscribe = cartService.subscribe(() => {
            setCart(cartService.getCart());
        });

        return unsubscribe;
    }, [cartService, userService]);

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

        if (!email || !phone || !address) {
            alert("Please fill out all required fields.");
            return;
        }

        setSubmitting(true);

        try {
            const userId = userService.getUserId();
            
            // Place order via API
            const response = await fetch(`http://localhost:5000/order/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer: { name, email, phone, address, notes },
                    discount: discount
                })
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.status === "cart empty") {
                    alert("❌ Your cart is empty!");
                } else {
                    alert(`✅ Order placed successfully! Order ID: ${result.order_id}`);
                    window.location.href = "/shop";
                }
            } else {
                alert("❌ Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Order submission error:", error);
            alert("❌ Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-24 p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading cart...</p>
                    </div>
                </div>
            ) : cart.length === 0 ? (
                <p>
                    Your cart is empty. Go back to{" "}
                    <a href="/shop" className="text-blue-500 underline">
                        shop
                    </a>.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block font-medium">Full Name</label>
                        <input
                            id="fullName"
                            className="w-full p-2 border rounded bg-gray-100"
                            value={name}
                            disabled
                            title="Name is automatically set from your user profile"
                        />
                        <small className="text-gray-500">Name is automatically set from your user profile</small>
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-medium">Email *</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full p-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block font-medium">Phone *</label>
                        <input
                            id="phone"
                            type="tel"
                            className="w-full p-2 border rounded"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block font-medium">Shipping Address *</label>
                        <textarea
                            id="address"
                            className="w-full p-2 border rounded"
                            rows={3}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your full shipping address"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block font-medium">Notes (optional)</label>
                        <textarea
                            id="notes"
                            className="w-full p-2 border rounded"
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special delivery instructions"
                        />
                    </div>

                    <div>
                        <label htmlFor="promoCode" className="block font-medium">Promo Code</label>
                        <div className="flex gap-2">
                            <input
                                id="promoCode"
                                className="flex-1 p-2 border rounded"
                                value={promoCode}
                                placeholder="Enter promo code"
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
                        disabled={submitting}
                        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Placing Order...
                            </>
                        ) : (
                            "Place Order"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
