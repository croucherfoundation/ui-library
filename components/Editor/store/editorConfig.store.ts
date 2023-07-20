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
  isEditMode: true,
  updateEditorConfig: (payload: EditorConfig) =>
    set({
      config: payload,
    }),
  handleIsEditMode: (payload: boolean) =>
    set({
      isEditMode: payload,
    }),
}));

export default useEditorConfigStore;
