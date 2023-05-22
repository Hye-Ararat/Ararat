"use client";
import Monaco, { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Button, Divider, Grid, Typography } from "../../../../components/base";
import lxd from "../../../../lib/lxd";

export default function Advanced({ config, accessToken }) {
  const monaco = useMonaco();
  const [editing, setEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState(JSON.stringify(config, null, 4));
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
  return (
    <>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Grid container>
    <Button sx={{ml: "auto"}} variant="contained" color={editing ? "error" : "info"} onClick={() => setEditing(!editing)}>{(editing ? "Disable" : "Enable")} Editing</Button>
    </Grid>
    <Divider sx={{ mt: 2, mb: 2 }} />
      <div style={{ cursor: "text", width: "100%", marginTop: 20 }}>
        <div style={{ padding: 4, backgroundColor: "#141c26", borderRadius: "12px" }}>

          <Monaco onChange={(d) => setEditedConfig(d)} defaultLanguage="json" language="json" theme="hye" height="40vh" value={editedConfig} options={{ cursorSmoothCaretAnimation: "on", cursorBlinking: "smooth", smoothScrolling: true, automaticLayout: true, readOnly: !editing }} />
        </div>
      </div>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Typography variant="caption">WARNING: Changes made to the configuration do not save when switching to another step in the instance creation process.</Typography>

      <Grid container>
        <Button onClick={async () => {
          await lxd(accessToken).createInstance(editedConfig);
        }} sx={{ ml: "auto" }} variant="contained" color="success">Create Instance With Configuration</Button>
      </Grid>
    </>
  )
}