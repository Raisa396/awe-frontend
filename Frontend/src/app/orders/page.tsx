"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/services/UserService";
import Navbar from "@/components/NavBar";
import { WishlistSidebar } from "@/components/WishlistSidebar";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total_price: number;
    imageUrl?: string;
}

interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
}

interface Order {
    order_id: string;
    user_id: string;
    customer?: Customer;
    items: OrderItem[];
    total_price: number;
    discount?: number;
    final_total?: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [wishlistSidebarOpen, setWishlistSidebarOpen] = useState(false);

    const userService = UserService.getInstance();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                const userId = userService.getUserId();
                
                const response = await fetch(`http://localhost:5000/orders/${userId}`);
                if (response.ok) {
                    const userOrders = await response.json();
                    setOrders(userOrders);
                } else {
                    setError("Failed to load orders");
                }
            } catch (err) {
                console.error("Error loading orders:", err);
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [userService]);

        if (loading) {
        return (
            <>
                <Navbar onWishlistToggle={() => setWishlistSidebarOpen(!wishlistSidebarOpen)} />
                <WishlistSidebar 
                    isOpen={wishlistSidebarOpen} 
                    onClose={() => setWishlistSidebarOpen(false)} 
                />
                <div className="pt-24 p-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading your orders...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar onWishlistToggle={() => setWishlistSidebarOpen(!wishlistSidebarOpen)} />
                <WishlistSidebar 
                    isOpen={wishlistSidebarOpen} 
                    onClose={() => setWishlistSidebarOpen(false)} 
                />
                <div className="pt-24 p-6 max-w-4xl mx-auto">
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar onWishlistToggle={() => setWishlistSidebarOpen(!wishlistSidebarOpen)} />
            <WishlistSidebar 
                isOpen={wishlistSidebarOpen} 
                onClose={() => setWishlistSidebarOpen(false)} 
            />
            <div className="pt-24 p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <a
                        href="/shop"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 inline-block"
                    >
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.order_id} className="bg-gray-900 border rounded-lg shadow-md p-6">
                            <div className="border-b pb-4 mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold">Order #{order.order_id.slice(0, 8)}</h2>
                                        <p className="text-gray-200">User: {order.user_id}</p>
                                    </div>
                                    {order.customer && (
                                        <div className="text-right text-sm text-gray-200">
                                            <p><strong>Delivery Address:</strong></p>
                                            <p>{order.customer.address}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <h3 className="font-semibold">Items:</h3>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                                        <div className="flex items-center gap-3">
                                            {item.imageUrl && (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-200">
                                                    ${item.price.toFixed(2)} x {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">${item.total_price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <div className="space-y-2 text-right">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${order.total_price.toFixed(2)}</span>
                                    </div>
                                    {order.discount && order.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount:</span>
                                            <span>-${order.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Final Total:</span>
                                        <span>${(order.final_total || order.total_price).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                            )}
            </div>
        </>
    );
}
