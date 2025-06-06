import os
import uuid
from utils.file_manager import read_json, write_json
from services.cart_service import get_cart

ORDERS_FILE = os.path.join("data", "orders.json")
PROMOS_FILE = os.path.join("data", "promo_codes.json")

def place_order(user_id, customer_info=None, discount=0):
    cart = get_cart(user_id)
    if not cart:
        return None

    order_id = str(uuid.uuid4())
    total = sum(item["price"] * item["quantity"] for item in cart)
    final_total = total - discount

    order = {
        "order_id": order_id,
        "user_id": user_id,
        "customer": customer_info or {"name": user_id},
        "items": cart,
        "total_price": total,
        "discount": discount,
        "final_total": final_total
    }

    all_orders = read_json(ORDERS_FILE)
    all_orders.append(order)
    write_json(ORDERS_FILE, all_orders)

    # Clear cart after placing the order
    cart_file = os.path.join("data", "carts", f"{user_id}_cart.json")
    write_json(cart_file, [])

    return order


def validate_promo_code(code):
    """Validate a promo code and return discount percentage"""
    if not code:
        return {"valid": False, "discount": 0, "message": "No promo code provided"}
    
    promo_codes = read_json(PROMOS_FILE)
    code_upper = code.strip().upper()
    
    if code_upper in promo_codes:
        discount_percentage = promo_codes[code_upper]
        return {
            "valid": True, 
            "discount": discount_percentage,
            "message": f"Promo code applied! {discount_percentage}% discount."
        }
    else:
        return {
            "valid": False, 
            "discount": 0,
            "message": "Invalid promo code."
        }

def get_user_orders(user_id):
    """Get all orders for a specific user"""

    all_orders = read_json(ORDERS_FILE)
    
    # Filter orders for the specific user
    user_orders = [order for order in all_orders if order.get('user_id') == user_id]
    
    # Sort by order_id (most recent first, assuming newer orders have later IDs)
    user_orders.sort(key=lambda x: x.get('order_id'), reverse=True)
    
    return user_orders
