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

import "./../../styles/index.css";
import If from "../If";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
  bodyKey?: "body1" | "body2" | "body3";
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

const Editor = ({
  containerId,
  sectionId,
  elementId,
  bodyKey = "body1",
}: Props) => {
  const { initialConfig, handleOnChange, previewMode } = useContainer({
    containerId,
    sectionId,
    elementId,
    bodyKey,
  });

  return (
    <>
      <div className="relative">
        <LexicalComposer initialConfig={initialConfig}>
          <If isTrue={!previewMode}>
            <HeaderPlugin />
          </If>
          <RichTextPlugin
            contentEditable={
              <div className="min-h-[32px]">
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
