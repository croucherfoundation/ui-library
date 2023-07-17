import { create } from "zustand";
import { EditorConfigStore, EditorConfig } from "../types/editorConfig.t";

const useEditorConfigStore = create<EditorConfigStore>()((set) => ({
  config: {
    previewMode: false,
    previewBreakpoints: "auto",
  },
  updateEditorConfig: (payload: EditorConfig) =>
    set({
      config: payload,
    }),
}));

export default useEditorConfigStore;
