from flask import Flask, jsonify, request
from services.product_service import get_all_products, search_products
from services.cart_service import get_cart, add_to_cart, remove_from_cart, clear_cart
from services.wishlist_service import get_wishlist, add_to_wishlist, remove_from_wishlist, clear_wishlist
from services.order_service import place_order, validate_promo_code

from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route("/products")
def products():
    return jsonify(get_all_products())

@app.route("/search")
def search():
    keyword = request.args.get("q", "")
    return jsonify(search_products(keyword))

@app.route("/cart/<user_id>")
def cart(user_id):
    return jsonify(get_cart(user_id))

@app.route("/cart/<user_id>/add", methods=["POST"])
def cart_add(user_id):
    product = request.json
    add_to_cart(user_id, product)
    return jsonify({"status": "added"})

@app.route("/cart/<user_id>/remove", methods=["POST"])
def cart_remove(user_id):
    data = request.json
    product_id = data.get("productId") if data else None
    if product_id:
        success = remove_from_cart(user_id, product_id)
        return jsonify({"status": "removed" if success else "not_found"})
    return jsonify({"status": "error", "message": "Product ID required"}), 400

@app.route("/cart/<user_id>/clear", methods=["POST"])
def cart_clear(user_id):
    clear_cart(user_id)
    return jsonify({"status": "cleared"})

@app.route("/wishlist/<user_id>")
def wishlist(user_id):
    return jsonify(get_wishlist(user_id))

@app.route("/wishlist/<user_id>/add", methods=["POST"])
def wishlist_add(user_id):
    product = request.json
    print(product)
    add_to_wishlist(user_id, product)
    return jsonify({"status": "added"})

@app.route("/wishlist/<user_id>/remove", methods=["POST"])
def wishlist_remove(user_id):
    product = request.json
    remove_from_wishlist(user_id, product)
    return jsonify({"status": "removed"})

@app.route("/wishlist/<user_id>/clear", methods=["POST"])
def wishlist_clear(user_id):
    clear_wishlist(user_id)
    return jsonify({"status": "cleared"})

@app.route("/order/<user_id>", methods=["POST"])
def order(user_id):
    data = request.json or {}
    customer_info = data.get("customer")
    discount = data.get("discount", 0)
    
    result = place_order(user_id, customer_info, discount)
    return jsonify(result if result else {"status": "cart empty"})

# Promo Code Routes
@app.route("/promo/validate", methods=["POST"])
def validate_promo():
    data = request.json
    code = data.get("code", "")
    return jsonify(validate_promo_code(code))


if __name__ == "__main__":
    app.run(debug=True)
