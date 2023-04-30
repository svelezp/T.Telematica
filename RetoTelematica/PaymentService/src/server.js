import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

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

const address = "localhost:8081";
const server = new grpc.Server();

const inventoryService = grpc.loadPackageDefinition(packageDefinition).InventoryService;
const getInventory = new inventoryService(REMOTE_HOST, grpc.credentials.createInsecure());

server.addService(proto.MaymentService.service, {
  GetRequest: (call, callback) => {
    const list = call.request.package
    getInv();
    let rawdata
    rawdata = JSON.parse(fs.readFileSync(user.concat('', '.json'), 'utf-8'));
    callback(null, { package: rawdata, container: "Pago exitoso" });
  },
});

function getInv() {
  getInventory.list_products({}, (err, data) => {
    if (err) {//Si hay un error

    } else {
      JSON.dumps(data["package"])// como volver string a dictionario node js
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