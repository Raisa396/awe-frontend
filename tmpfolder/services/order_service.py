import os
import uuid
from utils.file_manager import read_json, write_json
from services.cart_service import get_cart

ORDERS_FILE = os.path.join("data", "orders.json")

def place_order(user_id):
    cart = get_cart(user_id)
    if not cart:
        return None

    order_id = str(uuid.uuid4())
    total = sum(item["price"] * item["quantity"] for item in cart)

    order = {
        "order_id": order_id,
        "user_id": user_id,
        "items": cart,
        "total_price": total
    }

    all_orders = read_json(ORDERS_FILE)
    all_orders.append(order)
    write_json(ORDERS_FILE, all_orders)

    # Clear cart after placing the order
    cart_file = os.path.join("backend","data", "carts", f"{user_id}_cart.json")
    write_json(cart_file, [])

    return order
