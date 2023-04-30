import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import fs from 'fs'


dotenv.config()

const PROTO_PATH = process.env.PROTO_PATH;
const REMOTE_HOST = process.env.REMOTE_HOST;

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
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
let inventory = {};
getInv();

server.addService(proto.MOMService.service, {
  add_product: (call, callback) => {
    const user = call.request.package;
    const item = call.request.container;
    getInv();
    let rawdata;
    if (fs.existsSync(user.concat('', '.json'))) {
      rawdata = JSON.parse(fs.readFileSync(user.concat('','.json'), 'utf-8'));
      if(rawdata[item])
        rawdata[item] += 1;
      else rawdata[item] = 1;
    }else{
      rawdata = JSON.parse({item:1});
    }
    inventory[item]
    JSON.parse();
    callback(null, { package:"Wrong user or password" });
  },
  delete_product: (call, callback) => {
    JSON.parse(call.request.package);
    callback(null, { package: "Wrong user or password" });
  },
  show_list: (call, callback) => {
    JSON.parse(call.request.package);
    callback(null, { package: "Wrong user or password" });
  }
});

function getInv(){
  getInventory.list_products({}, (err, data) => {
    if (err) {//Si hay un error
      console.log(err);
    } else{
      inventory = JSON.dumps(data["package"])// como volver string a dictionario node js
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