import { create } from "zustand";
import {
  type EditorConfigStore,
  type EditorConfig,
} from "../types/editorConfig.t";

const useEditorConfigStore = create<EditorConfigStore>()((set) => ({
  config: {
    previewMode: false,
    previewLoading: false,
    previewBreakpoints: "auto",
    imageFetch: false,
    imageFetchUrl: "",
  },
  updateEditorConfig: (payload: EditorConfig) =>
    set({
      config: payload,
    }),
}));

export default useEditorConfigStore;
