const config = require('config');
const lifx = require("./platforms/lifx");

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
                
                lifx(packet, light, baseAddr);
                
            }
            
        }
    }


}