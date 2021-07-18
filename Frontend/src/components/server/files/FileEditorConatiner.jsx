import Editor from "@monaco-editor/react";
import { useEffect } from "react";
import getFileContents from "../../../api/server/files/getFileContents";
import {
    useState
} from 'react'
import {
    useParams
} from 'react-router-dom'
import getServer from "../../../api/server/getServer";
import getFileDownloadLink from "../../../api/server/files/getFileDownloadLink";
import ReactLoading from 'react-loading'
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import FadeIn from "../../Fade";
import updateFile from "../../../api/server/files/updateFile";

function FileEditorContainer() {
    const { uuid } = useParams();
    var [isLoading, setLoading] = useState(() => {
        return (true)
    })
    var [file_lang, setFileLang] = useState(() => {
        return (null)
    })
    var [server_name, setServerName] = useState(() => {
        return (null)
    })
    var [file_data, setFileData] = useState(() => {
        return (null)
    })
    var [file_value, setFileValue] = useState(() => {
        return (null)
    })
    var [saved_status, setSavedStatus] = useState(() => {
        return('Saved')
    })
    var [save_count, setSavedCount] = useState(() => {
        return(0)
    })
    var [auto_save, setAutoSave] = useState(() => {
        return(true)
    })

    function handleEditorChange(value, event) {
        setSavedStatus('Not Saved')
        setFileData(value)
        if (auto_save == true){
        setSavedCount(save_count + 1)
        if (save_count >= 10){
            setLoading(true)
            setSavedStatus('Saving...')
            console.log('new value: ', value)
            setFileValue(value)
            updateFile(uuid, window.location.hash, value, function(results){
                if (results == "success"){
                    console.log(`yes ${file_value}`)
                    setSavedStatus('Saved')
                    setLoading(false)
                } else {
                    setSavedStatus('An Error Occured While Trying To Save This File')
                    setLoading(false)
                }
                setSavedCount(0)
            })
        
        }
    }

    }
    function saveFile(){
        var value = file_data
        setLoading(true)
        setSavedStatus('Saving...')
        console.log('new value: ', value)
        setFileValue(value)
        updateFile(uuid, window.location.hash, value, function(results){
            if (results == "success"){
                console.log(`yes ${file_value}`)
                setSavedStatus('Saved')
                setLoading(false)
            } else {
                setSavedStatus('An Error Occured While Trying To Save This File')
                setLoading(false)
            }
        })
    }
    function toggleAutoSave() {
        var auto_element = document.getElementById('autosave')
        if(auto_save == true){
            setAutoSave(false)
        }
        if (auto_save == false){
            setAutoSave(true)
        }
    }

    useEffect(() => {
        var languages = {
            'yml': { language: 'yaml' },
            'js': { language: 'javascript' },
            'txt': { language: 'text' },
            'json': { language: 'json' },
            'log': { language: 'log' },
            'properties': { language: 'properties' },
            'html': {language: 'html'}
        }
        var langa = languages[(window.location.href).split('.')[3]]
        setLoading(true)
        if (!langa) {
            setLoading(true)
            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            }
            setFileLang('unsupported')
            getFileDownloadLink(uuid, window.location.hash, async function (response) {
                setLoading(true)
                document.getElementById('download').src = response;
                setLoading(true)
                await sleep(5000)
                setLoading(true)
                var need = window.location.href.replace('/edit', '').split('/')
                setLoading(true)
                need.pop()
                window.location.href = need.join('/') + '/'
                setLoading(false)
            })
        } else {
            setFileLang(langa.language)
            setLoading(true)
        }
    }, [])
    useEffect(() => {
        getServer(uuid, function (server_data) {
            setLoading(true)
            setServerName(server_data.attributes.name)
            document.title = server_data.attributes.name + " | Files"
            setLoading(true)
        })
    }, [])
    useEffect(() => {
        getFileContents(uuid, window.location.hash, function (file_data) {
            setLoading(true)
            setFileData(file_data)
            setLoading(false)
        })
    }, [])


    return (
        <>
            <Loading
                show={isLoading}
                color="red"
                showSpinner={false}
            />
            <iframe id="download" style={{ display: 'none' }}></iframe>
            {file_lang == "unsupported" ? <div className="d-flex justify-content-evenly">
                <p className="mt-4">Your Download Will Begin In a Moment...</p>
            </div> : <div class="container"> <div className="form-check form-switch">
  <input onClick={() => toggleAutoSave()}className="form-check-input" type="checkbox" id="autosave" checked={auto_save}/>
  <label className="form-check-label" htmlFor="flexSwitchCheckDefault">AutoSave</label>
  <p>{saved_status}</p>
</div>{file_data ? <><FadeIn><Editor
                height="90vh"
                theme="vs-dark"
                defaultLanguage={file_lang}
                defaultValue={file_data.toString()}
                onChange={handleEditorChange}
            />
                        <button className="btn btn-primary" onClick={() => saveFile()}>Save</button>

            </FadeIn>
            </> : ""}
</div>}

        </>
    )
}
export default FileEditorContainer