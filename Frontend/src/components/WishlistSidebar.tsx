import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { WishlistService } from "@/services/WishlistService";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/models/Product";

interface WishlistSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const WishlistProductCard = ({ product }: { product: Product }) => {
    const wishlistService = WishlistService.getInstance();

    const handleRemove = () => {
        wishlistService.removeFromWishlist(product.id);
    };

    const handleMoveToCart = () => {
        // TODO: Implement cart functionality
        console.log(`Moving ${product.name} to cart`);
        // For now, remove from wishlist
        wishlistService.removeFromWishlist(product.id);
    };

    return (
        <div className="relative flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {/* Product Image */}
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                    {product.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {product.getFormattedPrice()}
                </p>
                <div className="flex items-center mt-1">
                    <span
                        className={`inline-flex h-2 w-2 rounded-full ${
                            product.isInStock() ? "bg-green-500" : "bg-red-500"
                        } mr-1`}
                    ></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {product.isInStock() ? "In stock" : "Out of stock"}
                    </span>
                </div>
            </div>

            {/* Action Buttons - positioned at top right */}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleMoveToCart}
                    disabled={!product.isInStock()}
                    className="p-2 rounded-md bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                    title="Move to cart"
                >
                    <ShoppingCart className="h-4 w-4" />
                </button>
                <button
                    onClick={handleRemove}
                    className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove from wishlist"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export const WishlistSidebar = ({ isOpen, onClose }: WishlistSidebarProps) => {
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const wishlistService = WishlistService.getInstance();

    // Load wishlist products and subscribe to changes
    useEffect(() => {
        const loadWishlistProducts = async () => {
            const products = await wishlistService.getWishlistProducts();
            setWishlistProducts(products);
            setWishlistCount(wishlistService.getWishlistCount());
        };

        loadWishlistProducts();

        const unsubscribe = wishlistService.subscribe(async () => {
            const products = await wishlistService.getWishlistProducts();
            setWishlistProducts(products);
            setWishlistCount(wishlistService.getWishlistCount());
        });

        return unsubscribe;
    }, [wishlistService]);

    const handleClearWishlist = () => {
        wishlistService.clearWishlist();
    };

    const handleMoveAllToCart = () => {
        // TODO: Implement cart functionality
        console.log("Moving all items to cart");
        wishlistService.clearWishlist();
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-100 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Wishlist ({wishlistCount})
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {wishlistProducts.length > 0 ? (
                        <>
                            {/* Action Buttons */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleMoveAllToCart}
                                        className="flex-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Move All to Cart
                                    </button>
                                    <button
                                        onClick={handleClearWishlist}
                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Product List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {wishlistProducts.map((product) => (
                                    <WishlistProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Heart className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Your wishlist is empty
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Start adding products you love to your wishlist
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
