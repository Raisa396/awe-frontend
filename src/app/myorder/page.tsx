"use client";
import { useEffect, useState } from "react";

interface Order {
    id: number;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        notes: string;
    };
    items: any[];
    total: number;
    placedAt: string;
    }

    export default function MyOrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const data = localStorage.getItem("placed_orders");
        if (data) setOrders(JSON.parse(data));
    }, []);

    return (
        <div className="pt-24 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
            <p>No orders placed yet.</p>
        ) : (
            orders.map((order) => (
            <div key={order.id} className="mb-6 border-b pb-4">
                <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                <p>Placed At: {order.placedAt}</p>
                <p><strong>Name:</strong> {order.customer.name}</p>
                <p><strong>Address:</strong> {order.customer.address}</p>
                <p className="mt-2 font-semibold">Items:</p>
                <ul className="list-disc pl-5">
                {order.items.map((item, i) => (
                    <li key={i}>
                    {item.name} × {item.quantity} — ${item.price.toFixed(2)}
                    </li>
                ))}
                </ul>
                <p className="mt-2 font-bold">Total: ${order.total.toFixed(2)}</p>
            </div>
            ))
        )}
        </div>
    );
}
