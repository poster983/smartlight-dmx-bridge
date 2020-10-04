const config = require('config');

module.exports = class Lights {
    constructor() {
        this.universe = {};
    }

    addLIFX(light) {
        let cfg = config.lights[light.address]
        //config.get('lights.'+light.address);
        
        if(cfg) {
            if(cfg.platform !== "lifx") {
                throw new TypeError("\"platfprm\" in the config must be set to \"lifx\" for the following light: " + light.address)
            }
            if(!this.universe[cfg.universe]) {
                this.universe[cfg.universe] = {}
            }
            this.universe[cfg.universe][cfg.address] = {light: light, platform: "lifx", type: cfg.type};
        }
        return this;
    }

    fromSACN(packet) {

        let universe = this.universe[packet.universe];
        
        if(universe) {
            let addresses = Object.keys(universe); // get the keys in the universe and check their 
            for(let x = 0; x < addresses.length; x++) {
                let baseAddr = parseInt(addresses[x]);
                let light = universe[baseAddr];
                if(packet.payload[baseAddr]) { //check if the packet is meant for us
                    //console.log("on")
                    //console.log(255*(packet.payload[baseAddr])/100, 255*(packet.payload[baseAddr+1]||0)/100, 255*(packet.payload[baseAddr+2]||0)/100)
                    switch (light.platform) {
                        case "lifx": {
                            let color = {red: 255*(packet.payload[baseAddr])/100, green: 255*(packet.payload[baseAddr+1]||0)/100, blue: 255*(packet.payload[baseAddr+2]||0)/100}
                            if(JSON.stringify(this.universe[packet.universe][baseAddr].lastValues) === JSON.stringify(color)) {
                                continue;
                            }
                            //console.log("Non");
                            //light.light.on(0)
                            light.light.colorRgb(color.red, color.green, color.blue, 500);
                            this.universe[packet.universe][baseAddr].lastValues = {red: color.red, green: color.green, blue: color.blue}
                        }
                    }
                    //let packet.payload[addresses[x]]
                } else {
                    //light.light.off(70);
                }
            }
            
        }
    }


}