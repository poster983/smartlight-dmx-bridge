
/**
 * Handles a bulb changing
 * Looks for 3 values starting at the base addr
 * @param {Object} packet 
 * @param {Object} light 
 * @param {Number} baseAddr 
 */
function handleBulb(packet, light, baseAddr) {
    
    if(packet.payload[baseAddr] || packet.payload[baseAddr+1] || packet.payload[baseAddr+2]) { //check if it is for us
        
        //make color object
        let color = {red: 255*(packet.payload[baseAddr]||0)/100, green: 255*(packet.payload[baseAddr+1]||0)/100, blue: 255*(packet.payload[baseAddr+2]||0)/100}
        //stop the function if the bulb will not change
        if(JSON.stringify(light.lastValues) === JSON.stringify(color)) { 
            return;
        }

        console.log("SENDING TO LIFX BULB", color);
        //light.light.on(0)
        //change light
        light.light.colorRgb(color.red, color.green, color.blue, 150);
        light.lastValues = {red: color.red, green: color.green, blue: color.blue}
    } else { // if not we assume the light should be off
        if(JSON.stringify(light.lastValues) === JSON.stringify({red: 0, green: 0, blue: 0})) { // skip if nothinf changed
            return;
        }
        console.log("LIFX LIGHT OFF");
        light.light.colorRgb(0, 0, 0, 150);
        light.lastValues = {red: 0, green: 0, blue: 0}
    }
}




/**
 * Takes in the packet info and light info and delegates it out to the device types
 * @param {Object} packet 
 * @param {Object} light 
 * @param {Number} baseAddr 
 */
module.exports = (packet, light, baseAddr) => {
    
    switch(light.type) {
        case "bulb": 
        
            handleBulb(packet, light, baseAddr);
            
            break;
        
        case "strip": 
            handleBulb(packet, light, baseAddr); //TEMP for now
            break;
        
    }
}
