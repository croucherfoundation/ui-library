export interface EditorConfigStore {
  config: EditorConfig;
  currentTab: TabbarNameTypes;
  isEditMode: boolean;
  lan: "en" | "hk";
  currentImageElementInfo: TImageElementInfo;
  updateEditorConfig: (payload: EditorConfig) => void;
  handleIsEditMode: (payload: boolean) => void;
  handleTabName: (payload: TabbarNameTypes) => void;
  updateLan: (payload: "en" | "hk") => void;
  updateCurrentImageElementInfo: (payload: TImageElementInfo) => void;
}

export interface EditorConfig {
  previewMode: boolean;
  previewLoading: boolean;
  previewBreakpoints: PreviewBreakpoints;
  imageFetch: boolean;
  imageFetchUrl: string;
}

export type PreviewBreakpoints = "sm" | "md" | "lg" | "auto";

export type TabbarNameTypes = "editor" | "setting";

export interface TImageElementInfo {
  sectionId: string;
  elementId: string;
  containerId: string;
}
