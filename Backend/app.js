const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const fs = require('fs')
var expressWs = require('express-ws')(app);
const axios = require('axios')
const cors = require('cors')
app.use(cors({
    origin: 'https://dev-ararat.hyehosting.com',
}));
const T = require('./Modules/Terminal')
app.use(function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');
  
    req.on('data', function(chunk) { 
      req.rawBody += chunk;
    });
  
    req.on('end', function() {
      next();
    });
  });

/**
* @typedef {Object} Subuser
* @property {number} id
* @property {number} user_id
* @property {number} server_id
* @property {string} permissions
* @property {string} created_at
* @property {string} updated_at
*/

/**
* @typedef {Object} Server
* @property {string} object
* @property {Attributes} attributes
*/
/**
* @typedef {Object} Attributes
* @property {number} id
* @property {string} external_id
* @property {string} uuid
* @property {string} identifier
* @property {string} name
* @property {string} description
* @property {boolean} suspended
* @property {Limits} limits
* @property {FeatureLimits} feature_limits
* @property {number} user
* @property {number} node
* @property {number} allocation
* @property {number} nest
* @property {number} egg
* @property {object} pack
* @property {Container} container
* @property {string} updated_at
* @property {string} created_at
* @property {Relationships} relationships
* @property {number} server
* @property {number} host
* @property {string} database
* @property {string} username
* @property {string} remote
* @property {number} max_connections
*/
/**
* @typedef {Object} Limits
* @property {number} memory
* @property {number} swap
* @property {number} disk
* @property {number} io
* @property {number} cpu
* @property {object} threads
*/
/**
* @typedef {Object} FeatureLimits
* @property {number} databases
* @property {number} allocations
* @property {number} backups
*/
/**
* @typedef {Object} Container
* @property {string} startup_command
* @property {string} image
* @property {boolean} installed
* @property {Environment} environment
*/
/**
* @typedef {Object} Environment
* @property {string} SERVER_JARFILE
* @property {string} VANILLA_VERSION
* @property {string} STARTUP
* @property {string} P_SERVER_LOCATION
* @property {string} P_SERVER_UUID
*/
/**
* @typedef {Object} Relationships
* @property {Databases} databases
*/
/**
* @typedef {Object} Databases
* @property {string} object
* @property {Data[]} data
*/
/**
* @typedef {Object} Data
* @property {string} object
* @property {Attributes} attributes
*/
var WebSocketClient = require('websocket').client;
const jwt_secret = "SHllJ3MgaGFyZCB3b3JrIGd1YXJkZWQgYnkgdGhlc2Ugd29yZHMgcGxlYXNlIGRvbid0IHN0ZWFs"
const application_api = "rSmjDbp3Hsmyn12SybEu3gLiIHe6pd8UDFoZuRHdByl5IOQB"
const client_api = "bmXwxNpiG8Z402cFFdiL3xmeALZKUGgcv1IP8M0nf7NSA2Zh"
app.ws('/ws/resources/:server', function(ws, req) {
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }), function(err, results){
        if (err) {res.sendStatus(403)} else {
            axios.get(`https://ararat.hyehosting.com/api/client/servers/${req.params.server.split('-')[0]}/websocket`, {
                headers: {
                    Authorization: `Bearer ${client_api}`
                }
            }).then((response => {
                var data = response.data.data
                var consoles = new WebSocketClient(data.socket)
                client.on('connect', function(connection) {
                    connection.sendUTF(`{"event":"auth","args":["${data.token}"]}`)
                    connection.on('message', function(message) {
                        ws.send(message.utf8Data)
                    });
                })
            }))
        }
    }

});
app.get('/', function (req, res) {
    res.send('Project The Rat Backend')
})
app.get('/resources/:server', (req, res, next)=>{
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`https://de-fsn-1.hyehosting.com:8443/api/resource/${req.params.server}`, {
                headers: {
                    Authorization: `Bearer XzRqzCPu6Axned8soCjoLqrG38XHwMlULpTGg2gRTe3LlLD1n7k7wfXM0U7yJVqK`
                }
            }).then((response => {
                res.send(response)
            }))
        }
    })
})
app.get('/allocation/:allocation', async function(req, res){
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`http://ararat.hyehosting.com:8080/allocation?auth=6UD5Twj3P7a3Ex54pPPCUJ5APCKQwb2NgQsDVzh3T87JvyxfM5HP9rCQeEKBwU4uCUTRchmxhThAKy8z7SjeguPV8Aqr5NVXGXXrqpvW3GxVDrP&allocation=${req.params.allocation}`, {
                headers: {
                    Authorization: `Bearer ${client_api}`
                }
            }).then((response => {
                res.send(response.data)
            }))
        }
    })
})
app.get('/servers', async function (req, res) {
    console.log('hi')
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get('https://ararat.hyehosting.com/api/application/servers', {
                headers: {
                    Authorization: `Bearer ${application_api}`
                }
            }).then(response => {
                var all_servers = response.data
        
                var user_servers = all_servers.data.filter(entry => entry.attributes.user == `${results.id}`)
                axios.get(`http://198.251.83.117:8080/subusers?user=${results.id}&auth=6UD5Twj3P7a3Ex54pPPCUJ5APCKQwb2NgQsDVzh3T87JvyxfM5HP9rCQeEKBwU4uCUTRchmxhThAKy8z7SjeguPV8Aqr5NVXGXXrqpvW3GxVDrP`).then(ress => {
                    /**
                     * @type {Subuser[]}
                     */
                     axios.get(`https://ararat.hyehosting.com/api/application/users/${results.id}`, {
                headers: {
                    Authorization: `Bearer ${application_api}`
                }
            }).then(userresponse => {
                var dddd = userresponse.data.attributes.root_admin
                var data = ress.data
                console.log(userresponse.data.attributes)
                var subuser_servers = []
                if (!dddd == true) {
                    for (var s of data) {
                        for (var entry of all_servers.data) {
                           if(entry.attributes.id == `${s.server_id}`) {
                               subuser_servers.push(entry)
                           }
                        }
                       
                    }
                    if (subuser_servers) {
                        var access_servers = user_servers.concat(subuser_servers)
                    } else {
                        var access_servers = user_servers
                    }
                } else {
                    var access_servers = all_servers.data;
                }
                   
                   
                res.send(access_servers)
              
                
              
                
                
            })
                    
                })
                //axios.get('https://ararat.hyehosting.com/api/client/servers/1a7ce997/users', {
                //headers: {
                //  Authorization: `Bearer ${application_api}`
                // }
                // }).then(responses => {
                //   var all_servers = response.data
                // var user_servers = all_servers.data.filter(entry => entry.attributes.user== `${results.id}`)
                //res.send(user_servers)
                //})

            })
        }
    })
})

app.get('/servers/:uuid/resources', async function (req, res) {
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`https://ararat.hyehosting.com/api/client/servers/${req.params.uuid}/resources`, {
                headers: {
                    Authorization: `Bearer ${client_api}`
                }
            }).then((response => {
                res.send(response.data)
            }))
        }
    })
})

app.get('/server/:uuid', async function (req, res) {
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`https://ararat.hyehosting.com/api/client/servers/${req.params.uuid}`, {
                headers: {
                    Authorization: `Bearer ${client_api}`
                }
            }).then((response => {
                res.send(response.data)
            }))
        }
    })
})
app.get('/server/:uuid/type', async function (req, res) {
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`https://ararat.hyehosting.com/api/application/servers`, {
                headers: {
                    Authorization: `Bearer ${application_api}`
                }
            }).then((response => {
                var server_object = response.data.data.filter((server) => server.attributes.identifier == req.params.uuid)[0];
                if (server_object.attributes.egg == 17) {
                    res.send('N-VPS')
                } else if (server_object.attributes.egg == 1 || server_object.attributes.egg == 2 || server_object.attributes.egg == 3 || server_object.attributes.egg == 4 || server_object.attributes.egg == 5) {
                    res.send('Minecraft')
                } else {
                    res.send('Unknown')
                }
            }))
        }
    })
})
app.get('/server/:uuid/type', async function (req, res) {
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`https://ararat.hyehosting.com/api/application/servers`, {
                headers: {
                    Authorization: `Bearer ${application_api}`
                }
            }).then((response => {
                /**
                 * @type {Server[]}
                 */
                var servers = response.data
                //servers.filter((e) => e.attributes.)
            }))
        }
    })
})
app.ws('/server/n-vps/console', (socket, req) => {
    let server = req.query.server
    console.log(server)
    const Terminal = new T.Terminal('/srv/Ararat/backend/cert/server.crt', '/srv/Ararat/backend/cert/server.key', 'https://94.130.132.47:8989/', server)
    Terminal.get().then((val) => {
        socket.on("message", (msg) => {
            console.log(msg)
            val.send(msg,
                {
                    binary: true,
                },
                () => { });
        });
        val.on('message', data => {
            const buf = Buffer.from(data);
            data = buf.toString();
            if (socket.readyState == 1) {
                socket.send(data);
            }
        });
    })


});
app.ws('/server/minecraft/console', async (socket, req) => {
    const ws = require('ws')
    let server = req.query.server
    const d = (await axios.get('https://ararat.hyehosting.com/api/client/servers/' + server + '/websocket', {
        headers: {
            Authorization: `Bearer bmXwxNpiG8Z402cFFdiL3xmeALZKUGgcv1IP8M0nf7NSA2Zh`
        }
    })).data.data
    const token = d.token
    const serversocket = d.socket
    const serverWS = new ws(serversocket, {
        headers: {
            'Origin': 'https://ararat.hyehosting.com'
        }
    })
    serverWS.on('open', () => {
        console.log('opennn')
        serverWS.send(`{"event":"auth","args":["${token}"]}`)
        setTimeout(() => {
            serverWS.send('{"event":"send logs","args":[null]}')
        }, 10)
        socket.on('message', function (msg) {
            console.log(msg)
            serverWS.send(`{"event":"send command","args":["${msg}"]}`)
        });
        serverWS.on('message', (data) => {
            console.log(JSON.parse(data.toString()))
            let pa = JSON.parse(data.toString())
            if (pa.event == 'console output') {
                socket.send(pa.args[0])
            }
            if (pa.event == 'jwt error') {
                socket.send('ERR_JWT_NOT_VALID')
            }

        })
    })
});
app.ws('/server/minecraft/resws', async (socket, req) => {
    const ws = require('ws')
    let server = req.query.server
    const d = (await axios.get('https://ararat.hyehosting.com/api/client/servers/' + server + '/websocket', {
        headers: {
            Authorization: `Bearer bmXwxNpiG8Z402cFFdiL3xmeALZKUGgcv1IP8M0nf7NSA2Zh`
        }
    })).data.data
    const token = d.token
    const serversocket = d.socket
    console.log(serversocket)
    const serverWS = new ws(serversocket, {
        headers: {
            'Origin': 'https://ararat.hyehosting.com'
        }
    })
    serverWS.on('open', () => {
        console.log('opennn')
        serverWS.send(`{"event":"auth","args":["${token}"]}`)

 
        serverWS.on('message', (data) => {
    
                socket.send(data)
       
        

        })
    })
});
app.get('/server/:uuid/files', function(req, res){
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`https://ararat.hyehosting.com/api/client/servers/${req.params.uuid}/files/list?directory=${req.query.directory}`, {
                headers: {
                    Authorization: `Bearer ${client_api}`
                }
            }).then((response => {
                res.send(response.data)
            })).catch(error => {
                console.log(error)
            })
        }
    })
})
app.get('/server/:uuid/files/contents', function(req, res){
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`https://ararat.hyehosting.com/api/client/servers/${req.params.uuid}/files/contents?file=${req.query.file}`, {
                headers: {
                    Authorization: `Bearer ${client_api}`
                }
            }).then((response => {
                res.send(response.data)
            })).catch(error => {
                console.log(error)
            })
        }
    })
})
app.get('/server/:uuid/files/download', function(req, res){
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.get(`https://ararat.hyehosting.com/api/client/servers/${req.params.uuid}/files/download?file=${req.query.file}`, {
                headers: {
                    Authorization: `Bearer ${client_api}`
                }
            }).then((response => {
                res.send(response.data)
            })).catch(error => {
                console.log(error)
            })
        }
    })
})

app.post('/server/:uuid/files/write', function(req, res){
    console.log(req.rawBody)
    jwt.verify(req.query.token, jwt_secret, {
        algorithm: 'HS256'
    }, function (err, results) {
        if (err) { res.sendStatus(403) } else {
            axios.post(`https://ararat.hyehosting.com/api/client/servers/${req.params.uuid}/files/write?file=${req.query.file}`, req.rawBody, {
                headers: {
                    Authorization: `Bearer ${client_api}`
                }
            }).then((response => {
                res.send('success')
            })).catch(error => {
                res.send('error')
                console.log(error)
            })
        }
    })
})

app.listen(3001)