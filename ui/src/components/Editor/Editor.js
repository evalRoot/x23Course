import ExampleTheme from "./themes/ExampleTheme";
import LexicalComposer from "@lexical/react/LexicalComposer";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import AutoFocusPlugin from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import LinkPlugin from "@lexical/react/LexicalLinkPlugin";
import ListPlugin from "@lexical/react/LexicalListPlugin";
import LexicalMarkdownShortcutPlugin from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import './style.css'
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import { ImageNode } from "./node/ImageNode";
import { ImagesPlugin } from "./plugins/ImagesPlugin";

import SaveEditor from "./plugins/SaveEditor";
import SetEditorState from "./plugins/setEditorState";
import PropTypes from 'prop-types';
import { useEffect } from "react";


function Placeholder() {
  return <div className="editor-placeholder">Ввести текст...</div>;
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode
  ]
};


Editor.propTypes = {
  readOnly: PropTypes.bool,
  config: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

export default function Editor(props) {
  const {
    readOnly = false,
    config,
  } = props

  useEffect(() => {
    if (readOnly) {
      editorConfig.readOnly = true
    } else {
      editorConfig.readOnly = false
    }

  }, [])

  const onChange = (editorState) => {
    props.onChange(editorState)
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        {!readOnly &&
          <ToolbarPlugin read/>
        }
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ImagesPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <CodeHighlightPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <SetEditorState/>
          <LexicalMarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <LexicalOnChangePlugin onChange={onChange}/>
          {!readOnly &&
            <SaveEditor/>
          }
          {readOnly &&
            <SetEditorState config={config} />
          }
        </div>
      </div>
    </LexicalComposer>
  );
}
