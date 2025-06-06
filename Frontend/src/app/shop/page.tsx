"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { WishlistSidebar } from "@/components/WishlistSidebar";
import {
    ProductGridSkeleton,
} from "@/components/ProductCardSkeleton";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ProductService,
    FilterOptions,
    SortOption as ServerSortOption,
    PaginationOptions,
} from "@/services/ProductService";
import { WishlistService } from "@/services/WishlistService";
import { Product } from "@/models/Product";

// Enhanced star rating component with partial stars
const StarRating = ({ rating }: { rating: number }) => {
    const getStarFill = (starPosition: number) => {
        // Calculate how filled this star should be (0 to 100%)
        if (rating >= starPosition) {
            return 100; // Fully filled star
        } else if (rating > starPosition - 1) {
            // Calculate partial fill (e.g., 3.7 for position 4 would be 70%)
            return Math.round((rating - Math.floor(rating)) * 100);
        }
        return 0; // Empty star
    };

    return (
        <div className="flex items-center">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((starPosition) => {
                    const fillPercentage = getStarFill(starPosition);

                    return (
                        <div key={starPosition} className="relative w-5 h-5">
                            {/* Background star (gray) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="h-5 w-5 absolute text-gray-300"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                />
                            </svg>

                            {/* Foreground star (yellow) with clip path for partial fill */}
                            {fillPercentage > 0 && (
                                <div
                                    className="absolute top-0 left-0 h-full overflow-hidden"
                                    style={{ width: `${fillPercentage}%` }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5 text-yellow-400"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <span className="ml-1 text-gray-600 text-sm">
                ({rating.toFixed(1)})
            </span>
        </div>
    );
};

const ProductCard = ({ product }: { product: Product }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
    const wishlistService = WishlistService.getInstance();

    // Check wishlist status on mount
    useEffect(() => {
        setIsInWishlist(wishlistService.isInWishlist(product));

        const unsubscribe = wishlistService.subscribe((event) => {
            if (event.productId === product.id) {
                setIsInWishlist(wishlistService.isInWishlist(product));
            }
        });

        return unsubscribe;    
    }, [product.id, wishlistService]);

    const handleWishlistToggle = async () => {
        setIsWishlistAnimating(true);

        if (isInWishlist) {
            await wishlistService.removeFromWishlist(product);
        } else {
            await wishlistService.addToWishlist(product);
        }

        // Reset animation state
        setTimeout(() => setIsWishlistAnimating(false), 300);
    };

    const handleAddToCart = () => {
        // TODO: Implement cart functionality
        console.log(`Adding ${product.name} to cart`);
    };

    return (
        <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-900">
            <div className="aspect-square overflow-hidden">
                <div className="relative h-full w-full transition-transform group-hover:scale-110 ">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>

            {/* Action buttons that appear on hover */}
            <div className="absolute top-4 right-3 transform  opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3">
                <button
                    title="Add to Wishlist"
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-full transition-all duration-300 ${
                        isWishlistAnimating ? "scale-125" : "scale-100"
                    } ${
                        isInWishlist
                            ? "bg-red-500 text-white shadow-lg"
                            : "bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:text-red-500"
                    } backdrop-blur-sm hover:scale-110 shadow-lg`}
                >
                    <Heart
                        className={`h-5 w-5 transition-all duration-200 ${
                            isInWishlist ? "fill-current" : ""
                        }`}
                    />
                </button>

                <button
                    title="Add to Cart"
                    onClick={handleAddToCart}
                    disabled={!product.isInStock()}
                    className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:text-blue-500 backdrop-blur-sm hover:scale-110 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart className="h-5 w-5" />
                </button>
            </div>

            {/* Product info - elevated on hover */}
            <div className="p-4 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate h-6">
                    {product.name}
                </h3>
                <StarRating rating={product.rating} />
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                        {product.getFormattedPrice()}
                    </p>
                    <div className="flex items-center">
                        <span
                            className={`inline-flex h-3 w-3 rounded-full ${
                                product.isInStock()
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            } mr-2`}
                        ></span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {product.isInStock() ? "In stock" : "Out of stock"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SearchInput = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    return (
        <div className="relative w-full mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search products..."
                className="pl-10 rounded-full w-full"
            />
        </div>
    );
};

// Filter component with multi-select support
const CategoryFilter = ({
    categories,
    selectedCategories,
    onSelect,
}: {
    categories: string[];
    selectedCategories: string[];
    onSelect: (category: string) => void;
}) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="all-categories"
                    checked={selectedCategories.length === 0}
                    onCheckedChange={() => onSelect("")}
                />
                <label
                    htmlFor="all-categories"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    All Categories
                </label>
            </div>
            {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => onSelect(category)}
                    />
                    <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {category}
                    </label>
                </div>
            ))}
        </div>
    );
};

// Sort options type
type SortOption = {
    label: string;
    value: ServerSortOption;
};

// Dropdown component for sorting using shadcn Select
const SortDropdown = ({
    options,
    selectedOption,
    onSelect,
}: {
    options: SortOption[];
    selectedOption: ServerSortOption;
    onSelect: (value: ServerSortOption) => void;
}) => {
    return (
        <Select value={selectedOption} onValueChange={onSelect}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const PriceRangeFilter = ({
    minPrice,
    maxPrice,
    priceRange,
    onChange,
}: {
    minPrice: number;
    maxPrice: number;
    priceRange: [number, number];
    onChange: (range: [number, number]) => void;
}) => {
    const [values, setValues] = useState<[number, number]>(priceRange);

    // Sync with external price range changes
    useEffect(() => {
        setValues(priceRange);
    }, [priceRange]);

    const handleValueChange = (newValues: number[]) => {
        if (newValues.length === 2) {
            const range: [number, number] = [newValues[0], newValues[1]];
            setValues(range);
            onChange(range);
        }
    };

    return (
        <div className="w-full max-w-sm">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Price Range:
                </label>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${values[0].toFixed(0)} - ${values[1].toFixed(0)}
                </span>
            </div>
            <div className="pt-4 pb-2">
                <Slider
                    value={values}
                    min={minPrice}
                    max={maxPrice}
                    step={1}
                    minStepsBetweenThumbs={1}
                    onValueChange={handleValueChange}
                    className="w-full"
                />
            </div>
        </div>
    );
};

// Rating filter component using shadcn Slider
const RatingFilter = ({
    value,
    onChange,
}: {
    value: number;
    onChange: (value: number) => void;
}) => {
    const handleValueChange = (newValues: number[]) => {
        if (newValues.length > 0) {
            onChange(newValues[0]);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Minimum Rating:
                </label>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {value}+ stars
                </span>
            </div>
            <div className="pt-4 pb-2">
                <Slider
                    value={[value]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={handleValueChange}
                    className="w-full"
                />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
            </div>
        </div>
    );
};

// Pagination component
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {
    // Generate page numbers to display (show current page, and some before/after)
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if there are few enough
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first and last page
            pages.push(1);

            // Calculate range around current page
            const leftSide = Math.max(2, currentPage - 1);
            const rightSide = Math.min(totalPages - 1, currentPage + 1);

            // Add ellipsis if needed
            if (leftSide > 2) pages.push(-1); // -1 represents ellipsis

            // Add pages around current page
            for (let i = leftSide; i <= rightSide; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (rightSide < totalPages - 1) pages.push(-1);

            // Add last page
            if (totalPages > 1) pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-2">
            {/* Previous page button */}
            <button
                title="Go to previous page"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                    currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Page numbers */}
            {pageNumbers.map((pageNumber, index) => {
                if (pageNumber === -1) {
                    // Render ellipsis
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="text-gray-500 dark:text-gray-400"
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        title={`Go to ${pageNumber} page`}
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === pageNumber
                                ? "bg-black text-white dark:bg-white dark:text-black"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {/* Next page button */}
            <button
                        title="Go to next page"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                    currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
};

// Main shop page component
export default function ShopPage() {
    // Products and filtering state
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Filter, sort, and pagination state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<ServerSortOption>("featured");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [minRating, setMinRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(9); // Number of products per page
    const [showFilters, setShowFilters] = useState(false);

    // Wishlist sidebar state
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    // Track the min and max prices for the price filter component
    const [minPossiblePrice, setMinPossiblePrice] = useState(0);
    const [maxPossiblePrice, setMaxPossiblePrice] = useState(500);

    const sortOptions: SortOption[] = [
        { label: "Featured", value: "featured" },
        { label: "Price: Low to High", value: "price-asc" },
        { label: "Price: High to Low", value: "price-desc" },
        { label: "Rating: High to Low", value: "rating-desc" },
        { label: "Name: A to Z", value: "name-asc" },
        { label: "Name: Z to A", value: "name-desc" },
    ];

    // Initialize product data
    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            const productService = ProductService.getInstance();

            try {
                // Get categories for filter
                const allCategories = await productService.getCategories();
                setCategories(allCategories);

                // Set initial price range based on product data
                const { min, max } = await productService.getPriceRange();
                setMinPossiblePrice(min);
                setMaxPossiblePrice(max);
                setPriceRange([min, max]);

                // Fetch initial products
                await loadProducts();
            } catch (error) {
                console.error("Error initializing shop data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, []);

    // Prepare filter options
    const prepareFilterOptions = (): FilterOptions => {
        return {
            searchQuery: searchQuery || undefined,
            categories:
                selectedCategories.length > 0 ? selectedCategories : undefined,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            minRating: minRating || undefined,
        };
    };

    // Handle category selection (supports multiple selection)
    const handleCategorySelect = (category: string) => {
        if (category === "") {
            // "All Categories" selected - clear all selections
            setSelectedCategories([]);
        } else {
            setSelectedCategories((prev) => {
                if (prev.includes(category)) {
                    // Remove category if already selected
                    return prev.filter((c) => c !== category);
                } else {
                    // Add category if not selected
                    return [...prev, category];
                }
            });
        }
    };

    // Load products with current filter, sort, and pagination options
    const loadProducts = async () => {
        setIsLoading(true);
        const productService = ProductService.getInstance();

        // Prepare filter, sort, and pagination options
        const filterOptions = prepareFilterOptions();
        const paginationOptions: PaginationOptions = {
            page: currentPage,
            pageSize: pageSize,
        };

        // Get products with all options
        const result = await productService.getProducts(
            filterOptions,
            sortOption,
            paginationOptions
        );

        // Update state with results
        setProducts(result.products);
        setTotalProducts(result.totalCount);
        setTotalPages(result.totalPages);
        setIsLoading(false);
    };

    // Reload products when filter, sort, or pagination changes
    useEffect(() => {
        // Reset to first page when filters change
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            loadProducts();
        }
    }, [searchQuery, selectedCategories, sortOption, priceRange, minRating]);

    // Reload products when page changes
    useEffect(() => {
        loadProducts();
    }, [currentPage]);

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategories([]);
        setPriceRange([minPossiblePrice, maxPossiblePrice]);
        setMinRating(0);
        setSortOption("featured");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <NavBar
                onWishlistToggle={() => setIsWishlistOpen(!isWishlistOpen)}
            />

            <div className="py-12">
                <div className="container mx-auto px-4">
                    <header className="mb-8 text-center">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Browse Our Products
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                            Discover our curated selection of high-quality
                            products
                        </p>
                    </header>

                    {/* Search bar at the top */}
                    <div className="mb-8 w-full">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar filters */}
                        <div className="w-full lg:w-1/4 lg:sticky lg:top-8 lg:self-start">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-medium">
                                        Filters
                                    </h2>
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                                    >
                                        Reset all
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium mb-3">
                                            Sort by
                                        </h3>
                                        <SortDropdown
                                            options={sortOptions}
                                            selectedOption={sortOption}
                                            onSelect={setSortOption}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium mb-3">
                                            Categories
                                        </h3>
                                        <CategoryFilter
                                            categories={categories}
                                            selectedCategories={
                                                selectedCategories
                                            }
                                            onSelect={handleCategorySelect}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium mb-3">
                                            Price
                                        </h3>
                                        <PriceRangeFilter
                                            minPrice={minPossiblePrice}
                                            maxPrice={maxPossiblePrice}
                                            priceRange={priceRange}
                                            onChange={setPriceRange}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium mb-3">
                                            Rating
                                        </h3>
                                        <RatingFilter
                                            value={minRating}
                                            onChange={setMinRating}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main content - product grid */}
                        <div className="w-full lg:w-3/4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {products.length} of {totalProducts}{" "}
                                    products
                                </div>

                                <div className="lg:hidden">
                                    <button
                                        onClick={() =>
                                            setShowFilters(!showFilters)
                                        }
                                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                        </svg>
                                        Filters
                                    </button>
                                </div>
                            </div>

                            {showFilters && (
                                <div className="lg:hidden mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">
                                            Sort by
                                        </h3>
                                        <SortDropdown
                                            options={sortOptions}
                                            selectedOption={sortOption}
                                            onSelect={setSortOption}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">
                                            Categories
                                        </h3>
                                        <CategoryFilter
                                            categories={categories}
                                            selectedCategories={
                                                selectedCategories
                                            }
                                            onSelect={handleCategorySelect}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">
                                            Price
                                        </h3>
                                        <PriceRangeFilter
                                            minPrice={minPossiblePrice}
                                            maxPrice={maxPossiblePrice}
                                            priceRange={priceRange}
                                            onChange={setPriceRange}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">
                                            Rating
                                        </h3>
                                        <RatingFilter
                                            value={minRating}
                                            onChange={setMinRating}
                                        />
                                    </div>
                                </div>
                            )}

                            {isLoading ? (
                                <ProductGridSkeleton count={pageSize} />
                            ) : products.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8">
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-8">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                                        />
                                    </svg>
                                    <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">
                                        No products found
                                    </h3>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                                        Try adjusting your search or filters to
                                        find what you're looking for.
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="mt-6 rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Wishlist Sidebar */}
            <WishlistSidebar
                isOpen={isWishlistOpen}
                onClose={() => setIsWishlistOpen(false)}
            />
        </div>
    );
}
