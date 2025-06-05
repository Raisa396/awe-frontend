import os
from utils.file_manager import read_json, write_json

def get_wishlist_filepath(user_id):
    return os.path.join("data", "wishlists", f"{user_id}_wishlist.json")

def get_wishlist(user_id):
    return read_json(get_wishlist_filepath(user_id))

def add_to_wishlist(user_id, product):
    wishlist = get_wishlist(user_id)
    if any(item["id"] == product["id"] for item in wishlist):
        return  # already in wishlist
    wishlist.append(product)
    write_json(get_wishlist_filepath(user_id), wishlist)

def remove_from_wishlist(user_id, product_id):
    wishlist = get_wishlist(user_id)
    wishlist = [item for item in wishlist if item["id"] != product_id]
    write_json(get_wishlist_filepath(user_id), wishlist)
