import json
import os


def get_all_orders():
    """Get all orders (admin function)"""
    try:
        orders_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'orders.json')
        
        if not os.path.exists(orders_file):
            return []
            
        with open(orders_file, 'r') as f:
            return json.load(f)
            
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []
    except Exception as e:
        print(f"Error getting all orders: {e}")
        return []
