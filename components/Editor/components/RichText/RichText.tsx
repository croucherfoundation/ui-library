import { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import HeaderPlugin from "./components/HeaderPlugin/HeaderPlugin";
import useContainer from "./useContainer";

import "./richText.css";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

const Editor = ({ containerId, sectionId, elementId }: Props) => {
  const { initialConfig, handleOnChange } = useContainer({
    containerId,
    sectionId,
    elementId,
  });

  return (
    <>
      <div className="relative">
        <LexicalComposer initialConfig={initialConfig}>
          <HeaderPlugin />
          <RichTextPlugin
            contentEditable={
              <div className="h-32">
                <ContentEditable />
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={
              <div className="opacity-50 top-[50px] absolute left-[12px]">
                Start writing
              </div>
            }
          />
          <OnChangePlugin onChange={handleOnChange} />
          <HistoryPlugin />
          <MyCustomAutoFocusPlugin />
        </LexicalComposer>
      </div>
    </>
  );
};

export default Editor;
