import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_HISTORY_COMMAND } from "lexical";
import PropTypes from 'prop-types';
import { useEffect } from "react";

SetEditorState.propTypes = {
  config: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

export default function SetEditorState(props) {
  const [editor] = useLexicalComposerContext();
  const { config } = props
  const onMount = () => {
    if (config) {
      const data = config
      const json = JSON.parse(data)
      const editorState = editor.parseEditorState(
          JSON.stringify(json),
        );
      editor.setEditorState(editorState);
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    }
  }
  onMount()
  return (
    ''
  )
}