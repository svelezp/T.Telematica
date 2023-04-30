import json
import grpc
import servicios_pb2
import servicios_pb2_grpc
from concurrent import futures

HOST = '[::]:8080'

class InventoryService(servicios_pb2_grpc.InventoryServiceServicer):
    def add_product(self, request, context):
        product = request.package
        price = int(request.container)
        with open("servicio1.json") as servicio1:
            inventory = json.load(servicio1)
        inventory[product] = {"precio":price ,"cantidad":1 }
        with open("servicio1.json", 'w') as servicio1:
            json.dump(inventory, servicio1, indent=4)
        return servicios_pb2.EasyRequest(package=":D")


    def update_quantity(self, request, context):
        name = request.package
        quantity = int(request.container)
        with open("servicio1.json") as servicio1:
            inventory = json.load(servicio1)
        if inventory[name]:
            inventory[name]["cantidad"] = quantity
        with open("servicio1.json", 'w') as servicio1:
            json.dump(inventory, servicio1, indent=4)
        return servicios_pb2.EasyRequest(package=":D")


    def get_product_by_name(self, request, context):
        name = request.package
        with open("servicio1.json") as servicio1:
            inventory = json.load(servicio1)
        if inventory[name]:
            return servicios_pb2.HardRequest(package="Si existe", container=":D")
        return servicios_pb2.HardRequest(package="No existe", container="D:")

    def list_products(self, request, context):
        with open("servicio1.json") as servicio1:
            inventory = json.load(servicio1)
        return servicios_pb2.EasyRequest(package=str(inventory))

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    servicios_pb2_grpc.add_InventoryServiceServicer_to_server(InventoryService(), server)
    server.add_insecure_port('[::]:8080')
    print("Service is running... ")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()