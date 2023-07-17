import { createRef, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import useEditorConfigStore from "../../store/editorConfig.store";

type DeviceFrameProps = {
  width?: number;
  height?: number;
  children?: React.ReactNode;
};

const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const iframeRef = createRef<HTMLIFrameElement>();
  const [mountNode, setMountNode] = useState<HTMLElement | undefined>();
  const [editorConfig] = useEditorConfigStore((state) => [state.config]);

  useEffect(() => {
    if (iframeRef.current) {
      setMountNode(iframeRef.current?.contentWindow?.document?.body);

      // Because We need Iframe to our current style
      const currentHead = document.querySelector("head");
      const headingNode = iframeRef.current?.contentWindow?.document.head;
      if (headingNode && currentHead) {
        headingNode.innerHTML = currentHead?.innerHTML;
      }
    }
  }, [iframeRef]);

  const style = useMemo<React.CSSProperties>(() => {
    switch (editorConfig.previewBreakpoints) {
      case "sm":
        return {
          maxWidth: "352px",
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
    <iframe
      className="w-full min-h-screen mx-auto"
      id="device-frame-portal"
      ref={iframeRef}
      style={style}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};

export default DeviceFrame;
