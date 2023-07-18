import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Aside from "./components/Aside/Aside";
import useEditorConfigStore from "./store/editorConfig.store";
import Section from "./components/Section/Section";
import DeviceFrame from "./components/DeviceFrame/DeviceFrame";
import { useEffect, useState } from "react";

interface Props {
  publishOrSave?: React.ReactNode;
}

const Editor = ({ publishOrSave }: Props) => {
  const [editorConfig] = useEditorConfigStore((state) => [state.config]);
  const [hideSection, setHideSection] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHideSection(editorConfig.previewMode);
    }, 5);
  }, [editorConfig.previewMode]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <section className="flex">
          <Aside publishOrSave={publishOrSave} />

          <div className={`w-full overflow-y-auto ${hideSection ? 'hidden' : ''}`} id="editor_section_node">
            <Section />
          </div>

          {editorConfig.previewMode && (
            <DeviceFrame>
              <Section />
            </DeviceFrame>
          )}
        </section>

        <div id="image-cropper-portal"></div>
      </DndProvider>
    </>
  );
};

export default Editor;
