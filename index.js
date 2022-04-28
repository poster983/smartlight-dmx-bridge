/*const Lights = require("./Lights.js");
const { Receiver } = require('sacn');
const config = require('config');
const lightConfig = config.get("lights")*/

import sacn from 'sacn';
const {Receiver} = sacn

import config from 'config'
const lightConfig = config.get("lights")
console.log({
  universes: config.get("sACN.universes"),
  port: config.get("sACN.port"),
  iface: config.get("sACN.iface"),
  reuseAddr: config.get("sACN.reuseAddr"),
  // see table 1 below for all options
})

import Lights from "./Lights.js";

import { NanoleafClient, ServiceDiscovery } from 'nanoleaf-client';
import nodeLifx from "node-lifx";
const LifxClient = nodeLifx.Client;

/*** LIFX  */
//var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

let lights = new Lights()
client.on('light-new', function(light) {
  //Add lights to system
  console.log(`Found light at address: ${light.address}`);
  lights.addLIFX(light);
  light.getState((err, state) => {
    if(err) {
      throw err;
    }
    console.log(state)
    if(state.power == 0) {
      light.on();
      light.colorRgb(0,0,0,1000);
    }
  });
});

client.init()


/** NANOLEAF */
let serviceDiscovery = new ServiceDiscovery();
serviceDiscovery.discoverNanoleaf().then(devices => {


})

//for(let x = 0;  x < )


/*setTimeout(()=> {
  console.log(lights.universe)
}, 2000);*/

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
      setTimeout(() => {
        
        throttle = false;
      }, 150)
      lights.fromSACN(packet);
      console.log("GO")
      
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

