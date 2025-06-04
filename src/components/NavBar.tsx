import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

interface NavBarProps {
    onWishlistToggle: () => void;
}

export const NavBar = ({ onWishlistToggle }: NavBarProps) => {
    const { wishlistCount } = useWishlist();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            AWE Shop
                        </h1>
                    </div>

                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Icon */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                            {/* Cart count badge (placeholder) */}
                            <span className="absolute -top-1 -right-1 h-5 w-5 text-xs font-medium bg-red-500 text-white rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>

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
                    </div>
                </div>
            </div>
        </nav>
    );
};
