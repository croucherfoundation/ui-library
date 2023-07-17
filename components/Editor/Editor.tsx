import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Aside from "./components/Aside/Aside";
import useEditorConfigStore from "./store/editorConfig.store";
import Section from "./components/Section/Section";
import DeviceFrame from "./components/DeviceFrame/DeviceFrame";
import PreviewController from "./components/PreviewController/PreviewController";

interface Props {
  publishOrSave?: React.ReactNode;
}

const Editor = ({ publishOrSave }: Props) => {
  const [editorConfig] = useEditorConfigStore((state) => [state.config]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <section className="flex">
          <Aside publishOrSave={publishOrSave} />

          {!editorConfig.previewMode ? (
            <Section />
          ) : (
            <DeviceFrame>
              <Section />
            </DeviceFrame>
          )}
        </section>
        <PreviewController />
        <div id="image-cropper-portal"></div>
      </DndProvider>
    </>
  );
};

export default Editor;
