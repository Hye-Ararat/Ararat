"use client";

import { Circle, ExpandMore } from "@mui/icons-material";
import { Prisma } from "@prisma/client";
import {Typography, Button, Grid, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Divider} from "../../../components/base";
import Table from "../../../components/table";
import { useEffect, useState } from "react";
import Monaco, { useMonaco } from "@monaco-editor/react";
import dynamic from "next/dynamic";
const OperationSocket = dynamic(() => import("./OperationSocket"), {ssr: false});



export default function OperationsTable({operations}) {
    let rows: JSX.Element[][] = [];
    let rowLinks: object[] = [];
    const [dates, setDates]= useState([]);
    const monaco = useMonaco();
    useEffect(() => {
        if (monaco) {
          monaco.editor.defineTheme("hye", {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
              {
                "background": "18212e",
                "token": ""
              },
              {
                "foreground": "6272a4",
                "token": "comment"
              },
              {
                "foreground": "f1fa8c",
                "token": "string"
              },
              {
                "foreground": "bd93f9",
                "token": "constant.numeric"
              },
              {
                "foreground": "bd93f9",
                "token": "constant.language"
              },
              {
                "foreground": "bd93f9",
                "token": "constant.character"
              },
              {
                "foreground": "bd93f9",
                "token": "constant.other"
              },
              {
                "foreground": "ffb86c",
                "token": "variable.other.readwrite.instance"
              },
              {
                "foreground": "ff79c6",
                "token": "constant.character.escaped"
              },
              {
                "foreground": "ff79c6",
                "token": "constant.character.escape"
              },
              {
                "foreground": "ff79c6",
                "token": "string source"
              },
              {
                "foreground": "ff79c6",
                "token": "string source.ruby"
              },
              {
                "foreground": "ff79c6",
                "token": "keyword"
              },
              {
                "foreground": "ff79c6",
                "token": "storage"
              },
              {
                "foreground": "8be9fd",
                "fontStyle": "italic",
                "token": "storage.type"
              },
              {
                "foreground": "50fa7b",
                "fontStyle": "underline",
                "token": "entity.name.class"
              },
              {
                "foreground": "50fa7b",
                "fontStyle": "italic underline",
                "token": "entity.other.inherited-class"
              },
              {
                "foreground": "50fa7b",
                "token": "entity.name.function"
              },
              {
                "foreground": "ffb86c",
                "fontStyle": "italic",
                "token": "variable.parameter"
              },
              {
                "foreground": "ff79c6",
                "token": "entity.name.tag"
              },
              {
                "foreground": "50fa7b",
                "token": "entity.other.attribute-name"
              },
              {
                "foreground": "8be9fd",
                "token": "support.function"
              },
              {
                "foreground": "6be5fd",
                "token": "support.constant"
              },
              {
                "foreground": "66d9ef",
                "fontStyle": " italic",
                "token": "support.type"
              },
              {
                "foreground": "66d9ef",
                "fontStyle": " italic",
                "token": "support.class"
              },
              {
                "foreground": "f8f8f0",
                "background": "ff79c6",
                "token": "invalid"
              },
              {
                "foreground": "f8f8f0",
                "background": "bd93f9",
                "token": "invalid.deprecated"
              },
              {
                "foreground": "cfcfc2",
                "token": "meta.structure.dictionary.json string.quoted.double.json"
              },
              {
                "foreground": "6272a4",
                "token": "meta.diff"
              },
              {
                "foreground": "6272a4",
                "token": "meta.diff.header"
              },
              {
                "foreground": "ff79c6",
                "token": "markup.deleted"
              },
              {
                "foreground": "50fa7b",
                "token": "markup.inserted"
              },
              {
                "foreground": "e6db74",
                "token": "markup.changed"
              },
              {
                "foreground": "bd93f9",
                "token": "constant.numeric.line-number.find-in-files - match"
              },
              {
                "foreground": "e6db74",
                "token": "entity.name.filename"
              },
              {
                "foreground": "f83333",
                "token": "message.error"
              },
              {
                "foreground": "eeeeee",
                "token": "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json"
              },
              {
                "foreground": "eeeeee",
                "token": "punctuation.definition.string.end.json - meta.structure.dictionary.value.json"
              },
              {
                "foreground": "8be9fd",
                "token": "meta.structure.dictionary.json string.quoted.double.json"
              },
              {
                "foreground": "f1fa8c",
                "token": "meta.structure.dictionary.value.json string.quoted.double.json"
              },
              {
                "foreground": "50fa7b",
                "token": "meta meta meta meta meta meta meta.structure.dictionary.value string"
              },
              {
                "foreground": "ffb86c",
                "token": "meta meta meta meta meta meta.structure.dictionary.value string"
              },
              {
                "foreground": "ff79c6",
                "token": "meta meta meta meta meta.structure.dictionary.value string"
              },
              {
                "foreground": "bd93f9",
                "token": "meta meta meta meta.structure.dictionary.value string"
              },
              {
                "foreground": "50fa7b",
                "token": "meta meta meta.structure.dictionary.value string"
              },
              {
                "foreground": "ffb86c",
                "token": "meta meta.structure.dictionary.value string"
              }
            ],
            "colors": {
              "editor.foreground": "#f8f8f2",
              "editor.background": "#141c26",
              "editor.selectionBackground": "#233142",
              "editor.lineHighlightBackground": "#0e131a",
              "editorCursor.foreground": "#f8f8f0",
              "editorWhitespace.foreground": "#3B3A32",
              "editorIndentGuide.activeBackground": "#9D550FB0",
              "editor.selectionHighlightBorder": "#222218"
            },
          })
          monaco.editor.setTheme("hye")
        }
      }, [monaco])

    useEffect(() => {
      if (operations) {
        operations.forEach((operation, index) => {
            setDates([...dates, new Date(operation.created_at).toLocaleDateString() + " " + new Date(operation.created_at).toLocaleTimeString()])
        })
      }
    }, [])
    operations ?
    operations.forEach((operation, index) => {
        console.log(operation)
        rowLinks.push({link: `operations/${operation.id}`})
        rows.push([
            <Typography key={index} sx={{m: "auto"}} fontWeight="bold">{operation.description}</Typography>,
            <Typography key={index} sx={{m: "auto"}}>{operation.id}</Typography>,
            <>
             <Grid sx={{maxWidth: "15px", ml: "auto", mt: "auto", mb: "auto" }} container>
                        <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac" }} />
                        <Circle sx={{ fontSize: "15px", mt: "auto", mb: "auto", color: "#1ee0ac", animation: "status-pulse 3s linear infinite", position: "absolute", transformBox: "view-box", transformOrigin: "center center" }} />
                    </Grid>
                    <Typography sx={{mt: "auto", mb: "auto", ml: 1, mr: "auto"}}>Running</Typography>
            </>
        ])
    })
    : ""
return (
    <Grid container direction="column" sx={{mt: 2}}>
    {operations ? operations.map((operation, index) => {
        return (
<Accordion>
    <AccordionSummary expandIcon={<ExpandMore />}>
        <Grid container direction="row">
        <Grid container direction="column" xs={6}>
        <Typography variant="h6" fontWeight={600}>{operation.description}</Typography>
        <Typography variant="caption">{operation.id}</Typography>
        </Grid>
        <Grid container xs={6} sx={{ml: "auto"}}>
        <Typography sx={{ml: "auto", mr: 2, my: "auto"}}>{dates[index] ? dates[index] : "Loading..."}</Typography>
        </Grid>
        </Grid>
    </AccordionSummary>
    <Divider sx={{mb: 2, mt: 2}} />
    <AccordionDetails>
    <Monaco defaultLanguage="json" language="json" theme="hye" height="40vh" value={JSON.stringify(operation, null, 4)} options={{ cursorSmoothCaretAnimation: "on", cursorBlinking: "smooth", smoothScrolling: true, automaticLayout: true, readOnly: true }} />
    {operation.class == "websocket" ? <OperationSocket operation={operation} /> : ""}
    </AccordionDetails>
    <Divider sx={{mb: 2, mt: 2}} />
    <AccordionActions>
        <Button disabled={!operation.may_cancel} variant="contained" color="error">Cancel Operation</Button>
    </AccordionActions>
</Accordion>
        )
    }) : ""}

    </Grid>
)
}
