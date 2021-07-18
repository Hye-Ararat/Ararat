const url = require("url")
const fs = require('fs')
const https = require('https')
const axios = require('axios').default
const ws = require('ws')
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

class Terminal {
    agent = {}
    containerName=''
    shell=''
    host=''
    /**
     * 
     * @returns {Promise<ws>}
     */
    get() {
        return new Promise(async (resolve, reject) => {
            var body = {
                "command":[this.shell],
                "environment":{
                    HOME: '/root',
                    TERM: 'xterm',
                    USER: 'root',
                  },
                "interactive":true,
                "wait-for-websocket":true,
                "width": 120,
                "height": 80
              }
              console.log(this.agent)
              try {
                var response = (await axios.post(this.host + '1.0/containers/'+this.containerName+'/exec',body,{
                    httpsAgent: this.agent
                })).data;
                console.log(response)
              } catch (error) {
                  console.log(error)
              }
            var u = new URL(this.host)
            var wsurl = 'wss://' + u.hostname + ':' + u.port + response.operation + '/websocket?secret=' + response.metadata.metadata.fds['0'];
            console.log(wsurl)
            resolve(new ws(wsurl, {
                cert: this.agent.options.cert,
                key: this.agent.options.key,
                rejectUnauthorized: false
            }))
        })

    }
    constructor(cert, key, host, name, shell) {
           this.containerName = name
           if (shell) {
               this.shell = shell
           } else {
               this.shell = '/bin/bash'
           }
           this.host = host

        this.agent = new https.Agent({
            cert: fs.readFileSync(cert),
            key: fs.readFileSync(key),
            rejectUnauthorized: false
        })
    }
}

module.exports = {
    Terminal
}