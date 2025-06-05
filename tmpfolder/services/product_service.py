from utils.file_manager import read_json
import os

PRODUCTS_FILE = os.path.join("data", "products.json")

def get_all_products():
    return read_json(PRODUCTS_FILE)

def search_products(keyword):
    products = get_all_products()
    return [p for p in products if keyword.lower() in p["name"].lower()]

def filter_by_category(category):
    products = get_all_products()
    return [p for p in products if p["category"].lower() == category.lower()]

def filter_by_price(min_price, max_price):
    products = get_all_products()
    return [p for p in products if min_price <= p["price"] <= max_price]
