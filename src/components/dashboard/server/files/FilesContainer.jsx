import {
  Typography,
  Fade,
  Button,
  Breadcrumbs,
  Grid,
  CardActionArea,
  Input,
} from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import loader from "@monaco-editor/loader";
import { getFirestore, onSnapshot, doc } from "@firebase/firestore";
import { getAuth, getIdToken } from "@firebase/auth";
import Firebase from "../../../db";

const database = getFirestore();

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function FilesContainer() {
  const auth = getAuth(Firebase);
  const query = useQuery();
  const { instance, server } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [files, setFiles] = React.useState();
  const [type, setType] = React.useState();

  // eslint-disable-next-line no-unused-vars
  const [file_data, setFileData] = React.useState("");
  const [path_arr, setPathArr] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [magma_cube_data, setMagmaCubeData] = React.useState();
  const [server_data, setServerData] = React.useState();
  const [progress, setProgress] = React.useState(0);
  // eslint-disable-next-line no-unused-vars
  const [layout, setLayout] = React.useState("icons");
  React.useEffect(() => {
    getIdToken(auth.currentUser, true)
      .then(function (idToken) {
        console.log(idToken);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  React.useEffect(() => {
    console.log("RUN");
    const docRef = doc(database, `/instances/${instance}/servers/${server}`);
    onSnapshot(docRef, (doc) => {
      setProgress(33);
      if (doc.exists()) {
        setServerData(doc.data());
      }
    });
  }, []);
  React.useEffect(() => {
    console.log("This was run!");
    if (server_data) {
      const docRef = doc(
        database,
        `/instances/${instance}/magma_cubes/${server_data.magma_cube}`
      );
      onSnapshot(docRef, (doc) => {
        setProgress(66);
        if (doc.exists()) {
          setMagmaCubeData(doc.data());
          let system_path = [];
          let mount_path = doc.data().mount.split("/");
          let path_url = query.get("path").split("/");
          system_path = mount_path.concat(path_url);
          var e = system_path.filter((item) => item != "");
          setPathArr(e);
        }
      });
    }
  }, [server_data, query.get("path")]);
  React.useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(
      `${query.get("path")}${instance}`,
      ydoc
    );
    const monacoType = ydoc.getText("monaco");
    axios
      .get(
        `https://nl-brd-1.hye.gg:2221/api/v1/server/4DvivxbhPdlglLG1WVzn/files?path=${query.get(
          "path"
        )}`,
        {
          transformResponse: (res, headers) => {
            // Do your own parsing here if needed ie JSON.parse(res);
            if (headers["content-type"] == "text/html; charset=utf-8") {
              return res;
            } else {
              return JSON.parse(res);
            }
          },
        }
      )
      .then(function (response) {
        setProgress(100);
        console.log(response.data);
        console.log(response.headers);
        if (response.headers["content-type"] == "text/html; charset=utf-8") {
          console.log(response.headers);
          console.log(response.data);
          setFiles(null);
          setFileData(response.data);
          setType("file");
          provider.awareness.setLocalStateField("user", {
            name: `${Math.floor(Math.random() * 10)}`,
            color: "#fff",
          });
          loader.init().then((monaco) => {
            window.editor = monaco.editor.create(
              document.getElementById("monaco-editor"),
              {
                value: "",
                language: query.get("path").includes(".js")
                  ? "javascript"
                  : query.get("path").includes(".yml")
                  ? "yaml"
                  : query.get("path").includes(".properties")
                  ? "properties"
                  : query.get("path").includes(".json")
                  ? "json"
                  : "text",
                theme: "vs-dark",
                automaticLayout: true,
              }
            );
            window.onresize = window.editor.layout();
            // eslint-disable-next-line no-unused-vars
            const monacoBinding = new MonacoBinding(
              monacoType,
              /** @type {monaco.editor.ITextModel} */ (
                window.editor.getModel()
              ),
              new Set([window.editor]),
              provider.awareness
            );

            console.log(monacoType.length);

            window.editor.setValue(monacoType.toString());
            provider.connect();
            if (monacoType.length == 0) {
              console.log("YES");
              monacoType.insert(0, response.data);
            }
            setProgress(100);
          });
        } else {
          setFileData(null);
          response.data.sort((a, b) => {
            if (a.type == "folder" && b.type == "file") {
              return -1;
            }
            if (a.type == "file" && b.type == "folder") {
              return 1;
            }
            if (a.type == "file" && b.type == "file") {
              try {
                if (a.file.split(".").pop() == b.file.split(".").pop()) {
                  return 0;
                }
                if (a.file.split(".").pop() > b.file.split(".").pop()) {
                  return -1;
                }
                if (a.file.split(".").pop() < b.file.split(".").pop()) {
                  return 1;
                }
              } catch (error) {
                console.log("error", error);
                return 0;
              }
            }

            return 0;
          });
          setFiles(response.data);
          setType("folder");
          setProgress(100);
        }
      });
  }, [query.get("path")]);
  function saveFile() {
    axios
      .post(
        `https://nl-brd-1.hye.gg:2221/api/v1/server/4DvivxbhPdlglLG1WVzn/files/write?path=${query.get(
          "path"
        )}`,
        window.editor.getValue(),
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      )
      .then(() => {
        console.log("Success");
      });
  }
  function uploadFile(event) {
    const formData = new FormData();
    formData.append("uploaded_file", event.target.files[0]);
    console.log(event.target.files[0]);
    axios
      .post(
        `https://nl-brd-1.hye.gg:2221/api/v1/server/4DvivxbhPdlglLG1WVzn/files/upload?path=/`,
        formData,
        {
          headers: {
            envtype: "multipart/form-data",
            "Content-Type":
              "multipart/form-data; boundary=---01100001011100000110100",
          },
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <React.Fragment>
      <LoadingBar
        color="#2196f3"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Typography variant="h4">Files</Typography>
      <label htmlFor="upload-file-button">
        <Input
          sx={{ display: "none" }}
          multiple
          id="upload-file-button"
          type="file"
          onChange={(event) => uploadFile(event)}
        />
        <Button color="primary" variant="contained" component="span">
          Upload
        </Button>
      </label>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        {path_arr
          ? path_arr.map((item, i) => {
              console.log(i);
              console.log(path_arr.length);
              console.log(item);
              if (i + 1 === path_arr.length) {
                i++;
                return <Typography color="text.primary">{item}</Typography>;
              } else {
                i++;
                return <Typography>{item}</Typography>;
              }
            })
          : ""}
      </Breadcrumbs>
      <Grid direction="row" container sx={{ width: "100%" }}>
        {files
          ? files.map((file) => {
              console.log(file.file);
              console.log(file.file.length);
              return layout == "icons" ? (
                <Fade in={true}>
                  {/*                 <Button onClick={() => history.push(`${location.pathname}?path=${query.get("path")}${file.file}${file.type == "folder" ? "/" : ""}`)}>{file.file}</Button>

 */}
                  <Grid
                    item
                    sx={{ width: 120, height: 70, ml: 5, mr: 5, mb: 5 }}
                    alignItems="center"
                  >
                    <CardActionArea
                      onClick={() =>
                        history.push(
                          `${location.pathname}?path=${query.get("path")}${
                            file.file
                          }${file.type == "folder" ? "/" : ""}`
                        )
                      }
                    >
                      <Grid
                        justifyContent="center"
                        item
                        container
                        alignItems="center"
                        sx={{
                          width: 70,
                          height: 70,
                          background: "#28374b",
                          borderRadius: 3,
                          margin: "auto",
                        }}
                      >
                        <img
                          style={{ width: 50, height: 50 }}
                          src={
                            file.file.split(".").pop() == "js"
                              ? "/icons/files/js.svg"
                              : file.file.split(".").pop() == "yml"
                              ? "/icons/files/yaml.svg"
                              : file.file.split(".").pop() == "json"
                              ? "/icons/files/json.svg"
                              : file.file.split(".").pop() == "jar"
                              ? "/icons/files/java.svg"
                              : file.file.split(".").pop() == "png"
                              ? "/icons/files/image.svg"
                              : file.type == "folder"
                              ? "/icons/files/folder_light.svg"
                              : "/icons/files/unknown.svg"
                          }
                        />
                      </Grid>
                      <Typography variant="body2" noWrap align="center">
                        {file.file.length < 19
                          ? file.file
                          : file.file.substring(0, 10) +
                            "..." +
                            file.file.split(".").pop().split(0, 4)}
                      </Typography>
                    </CardActionArea>
                  </Grid>
                </Fade>
              ) : (
                ""
              );
            })
          : ""}
      </Grid>
      {type == "file" ? (
        <React.Fragment>
          <div id="monaco-editor" style={{ height: "70vh" }} />
          <Button onClick={() => saveFile()} variant="contained">
            Save
          </Button>
        </React.Fragment>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default FilesContainer;
