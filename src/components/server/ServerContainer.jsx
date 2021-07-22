import { useEffect, useState } from "react"
import getServer from '../../api/server/getServer'
import { useParams } from 'react-router-dom'
import FadeIn from '../Fade'
import Navigation from '../Navigation'
import { Bar } from 'react-chartjs-2';
import prettyBytes from "pretty-bytes"
import Header from '../Header'
import getServerType from '../../api/server/getServerType'
import Cookies from 'js-cookie'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import getServerResources from "../../api/server/resources/getServerResources"
import getServerStatusData from "../../api/server/minecraft/players/getServerStatusData"
import Footer from "../Footer"
function ServerContainer() {
  const { uuid } = useParams()
  var [server_data, setServerData] = useState(() => {
    return (null)
  })
  var [cpu_usage, setCpuUsage] = useState(() => {
    return (null)
  })
  var [memory_usage, setMemoryUsage] = useState(() => {
    return (null)
  })
  var [server_type, setServerType] = useState(() => {
    return(null)
  })
  var [sock, setSock] = useState(() => {
    return({})
  })
  var [input, setInput] = useState(() => {
    return('')
  })
  var [players, setPlayers] = useState(() => {
    return(null)
  })
  var [console_load, setConsoleLoad] = useState(() => {
    return(false)
  })

  useEffect(() => {
    getServer(uuid, function (response) {
      document.title = `${response.attributes.name} | Console`
      console.log(response)
      setServerData(response)
      getServerType(uuid, function(type){
        setServerType(type)
        if (type == "Minecraft"){
          try{
            const terminal = new Terminal({
              disableStdin: true,
              theme:{
                background: '#1e1e1e'
              }
            })
            const fitAddon = new FitAddon()
            terminal.loadAddon(fitAddon)
            setConsoleLoad(true)
            const terminalContainer = document.getElementById('console')
            terminal.open(terminalContainer)

   
            var consoleSocket = new WebSocket(`wss://ararat-backend.hyehosting.com/server/minecraft/console?server=${uuid}`)
            setSock(consoleSocket)
            try{
            fitAddon.fit()
            } catch(error){
              console.log(error)
            }
            window.onresize = () => {
              try{
              fitAddon.fit()
              } catch(error){
                console.log(error)
              }
            }
            consoleSocket.onmessage = (e) => {
              if (e.data == "ERR_JWT_NOT_VALID"){
                document.location.reload()
              }
              console.log(e.data)
              terminal.writeln(e.data)
            }
          } catch (error){
            console.log(error)
          }
        }
        if (type == "N-VPS"){
          try {
            const terminal = new Terminal({})
            const fitAddon = new FitAddon()
            const attachAddon = new AttachAddon(new WebSocket('wss://ararat-backend.hyehosting.com/server/n-vps/console?server=' + response.attributes.uuid.replace(/[0-9]/g, '').replace(/[^a-zA-Z ]/g, "")))
            terminal.loadAddon(fitAddon)
            terminal.loadAddon(attachAddon)
            setConsoleLoad(true)
            const terminalContainer = document.getElementById('console')
            terminal.open(terminalContainer)
            fitAddon.fit()
            window.onresize = () => {
              var checkTerminalContainer = document.getElementById('console')
              if (checkTerminalContainer){
                fitAddon.fit()
              }
            }
          } catch(error){
            console.log(error)
          }
        }
      })
    })
  }, [])
  
  function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  useEffect(() => {
    function ecommerceLineS1(selector, set_data) {
      var ctx = document.getElementById('totalOrders').getContext("2d");
      var ctram = document.getElementById('ramUsage').getContext("2d");
      var myChart = new window.Chart(ctx, {
        type: 'line',
        data: {

          labels: Array(20).fill(''),
          datasets: [
            {
              label: "CPU Usage",
              tension: .3,
              backgroundColor: window.NioApp.hexRGB("#7de1f8", .25),
              borderWidth: 2,
              borderColor: "#7de1f8",
              pointBorderColor: 'transparent',
              pointBackgroundColor: 'transparent',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#7de1f8",
              pointBorderWidth: 2,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 2,
              pointRadius: 4,
              pointHitRadius: 4,
              data: Array(20).fill(0)

            },
          ],
        },
        options: {
          animation: {
            duration: 0,
          },
          legend: {
            display: false,
            rtl: window.NioApp.State.isRTL,
            labels: {
              boxWidth: 12,
              padding: 20,
              fontColor: '#6783b8'
            }
          },
          maintainAspectRatio: false,
          tooltips: {
            enabled: true,
            rtl: window.NioApp.State.isRTL,
            backgroundColor: '#1c2b46',
            titleFontSize: 10,
            titleFontColor: '#fff',
            titleMarginBottom: 4,
            bodyFontColor: '#fff',
            bodyFontSize: 10,
            bodySpacing: 4,
            yPadding: 6,
            xPadding: 6,
            footerMarginTop: 0,
            displayColors: false
          },
          scales: {
            yAxes: [{
              display: false,
              ticks: {
                beginAtZero: true,
                fontSize: 12,
                fontColor: '#9eaecf',
                padding: 0,
                max: 100
              },
              gridLines: {
                color: window.NioApp.hexRGB("#526484", .2),
                tickMarkLength: 0,
                zeroLineColor: window.NioApp.hexRGB("#526484", .2)
              }
            }],
            xAxes: [{
              display: false,
              ticks: {
                fontSize: 12,
                fontColor: '#9eaecf',
                source: 'auto',
                padding: 0,
                reverse: window.NioApp.State.isRTL
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 0,
                zeroLineColor: window.NioApp.hexRGB("#526484", .2),
                offsetGridLines: true
              }
            }]
          }
        }
      });
      getServer(uuid, function(response){
        var myChart2 = new window.Chart(ctram, {
          type: 'line',
          data: {
  
            labels: Array(20).fill(''),
            datasets: [
              {
                label: "Memory Usage",
                tension: .3,
                backgroundColor: window.NioApp.hexRGB("#1ee0ac", .25),
                borderWidth: 2,
                borderColor: "#1ee0ac",
                pointBorderColor: 'transparent',
                pointBackgroundColor: 'transparent',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#7de1f8",
                pointBorderWidth: 2,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 2,
                pointRadius: 4,
                pointHitRadius: 4,
                data: Array(20).fill(0)
  
              },
            ],
          },
          options: {
            animation: {
              duration: 0,
            },
            legend: {
              display: false,
              rtl: window.NioApp.State.isRTL,
              labels: {
                boxWidth: 12,
                padding: 20,
                fontColor: '#6783b8'
              }
            },
            maintainAspectRatio: false,
            tooltips: {
              enabled: true,
              rtl: window.NioApp.State.isRTL,
              backgroundColor: '#1c2b46',
              titleFontSize: 10,
              titleFontColor: '#fff',
              titleMarginBottom: 4,
              bodyFontColor: '#fff',
              bodyFontSize: 10,
              bodySpacing: 4,
              yPadding: 6,
              xPadding: 6,
              footerMarginTop: 0,
              displayColors: false
            },
            scales: {
              yAxes: [{
                display: false,
                ticks: {
                  beginAtZero: true,
                  fontSize: 12,
                  fontColor: '#9eaecf',
                  padding: 0,
                  max: parseFloat(prettyBytes(response.attributes.limits.memory * 1048576, {binary: 'true'}))
                },
                gridLines: {
                  color: window.NioApp.hexRGB("#526484", .2),
                  tickMarkLength: 0,
                  zeroLineColor: window.NioApp.hexRGB("#526484", .2)
                }
              }],
              xAxes: [{
                display: false,
                ticks: {
                  fontSize: 12,
                  fontColor: '#9eaecf',
                  source: 'auto',
                  padding: 0,
                  reverse: window.NioApp.State.isRTL
                },
                gridLines: {
                  color: "transparent",
                  tickMarkLength: 0,
                  zeroLineColor: window.NioApp.hexRGB("#526484", .2),
                  offsetGridLines: true
                }
              }]
            }
          }
        });
        function getserverWS(myChartss, myChartRam) {
          getServerType(uuid, function(type){
            console.log('type is '+type)
            if (type == "Minecraft"){
              var ws = new window.WebSocket(`wss://ararat-backend.hyehosting.com/server/resws?server=${uuid}&token=${Cookies.get('token')}`)
              ws.onmessage = function (event) {
                if (!typeof event.data == 'object') return;
                if (!JSON.parse(event.data).args) return;
                try {
                  getServer(uuid, function (response) {
                    try {
                      const d = JSON.parse(JSON.parse(event.data).args[0])
                      const cpu_usage = document.getElementById('cpu-numbers')
                      var current_cpu_1 = d.cpu_absolute * 100
                      var real_cpu = current_cpu_1 / response.attributes.limits.cpu
                      if (real_cpu > 100) {
                        var real_cpu = 100
                      }
                      setCpuUsage(`${(real_cpu).toFixed(2)}%`)
                      if (parseFloat(prettyBytes(d.memory_bytes, { binary: 'true' })) > parseFloat(parseFloat(prettyBytes(response.attributes.limits.memory * 1048576, { binrary: true })))) {
                        setMemoryUsage(prettyBytes(response.attributes.limits.memory * 1048576, { binary: 'true' }) + " / " + prettyBytes(response.attributes.limits.memory * 1048576, { binary: 'true' }))
                      } else {
                        setMemoryUsage(prettyBytes(d.memory_bytes, { binary: 'true' }) + " / " + prettyBytes(response.attributes.limits.memory * 1048576, { binary: 'true' }))
                      }
                      myChartss.data.datasets[0].data.push((real_cpu.toFixed(2)))
                      myChartss.data.datasets[0].data.shift()
                      myChartss.update()
                      myChartRam.data.datasets[0].data.push(parseFloat(prettyBytes(d.memory_bytes, { binary: 'true' })))
                      myChartRam.data.datasets[0].data.shift()
                      myChartRam.update()
                      console.log(d)
                    } catch (error) {
                      console.log(error)
                    }
                  })
                } catch (e) {
                  console.log(e)
                }
      
              }
            }
            if (type== "N-VPS"){
              //var ws = new window.WebSocket(`wss://ararat-backend.hyehosting.com/server/resws?server=${response.attributes.uuid}&token=${Cookies.get('token')}`)
              setInterval(function(){
                getServerResources(response.attributes.identifier, response.attributes.uuid).then(function(e){
                  console.log('UPDATING')
                  console.log(e)
                  setCpuUsage(e.attributes.resources.cpu_absolute + '%')
                  myChartss.data.datasets[0].data.push((e.attributes.resources.cpu_absolute))
                  myChartss.data.datasets[0].data.shift()
                  myChartss.update()
                  setMemoryUsage(prettyBytes(e.attributes.resources.memory_bytes, {binary: 'true'}))
                  myChartRam.data.datasets[0].data.push(parseFloat(prettyBytes(e.attributes.resources.memory_bytes, {binary: 'true'})))
                  myChartRam.data.datasets[0].data.shift()
                  myChartRam.update()
                }
                )
              }, 2000)

            }
          })

        }
        getserverWS(myChart, myChart2)
      })

    }
    window.$(function () {
      ecommerceLineS1()
    });
  }, [])
  function handleInputChanged(event){
    setInput(event.target.value)
  }
  function doWebsocket(event){
    event.preventDefault()
    var e = input
    var term = sock
    term.send(e)
    console.log(e)
    setInput('')
  }
  useEffect(() => {
    getServer(uuid, function(server_data){
      setInterval(function(){
        getServerStatusData(server_data.attributes.uuid, function(response){
          setPlayers(`${response.onlinePlayers} / ${response.maxPlayers}`)
          console.log(response)
        })
      }, 1000)

    })

  }, [])
  return (
    <div>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css"
                    integrity="sha512-iLYuqv+v/P4u9erpk+KM83Ioe/l7SEmr7wB6g+Kg1qmEit8EShDKnKtLHlv2QXUp7GGJhmqDI+1PhJYLTsfb8w=="
                    crossorigin="anonymous" referrerpolicy="no-referrer" />
      <base href="../" />
      <meta charSet="utf-8" />
      {/* Fav Icon  */}
      {/* StyleSheets  */}
      <div className="nk-app-root">
        {/* main @s */}
        <div className="nk-main ">
          {/* sidebar @s */}
          <Navigation page="console" group="server" type={server_type}/>
          {/* sidebar @e */}
          {/* wrap @s */}
          <div className="nk-wrap ">
            {/* main header @s */}
            <Header />
            {/* main header @e */}
            {/* content @s */}
            <div className="nk-content ">
              <div className="container-fluid">
                <div className="nk-content-inner">
                  <div className="nk-content-body">
                    <div className="nk-block-head nk-block-head-sm">
                      <div className="nk-block-between">
                        <div className="nk-block-head-content">
                          <h3 className="nk-block-title page-title">{server_data ?
                            <FadeIn>
                              {server_data.attributes.name}
                            </FadeIn>
                            : ""}</h3>
                        </div>{/* .nk-block-head-content */}
                        <div className="nk-block-head-content">
                          <div className="toggle-wrap nk-block-tools-toggle">
                            <a href="#" className="btn btn-icon btn-trigger toggle-expand mr-n1" data-target="pageMenu"><em className="icon ni ni-more-v" /></a>

                          </div>
                        </div>{/* .nk-block-head-content */}
                      </div>{/* .nk-block-between */}
                    </div>{/* .nk-block-head */}
                    <div className="nk-block">
                      <div className="row g-gs">
                        <div className="col-xxl-12">
                          <div className="row g-gs">
                            <div className="col-sm-3 col-lg-3 col-xxl-3 mx-auto d-none d-xl-block">
                              <div className="card">
                                <div className="nk-ecwg nk-ecwg3">
                                  <div className="card-inner pb-0">
                                    <div className="card-title-group">
                                      <div className="card-title">
                                        <h6 className="title">CPU Usage</h6>
                                      </div>
                                    </div>
                                    <div className="data">
                                      <div className="data-group">
                                        {cpu_usage ?
                                          <FadeIn>
                                            <div className="amount" id="cpu-numbers">{cpu_usage}</div>
                                          </FadeIn> : ""}

                                      </div>
                                    </div>
                                  </div>{/* .card-inner */}
                                  <div className="nk-ecwg3-ck">
                                    <canvas className="ecommerce-line-chart-s1" id="totalOrders" />
                                  </div>
                                </div>{/* .nk-ecwg */}
                              </div>{/* .card */}
                            </div>{/* .col */}
                            <div className="col-sm-3 col-lg-3 col-xxl-3 mx-auto d-none d-xl-block">
                              <div className="card">
                                <div className="nk-ecwg nk-ecwg3">
                                  <div className="card-inner pb-0">
                                    <div className="card-title-group">
                                      <div className="card-title">
                                        <h6 className="title">Memory Usage</h6>
                                      </div>
                                    </div>
                                    <div className="data">
                                      <div className="data-group">
                                        {memory_usage ?
                                          <FadeIn>
                                            <div className="amount" id="cpu-numbers">{memory_usage}</div>
                                          </FadeIn> : ""}

                                      </div>
                                    </div>
                                  </div>{/* .card-inner */}
                                  <div className="nk-ecwg3-ck">
                                    <canvas className="ecommerce-line-chart-s1" id="ramUsage" />
                                  </div>
                                </div>{/* .nk-ecwg */}
                              </div>{/* .card */}
                            </div>{/* .col */}
                            <div className="col-sm-3 col-lg-3 col-xxl-3 mx-auto d-none d-xl-block">
                              <div className="card">
                                <div className="nk-ecwg nk-ecwg3">
                                  <div className="card-inner pb-0">
                                    <div className="card-title-group">
                                      <div className="card-title">
                                        <h6 className="title">Disk Usage</h6>
                                      </div>
                                    </div>
                                    <div className="data">
                                      <div className="data-group">
                                        {memory_usage ?
                                          <FadeIn>
                                            <div className="amount" id="cpu-numbers">20 GiB / 50 GiB</div>
                                          </FadeIn> : ""}

                                      </div>
                                    </div>
                                  </div>{/* .card-inner */}
                                  <div className="nk-ecwg3-ck">
                                    <canvas className="ecommerce-line-chart-s1" id="ramUsage" />
                                  </div>
                                </div>{/* .nk-ecwg */}
                              </div>{/* .card */}
                            </div>{/* .col */}
                            <div className="col-sm-3 col-lg-3 col-xxl-3 mx-auto d-none d-xl-block">
                              <div className="card">
                                <div className="nk-ecwg nk-ecwg3">
                                  <div className="card-inner pb-0">
                                    <div className="card-title-group">
                                      <div className="card-title">
                                        <h6 className="title">Players Online</h6>
                                      </div>
                                    </div>
                                    <div className="data">
                                      <div className="data-group">
                                        {players ? 
                                         <FadeIn>
                                         <div className="amount" id="cpu-numbers">{players}</div>
                                       </FadeIn>
                                       : ""
                                      }
                                         

                                      </div>
                                    </div>
                                  </div>{/* .card-inner */}
                                  <div className="nk-ecwg3-ck">
                                    <canvas className="ecommerce-line-chart-s1" id="ramUsage" />
                                  </div>
                                </div>{/* .nk-ecwg */}
                              </div>{/* .card */}
                            </div>{/* .col */}
                            
                          </div>{/* .row */}
                        </div>{/* .col */}

                      </div>{/* .row */}
                      <div className="row mt-5">
                        <div className="col-md-2 col-sm-12 mb-4">
                          <div className="card">
                            <div className="card-header">
                              <p><em class="icon ni ni-server mr-1"></em>Server Information</p>
                              </div>

                              <div className="card-body">
                              <p><em style={{color: '#1ee0ac'}}class="icon ni ni-chevron-up-circle mr-1"></em>Online</p>
                              <p><em class="icon ni ni-network mr-1"></em>148.72.144.154:25567</p>              
                              </div>
                          </div>
                          <div className="card">

                              <div className="card-body">
                                <div className="row">
                              <btn className="btn btn-success btn-sm mx-auto mb-1 mt-1">Start</btn>
                              <btn className="btn btn-warning btn-sm mx-auto mb-1 mt-1">Restart</btn>
                              <btn className="btn btn-danger btn-sm mx-auto mb-1 mt-1">Stop</btn>
                              

                              </div>     
                              </div>
                          </div>
                        </div>
                      <div class="col-md-10">
                      {console_load == true ?
                      <>
                      <FadeIn>
                      <div style={{minHeight: '55vh'}} id="console"></div>
                      {server_type == "Minecraft" ?                       <form onSubmit={doWebsocket.bind(this)}>
                                                <input style={{ width: '100%' }} type="text" className="form-control" placeholder="Type a command..." value={input} onChange={handleInputChanged.bind(this)} />
                                            </form> : "" }
                                            </FadeIn> </>: ""}
                      </div>
                      </div>



                    </div>{/* .nk-block */}
                  </div>
                </div>
              </div>
            </div>
            {/* content @e */}
            {/* footer @s */}
            <Footer />
            {/* footer @e */}
          </div>
          {/* wrap @e */}
        </div>
        {/* main @e */}
      </div>
      {/* app-root @e */}
      {/* JavaScript */}
    </div>

  )
}
export default ServerContainer