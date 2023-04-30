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

const address = "localhost:8081";
const proto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

const inventoryService = grpc.loadPackageDefinition(packageDefinition).InventoryService;
const getInventory = new inventoryService(REMOTE_HOST, grpc.credentials.createInsecure());
let inventory = {};
getInv();

server.addService(proto.ShoppingCartService.service, {
  add_product: (call, callback) => {
    const user = call.request.package;
    const item = call.request.container;
    getInv();
    let rawdata;
    if (fs.existsSync(user.concat('', '.json'))) {
      rawdata = JSON.parse(fs.readFileSync(user.concat('', '.json'), 'utf-8'));
      if (rawdata[item])
        rawdata[item] += 1;
      else rawdata[item] = 1;
    } else {
      rawdata = {};
      rawdata[item] = 1;
    }
    let data = JSON.stringify(rawdata, null, 4);
    fs.writeFileSync(user.concat('', '.json'), data);
    callback(null, { package: "agregao" });
  },

  delete_product: (call, callback) => {
    const user = call.request.package;
    const item = call.request.container;
    getInv();
    let rawdata;
    if (fs.existsSync(user.concat('', '.json'))) {
      rawdata = JSON.parse(fs.readFileSync(user.concat('', '.json'), 'utf-8'));
      if (rawdata[item]) {
        if (rawdata[item] > 1) {
          rawdata[item] -= 1;
        } else {
          delete rawdata[item];
        }
        let data = JSON.stringify(rawdata, null, 4);
        fs.writeFileSync(user.concat('', '.json'), data);
        callback(null, { package: "Eliminao " })
      }
      else callback(null, { package: "no se ha eleminao na" })
    }
    else callback(null, { package: "No existes bro" });
  },

  show_list: (call, callback) => {
    const user = call.request.package;
    getInv();
    let rawdata
    if (fs.existsSync(user.concat('', '.json'))) {
      rawdata = fs.readFileSync(user.concat('', '.json'));
      callback(null, { package: rawdata });
    } else
      callback(null, { package: "No existe ese usuario" });
  }
});

function getInv() {
  getInventory.list_products({}, (err, data) => {
    if (err) {//Si hay un error
      console.log(err);
    } else {
      inventory = JSON.parse(data["package"].replace(/'/g, '"'));
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