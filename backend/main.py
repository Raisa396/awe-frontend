from services.product_service import get_all_products
from services.cart_service import add_to_cart, get_cart
from services.order_service import place_order
from services.wishlist_service import add_to_wishlist, get_wishlist

# 🔑 Ask for user ID
user_id = input("Enter user ID (e.g. 'maria'): ").strip()

print("\n🔁 Reloading product list")
products = get_all_products()

# 🛍 Show product list
print("\nAvailable Products:")
for i, product in enumerate(products):
    print(f"{i + 1}. {product['name']} - ${product['price']}")

# 🛒 Add to cart
try:
    choice = int(input("\nEnter the number of the product to add to cart: ")) - 1
    if 0 <= choice < len(products):
        selected_product = products[choice]
        quantity = int(input(f"Enter quantity for '{selected_product['name']}': "))
        product_with_quantity = selected_product.copy()
        product_with_quantity["quantity"] = quantity
        print(f"\n🧪 Adding {quantity} x {selected_product['name']} to cart.")
        add_to_cart(user_id, product_with_quantity)
    else:
        print("❌ Invalid choice for cart.")
except ValueError:
    print("❌ Please enter valid numbers.")

# ✅ Show current cart
cart = get_cart(user_id)
print(f"\n🧺 Cart contents for '{user_id}':")
print("📋 Cart JSON:", cart)
for item in cart:
    print(f"- {item['name']} (x{item['quantity']})")

# 💖 Add to wishlist
try:
    choice = int(input("\nEnter the number of the product to add to wishlist: ")) - 1
    if 0 <= choice < len(products):
        selected_wish = products[choice]
        print(f"\n💖 Adding to wishlist: {selected_wish['name']}")
        add_to_wishlist(user_id, selected_wish)
    else:
        print("❌ Invalid choice for wishlist.")
except ValueError:
    print("❌ Please enter a valid number.")

wishlist = get_wishlist(user_id)
print(f"\n📌 Wishlist for '{user_id}':")
for item in wishlist:
    print(f"- {item['name']}")

# 📦 Place order
print(f"\n📦 Attempting to place order for '{user_id}'")
order = place_order(user_id)
if order:
    print(f"✅ Order placed! ID: {order['order_id']}, Total: ${order['total_price']}")
else:
    print("⚠️ No items in cart to place an order.")