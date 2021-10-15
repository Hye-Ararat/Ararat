import { TextField } from "@material-ui/core";
import React from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router";
const database = getFirestore();
let term;
let socket;

function ConsoleContainer() {
  const { instance, server } = useParams();
  const [server_data, setServerData] = React.useState();
  const [node_info, setNodeInfo] = React.useState();
  React.useEffect(() => {
    const docRef = doc(database, "instances", instance, "servers", server);
    onSnapshot(docRef, (doc) => {
      var info = doc.data();
      info.id = doc.id;
      setServerData(info);
    });
  }, []);
  React.useEffect(() => {
    if (server_data) {
      const docRef = doc(
        database,
        "instances",
        instance,
        "nodes",
        server_data.node
      );
      onSnapshot(docRef, (doc) => {
        setNodeInfo(doc.data());
      });
    }
  }, [server_data]);
  React.useEffect(() => {
    if (node_info) {
      const theme = {
        background: "rgb(23, 23, 23)",
        cursor: "transparent",
        black: "#000",
        red: "rgb(153, 0, 0)",
        green: "rgb(0, 166, 0)",
        yellow: "rgb(153, 153, 0)",
        blue: "rgb(0, 0, 178)",
        magenta: "rgb(0, 178, 0)",
        cyan: "rgb(0, 166, 178)",
        white: "rgb(191, 191, 191)",
        brightBlack: "rgb(102, 102, 102)",
        brightRed: "rgb(230, 0, 0)",
        brightGreen: "rgb(0, 217, 0)",
        brightYellow: "rgb(230, 230, 0)",
        brightBlue: "rgb(0, 0, 255)",
        brightMagenta: "rgb(230, 0, 230)",
        brightCyan: "rgb(0, 230, 230)",
        brightWhite: "rgb(230, 230, 230)",
        selection: "rgb(139, 139, 139)",
      };
      term = new Terminal({
        convertEol: true,
        disableStdin: true,
        theme: theme,
      });
      socket = new WebSocket(
        `wss://${node_info.address.hostname}:${node_info.address.port}/api/v1/server/${server_data.id}/console`
      );
      const attachAddon = new AttachAddon(socket);
      term.loadAddon(attachAddon);
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(document.getElementById("xterm"));
      fitAddon.fit();
      var commandField = document.getElementById("command");
      commandField.addEventListener("keydown", function (event) {
        console.log(event.key);
        console.log(event.target.value);
        if (event.key == "Enter") {
          event.preventDefault();
          socket.send(event.target.value);
          commandField.value = "";
        }
      });
    }
  }, [node_info]);
  return (
    <React.Fragment>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css"
        integrity="sha512-iLYuqv+v/P4u9erpk+KM83Ioe/l7SEmr7wB6g+Kg1qmEit8EShDKnKtLHlv2QXUp7GGJhmqDI+1PhJYLTsfb8w=="
        crossOrigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <div id="xterm" style={{ height: "80vh", width: "83.5vw" }}></div>
      <TextField sx={{ width: "100%" }} id="command" />
    </React.Fragment>
  );
}
export default ConsoleContainer;
