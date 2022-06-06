import json
import time

from flask import Flask, request, escape, jsonify
import off_api

app = Flask(__name__)

history_filename = "flist_history.json"


def add_product_to_history(product_code, product_comment, user, deviceid):
    time_of_scan = time.time()

    history_list = get_history_list()

    # print(f"history list: ", history_list)

    history_item = {
        "product_code": product_code,
        "product_comment": product_comment,
        "user": user,
        "device_id": deviceid,
        "status": "tobuy",
        "time_added": time_of_scan
    }

    history_list.append(history_item)

    with open(history_filename, 'w') as outfile:
        json.dump(history_list, outfile)


def get_history_list():
    try:
        with open(history_filename) as file:
            data = json.load(file)

        return data
    except FileNotFoundError:
        return []

def get_shopping_list_data():
    shopping_list = [x for x in get_history_list() if x["status"] == "tobuy"]
    return shopping_list

def expand_data_with_api(data_list):
    for item in data_list:
        item["off_data"] = get_product(item["product_code"])

    return data_list


@app.route("/flist/get_product_history")
def get_product_history():
    history_list = get_history_list()

    history_list = expand_data_with_api(history_list)

    return jsonify(history_list)

@app.route("/flist/get_shopping_list")
def get_shopping_list():
    shoppinglist = expand_data_with_api(get_shopping_list_data())
    return jsonify(shoppinglist)

@app.route("/flist/get_product/<productcode>")
def get_product(productcode):
    if not productcode:
        return "Please provide product_code!"

    return off_api.openfoodfacts_request_product(productcode)

@app.route("/flist/delete_list", methods=['POST'])
def deletelist():
    delete_ids = json.loads(request.form.get('delete_ids'))
    history_list = get_history_list()

    for history_item in history_list:
        if int(history_item["time_added"]) in delete_ids:
            history_item["status"] = "bought"

    with open(history_filename, 'w') as outfile:
        json.dump(history_list, outfile)

    return get_shopping_list()


@app.route("/flist/add_to_basket", methods=['POST'])
def add_to_basket():
    product_code = request.form.get('product_code')
    product_comment = request.form.get('product_comment')
    device_name = request.form.get('device_name')
    android_id = request.form.get('android_id')

    print(f"Add to basket {product_code}, {product_comment}")

    add_product_to_history(product_code, product_comment, device_name, android_id)

    off_data = get_product(product_code)

    response = {
        "success": True,
        "off_data": off_data
    }

    return response


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
