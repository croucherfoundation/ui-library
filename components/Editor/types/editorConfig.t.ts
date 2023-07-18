export interface EditorConfigStore {
  config: EditorConfig,
  updateEditorConfig: (payload: EditorConfig) => void,
}

export interface EditorConfig {
  previewMode: boolean;
  previewLoading: boolean;
  previewBreakpoints: PreviewBreakpoints;
  imageFetch: boolean,
  imageFetchUrl: string;
}

export type PreviewBreakpoints = "sm" | "md" | "lg" | "auto";