/**
 * 
 * @param {string} identifier 
 * @returns {string}
 */
 function convertNetworkID (identifier) {
    const md5 = require("md5")
    return md5(identifier).slice(0, 15)
}
/**
 * 
 * @param {string} identifier 
 * @returns {string}
 */
function convertID(identifier) {
    const md5 = require("md5")
    identifier = md5(identifier);
    for (const i of identifier) {
        if (i >='0' && i <= '9') {
            identifier = identifier.substring(1)
        } else {
            break;
        }
    }
    return identifier.slice(0, 15);
}
module.exports = {
    convertID,
    convertNetworkID
};
