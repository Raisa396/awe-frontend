import json
import os

filepath = os.path.join("backend", "data", "products.json")
print("🔍 Trying to read:", filepath)

if not os.path.exists(filepath):
    print("❌ File not found!")
else:
    with open(filepath, 'r') as f:
        try:
            data = json.load(f)
            print("✅ File loaded successfully!")
            print("📦 Products:", data)
        except Exception as e:
            print("❌ Failed to parse JSON:", e)
