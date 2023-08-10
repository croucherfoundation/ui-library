import { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useContainer from "./useContainer";

import useEditorConfigStore from "../../store/editorConfig.store";
import "./../../styles/index.css";
import FloatingMenu from "./components/FloatingMenu/FloatingMenu";
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
function IsEditable() {
  const [editor] = useLexicalComposerContext();
  const [isEditMode] = useEditorConfigStore((state) => [state.isEditMode]);

  useEffect(() => {
    editor.setEditable(isEditMode);
  }, [editor, isEditMode]);

  return null;
}

const Editor = ({
  containerId,
  sectionId,
  elementId,
  bodyKey = "body1",
}: Props) => {
  const { initialConfig, handleOnChange, previewMode, isEditMode } =
    useContainer({
      containerId,
      sectionId,
      elementId,
      bodyKey,
    });

  return (
    <>
      <div className="relative">
        <LexicalComposer initialConfig={initialConfig}>
          <If isTrue={isEditMode}>
            <If isTrue={!previewMode}>
              <FloatingMenu />
            </If>
          </If>
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[100px]" spellCheck={false} />
            }
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={
              <div className="opacity-50 top-[0px] absolute left-[0px] select-none pointer-events-none">
                Start writing
              </div>
            }
          />
          <OnChangePlugin onChange={handleOnChange} />
          <HistoryPlugin />
          <MyCustomAutoFocusPlugin />
          <ListPlugin />
          <IsEditable />
        </LexicalComposer>
      </div>
    </>
  );
};

export default Editor;
