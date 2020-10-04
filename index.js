const Lights = require("./Lights.js");
const { Receiver } = require('sacn');
const config = require('config');

var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

let lights = new Lights()
client.on('light-new', function(light) {
  //Add lights to system
  console.log(light.address)
  lights.addLIFX(light);
  console.log(lights.universe)
});
client.init();


const sACN = new Receiver({
    universes: config.get("sACN.universes"),
    port: config.get("sACN.port"),
    iface: config.get("sACN.iface"),
    reuseAddr: config.get("sACN.reuseAddr"),
    // see table 1 below for all options
});
let throttle = false;
sACN.on('packet', (packet) => {
  //console.log('got dmx data:', packet.payload, packet.universe);
    if(Object.keys(packet.payload).length !== 0 && packet.payload.constructor === Object) { // check that the object is not empty
        console.log('got dmx data:', packet.payload, packet.universe);
        //lights.fromSACN(packet);
    }
    if(throttle == false) {  //throttle the payload
      throttle = true;
      lights.fromSACN(packet);
      console.log("GO")
      setTimeout(() => {
        throttle = false;
      }, 70)
    }
    
    //console.log('got dmx data:', packet.payload);
    // see table 2 below for all packet properties
  });
   
  /*sACN.on('PacketCorruption', (err) => {
      console.error(err)
    // trigged if a corrupted packet is received
  });
   
  sACN.on('PacketOutOfOrder', (err) => {
    console.error(err)
    // trigged if a packet is recieved out of order
  });
  sACN.on('error', (err) => {
    console.error(err)
    // trigged if there is an internal error (e.g. the supplied `iface` does not exist)
  });*/

