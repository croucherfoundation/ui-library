export interface EditorConfigStore {
  config: EditorConfig;
  isEditMode: boolean;
  updateEditorConfig: (payload: EditorConfig) => void;
  handleIsEditMode: (payload: boolean) => void;
}

export interface EditorConfig {
  previewMode: boolean;
  previewLoading: boolean;
  previewBreakpoints: PreviewBreakpoints;
  imageFetch: boolean;
  imageFetchUrl: string;
}

export type PreviewBreakpoints = "sm" | "md" | "lg" | "auto";
