import { NanoleafClient, ServiceDiscovery } from 'nanoleaf-client';
 
let serviceDiscovery = new ServiceDiscovery();
 
serviceDiscovery.discoverNanoleaf().then(devices => {
 
  // devices is an array of all Nanoleaf devices found on the network.
  // device info contains location info, uuid and device Id.

  devices.forEach((device) => {
    //console.log(device)
    console.log("Device IP: ", device.location.hostname)
    let noTokenClient = new NanoleafClient(device.location.hostname);
    noTokenClient.authorize().then(token => {
      console.log("|   Token: ", token);
    }).catch(err => {
        console.log("|   ", err);
        if(err.status == 403) {
          console.error(`|
|    Before executing this command, hold power button on your nanoleaf device for 5 seconds until the white LED starts glowing. After that you have 30 seconds to execute this command and get a token. Client will be authorized automatically.
|
|    NOTE: Device can hold up to 5 tokens. New tokens come in FIFO order`)
        }
    });
  })
  
});