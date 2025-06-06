import os
from utils.file_manager import read_json, write_json

def get_cart_filepath(user_id):
    path = os.path.join("data", "carts", f"{user_id}_cart.json")
    print(f"📂 Cart filepath: {path}")  # Debug cart path
    return path

def get_cart(user_id):
    filepath = get_cart_filepath(user_id)
    return read_json(filepath)

def add_to_cart(user_id, product):
    print("⚙️ [DEBUG] add_to_cart() was called!")
    print("📦 [DEBUG] Received product:", product)

    cart = get_cart(user_id)
    print("📂 [DEBUG] Cart before adding:", cart)

    found = False
    for item in cart:
        if item["id"] == product["id"]:
            item["quantity"] += product.get("quantity", 1)
            item["total_price"] = round(item["quantity"] * item["price"], 2)
            found = True
            print("🔁 [DEBUG] Updated quantity for:", item)
            break

    if not found:
        quantity = product.get("quantity", 1)
        new_item = {
            "id": product["id"],
            "name": product["name"],
            "category": product["category"],
            "price": product["price"],
            "quantity": quantity,
            "total_price": round(quantity * product["price"], 2),
            "imageUrl": product["imageUrl"],
        }
        cart.append(new_item)
        print("➕ [DEBUG] Added new item:", new_item)

    write_json(get_cart_filepath(user_id), cart)
    print("💾 [DEBUG] Cart written successfully.")

def remove_from_cart(user_id, product_id):
    cart = get_cart(user_id)
    
    updated_cart = [item for item in cart if item["id"] != product_id]

    write_json(get_cart_filepath(user_id), updated_cart)
    return len(cart) != len(updated_cart)  # Return True if item was removed

def clear_cart(user_id):
    write_json(get_cart_filepath(user_id), [])
