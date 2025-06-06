import json
import os

def get_promo_codes():
    """Get all promo codes from the JSON file"""
    try:
        promo_codes_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'promo_codes.json')
        with open(promo_codes_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}



def add_promo_code(code, discount_percentage):
    """Add a new promo code (admin function)"""
    try:
        promo_codes_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'promo_codes.json')
        promo_codes = get_promo_codes()
        promo_codes[code.upper()] = discount_percentage
        
        with open(promo_codes_file, 'w') as f:
            json.dump(promo_codes, f, indent=2)
        
        return {"success": True, "message": "Promo code added successfully"}
    except Exception as e:
        return {"success": False, "message": f"Error adding promo code: {str(e)}"}

def remove_promo_code(code):
    """Remove a promo code (admin function)"""
    try:
        promo_codes_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'promo_codes.json')
        promo_codes = get_promo_codes()
        code_upper = code.upper()
        
        if code_upper in promo_codes:
            del promo_codes[code_upper]
            
            with open(promo_codes_file, 'w') as f:
                json.dump(promo_codes, f, indent=2)
            
            return {"success": True, "message": "Promo code removed successfully"}
        else:
            return {"success": False, "message": "Promo code not found"}
    except Exception as e:
        return {"success": False, "message": f"Error removing promo code: {str(e)}"}
