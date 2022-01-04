import dynamic from "next/dynamic";
import { useEffect } from 'react';
import * as Y from "yjs"
import { WebrtcProvider } from 'y-webrtc'
import { MonacoBinding } from 'y-monaco'
import loader from "@monaco-editor/loader";

export default function FileEditor({file}) {    
    useEffect(() => {
        const ydoc = new Y.Doc();
        const provider = new WebrtcProvider('monaco', ydoc)
        const type = ydoc.getText('monaco')
        loader.init().then(monaco => {
        var editor = monaco.editor.create(document.getElementById('monaco-editor'), {
            value: '',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
        })
        const monacoBinding = new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness)
        editor.setValue(type.toString());
        provider.connect();
        if (type.length == 0){
            type.insert(0, file)
        }
        });
    }, [])
    return (
        <>
        <div id="monaco-editor" style={{width: "100%", height: "900px"}}></div>
        </>
    )
}