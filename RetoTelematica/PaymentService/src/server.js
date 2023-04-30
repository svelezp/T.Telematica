import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import fs from 'fs'


dotenv.config()

const PROTO_PATH = process.env.PROTO_PATH;
const REMOTE_HOST = process.env.REMOTE_HOST;

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

console.info("Consumer service is started...");

const address = "localhost:8082";
const proto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

const cartService = grpc.loadPackageDefinition(packageDefinition).ShoppingCartService;
const getCart = new cartService(REMOTE_HOST, grpc.credentials.createInsecure());
let car;

server.addService(proto.PaymentService.service, {
  checking: (call, callback) => {
    const user = call.request.package;
    getCar(user);
    setTimeout(function () {
      console.log(car);
      callback(null, { package: car, container: "Pago exitoso" });
    }, 1000);
  },
});

function getCar(user) {
  getCart.show_list({ package: user }, (err, data) => {
    if (err) {//Si hay un error
      console.log(err);
    } else {
      car = data["package"].replace(/'/g, '"');
    }
  });
}

server.bindAsync(//Se inicia el lado servidor para recibir requests del Proxy
  address,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at ", address);
    server.start();
  });