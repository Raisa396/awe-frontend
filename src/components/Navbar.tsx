"use client";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="text-xl font-bold tracking-wide">
            AWE Store
        </div>
        <div className="space-x-4">
            <Link href="/shop" className="hover:text-gray-300">
            Home
            </Link>
            <Link href="/cart" className="hover:text-gray-300">
            Cart
            </Link>
            <Link href="/myorder" className="hover:text-gray-300">
            My Orders
            </Link>

        </div>
        </nav>
    );
}
