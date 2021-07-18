const ws = require('ws')
const fs = require('fs')
/**
* @typedef {Object} OperationWS
* @property {string} type
* @property {string} status
* @property {number} status_code
* @property {string} operation
* @property {number} error_code
* @property {string} error
* @property {Metadata} metadata
*/
/**
* @typedef {Object} Metadata
* @property {string} id
* @property {string} class
* @property {string} description
* @property {string} created_at
* @property {string} updated_at
* @property {string} status
* @property {number} status_code
* @property {Resources} resources
* @property {Metadata} metadata
* @property {string} command
* @property {Environment} environment
* @property {Fds} fds
* @property {boolean} interactive
* @property {boolean} may_cancel
* @property {string} err
* @property {string} location
*/
/**
* @typedef {Object} Resources
* @property {string} containers
* @property {string} instances
*/
/**
* @typedef {Object} Environment
* @property {string} HOME
* @property {string} LANG
* @property {string} PATH
* @property {string} POWERED_BY
* @property {string} USER
*/
/**
* @typedef {Object} Fds
* @property {number} "0"
* @property {string} control
*/
class Websocket extends ws {
    /**
     * @param {OperationWS} wsURL 
     */
    constructor(wsURL, cert, key) {
       super(wsURL, {
        cert: fs.readFileSync(cert),
        key: fs.readFileSync(key),
        rejectUnauthorized: false 
      })

    }
}