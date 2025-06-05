// Product model class following OOP principles
export class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    stock: number;

    constructor(
        id: string,
        name: string,
        description: string,
        price: number,
        category: string,
        image: string,
        rating: number = 0,
        stock: number = 0
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image;
        this.rating = rating;
        this.stock = stock;
    }

    isInStock(): boolean {
        return this.stock > 0;
    }

    getFormattedPrice(): string {
        return `$${this.price.toFixed(2)}`;
    }
}
