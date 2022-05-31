import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, createCommand } from "lexical";
import { useEffect } from "react";
import { $createImageNode } from "../node/ImageNode";

export const INSERT_IMAGE_COMMAND = createCommand()

export function ImagesPlugin(editorState) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeListener = editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();
          if (selection !== null) {
            const url = payload;
            document.querySelectorAll('.toolbar-item')[13].click()
            console.log(document.querySelectorAll('.editor-input'))
            selection.insertNodes([$createImageNode(url)]);
          }
        });
        return true;
      },
      0,
    );

    return () => {
      removeListener();
    };
  }, [editor]);

  return null;
}
