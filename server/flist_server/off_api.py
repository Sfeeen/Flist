# Created by Sven Onderbeke at 29/05/2022
import json
import requests

openfoodfacts_api_url = "https://world.openfoodfacts.org/api/v0/product/{}.json"

def openfoodfacts_request_product(product_code):
    resp = requests.get(openfoodfacts_api_url.format(product_code))
    data = resp.json()

    filtered_data = {
        "status_verbose": data["status_verbose"]
    }

    if data["status_verbose"] == "product found":
        product = data["product"]

        print(f"Product {product_code} aka {product['product_name']} found!")

        filtered_data["code"] = data["code"]
        filtered_data["product_name"] = product["product_name"]
        try:
            filtered_data["image_thumb_url"] = product["image_thumb_url"]
        except KeyError:
            pass

        try:
            filtered_data["image_url"] = product["image_url"]
        except KeyError:
            pass

        try:
            filtered_data["categories_hierarchy"] = product["categories_hierarchy"]
        except KeyError:
            pass

        try:
            filtered_data["categories"] = product["categories"]
        except KeyError:
            pass

        # print(json.dumps(filtered_data, indent=4, sort_keys=True))

    else:
        print(f"Product {product_code} not found!")

    return filtered_data

if __name__ == '__main__':
    openfoodfacts_request_product("8717163936795")