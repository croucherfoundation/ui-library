import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Aside from "./components/Aside/Aside";
import DeviceFrame from "./components/DeviceFrame/DeviceFrame";
import Section from "./components/Section/Section";
import useEditorConfigStore from "./store/editorConfig.store";
interface Props {
  publishOrSave?: React.ReactNode;
  isEditMode?: boolean;
  url?: string;
}

const Editor = ({ publishOrSave, isEditMode = true, url }: Props) => {
  const [editorConfig, handleIsEditMode, handleTabName] = useEditorConfigStore(
    (state) => [state.config, state.handleIsEditMode, state.handleTabName]
  );
  const [hideSection, setHideSection] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHideSection(editorConfig.previewMode);
    }, 5);
  }, [editorConfig.previewMode]);

  useEffect(() => {
    handleIsEditMode(isEditMode);
  }, [isEditMode, handleIsEditMode]);

  useEffect(() => {
    return () => {
      handleTabName("editor");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <section className="flex">
          <Aside publishOrSave={publishOrSave} />

          <div
            className={`w-full overflow-y-auto ${hideSection ? "hidden" : ""}`}
            id="editor_section_node"
          >
            <Section />
          </div>

          {editorConfig.previewMode && <DeviceFrame url={url} />}
        </section>

        <div id="image-cropper-portal"></div>
      </DndProvider>
    </>
  );
};

export default Editor;
