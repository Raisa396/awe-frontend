// WishlistItem model class following OOP principles
export class WishlistItem {
    id: string;
    productId: string;
    addedAt: Date;

    constructor(id: string, productId: string, addedAt?: Date) {
        this.id = id;
        this.productId = productId;
        this.addedAt = addedAt || new Date();
    }

    /**
     * Check if this wishlist item was added within the last specified days
     */
    isRecentlyAdded(days: number = 7): boolean {
        const daysDiff = (Date.now() - this.addedAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= days;
    }

    /**
     * Get formatted date string
     */
    getFormattedDate(): string {
        return this.addedAt.toLocaleDateString();
    }
}
