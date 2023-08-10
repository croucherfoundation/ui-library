import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";
import PreviewController from "../PreviewController/PreviewController";

type DeviceFrameProps = {
  width?: number;
  height?: number;
  children?: React.ReactNode;
  url?: string;
};

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, url = ""}) => {
  const iframeRef = createRef<HTMLIFrameElement>();
  const [mountNode, setMountNode] = useState<HTMLElement | undefined>();
  const [editorConfig] = useEditorConfigStore((state) => [state.config]);
  const [section] = useSectionStore((state) => [state.section]);

  const createMount = useCallback(() => {
    if (!iframeRef.current) {
      return;
    }

    setMountNode(iframeRef.current?.contentWindow?.document?.body);

    // Because We need Iframe to our current style
    const currentHead = document.querySelector("head");
    const sectionNode = document.getElementById("editor_section_node");

    const headingNode = iframeRef.current?.contentWindow?.document.head;
    // const bodyNode = iframeRef.current?.contentWindow?.document.body;

    if (headingNode && currentHead && sectionNode) {
      headingNode.innerHTML = currentHead?.innerHTML;
      // bodyNode.innerHTML = sectionNode.innerHTML;
    }
  }, [iframeRef]);

  useEffect(() => {
    if (editorConfig.previewMode && !mountNode) {
      createMount();
    }

    // return () => {
    //   setMountNode(undefined);
    // }
  }, [section, editorConfig.previewMode, createMount, mountNode]);

  const style = useMemo<React.CSSProperties>(() => {
    switch (editorConfig.previewBreakpoints) {
      case "sm":
        return {
          maxWidth: "392px",
        };
      case "md":
        return {
          maxWidth: "768px",
        };
      case "auto":
      case "lg":
        return {
          width: "100%",
        };
      default:
        return {
          width: "100%",
        };
    }
  }, [editorConfig.previewBreakpoints]);

  return (
    <>
      <iframe
        className="w-full min-h-screen mx-auto border border-dashed pb-20"
        id="device-frame-portal"
        ref={iframeRef}
        style={style}
        src={url}
      >
        {!url && mountNode && createPortal(children, mountNode)}
      </iframe>

      <PreviewController />
    </>
  );
};

export default DeviceFrame;
