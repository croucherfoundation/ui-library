import {
  FaMobileButton,
  FaTabletScreenButton,
  FaLaptop,
  FaEyeSlash,
} from "react-icons/fa6";

import useEditorConfigStore from "../../store/editorConfig.store";
import { PreviewBreakpoints } from "../../types/editorConfig.t";
import { useCallback } from "react";

const PreviewController = () => {
  const defaultBreakPointStyle =
    "flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-700 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 bg-gray-800 focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-500 border hover:border-indigo-500";

  const [editorConfig, updateEditorConfig] = useEditorConfigStore((state) => [
    state.config,
    state.updateEditorConfig,
  ]);

  const setBreakpoint = useCallback(
    (str: PreviewBreakpoints) => {
      updateEditorConfig({
        ...editorConfig,
        previewBreakpoints: str,
      });
    },
    [editorConfig, updateEditorConfig]
  );

  const offPreviewMode = useCallback(() => {
    updateEditorConfig({
      ...editorConfig,
      previewMode: false,
    });
  }, [editorConfig, updateEditorConfig]);

  if (!editorConfig.previewMode) {
    return null;
  }

  return (
    <div className="w-full fixed py-3 bottom-0 bg-white bg-opacity-80 items-center justify-center col-span-1 space-x-2 flex mt-2">
      <button
        onClick={() => setBreakpoint("sm")}
        className={`${defaultBreakPointStyle} ${
          editorConfig.previewBreakpoints === "sm"
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        <FaMobileButton />
      </button>

      <button
        onClick={() => setBreakpoint("md")}
        className={`${defaultBreakPointStyle} ${
          editorConfig.previewBreakpoints === "md"
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        <FaTabletScreenButton />
      </button>

      <button
        onClick={() => setBreakpoint("lg")}
        className={`${defaultBreakPointStyle} ${
          editorConfig.previewBreakpoints === "lg"
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        <FaLaptop />
      </button>

      {/* <button
        onClick={() => setBreakpoint("auto")}
        className={`${defaultBreakPointStyle} ${
          editorConfig.previewBreakpoints === "auto"
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        <FaCircleNotch />
      </button> */}

      <button
        onClick={offPreviewMode}
        className={`${defaultBreakPointStyle} bg-white`}
      >
        <FaEyeSlash />
      </button>
    </div>
  );
};

export default PreviewController;
