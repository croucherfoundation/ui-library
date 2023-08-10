import { create } from "zustand";
import {
  TabbarNameTypes,
  type EditorConfig,
  type EditorConfigStore,
  TImageElementInfo,
} from "../types/editorConfig.t";

const useEditorConfigStore = create<EditorConfigStore>()((set) => ({
  config: {
    previewMode: false,
    previewLoading: false,
    previewBreakpoints: "lg",
    imageFetch: false,
    imageFetchUrl: "",
  },
  currentTab: "editor",
  isEditMode: true,
  lan: "en",
  currentImageElementInfo: {
    sectionId: "",
    elementId: "",
    containerId: "",
  },
  updateEditorConfig: (payload: EditorConfig) =>
    set({
      config: payload,
    }),
  handleIsEditMode: (payload: boolean) =>
    set({
      isEditMode: payload,
    }),
  handleTabName: (payload: TabbarNameTypes) =>
    set({
      currentTab: payload,
    }),
  updateLan: (payload: "en" | "hk") =>
    set({
      lan: payload,
    }),
  updateCurrentImageElementInfo: (payload: TImageElementInfo) =>
    set({
      currentImageElementInfo: payload,
    }),
}));

export default useEditorConfigStore;
