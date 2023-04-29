import json

inventory = {}

with open("servicio1.json") as servicio1:
    inventory = json.load(servicio1)

def add_product(product):
    with open("servicio1.json") as servicio1:
        inventory = json.load(servicio1)
    inventory.append(product)
    with open("servicio1.json", 'w') as servicio1:
        json.dump(inventory, servicio1, ident=4)


def update_quantity(name, quantity):
    with open("servicio1.json") as servicio1:
        inventory = json.load(servicio1)
    for product in inventory:
        if product["name"] == name:
            product["quantity"] = quantity
    with open("servicio1.json", 'w') as servicio1:
        json.dump(inventory, servicio1, ident=4)


def get_product_by_name(name):
    with open("servicio1.json") as servicio1:
        inventory = json.load(servicio1)
    for product in inventory:
        if product["name"] == name:
            return product
    return None

def list_products():
    with open("servicio1.json") as servicio1:
        inventory = json.load(servicio1)
    return inventory