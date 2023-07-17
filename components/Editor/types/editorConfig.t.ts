export interface EditorConfigStore {
  config: EditorConfig,
  updateEditorConfig: (payload: EditorConfig) => void,
}

export interface EditorConfig {
  previewMode: boolean;
  previewBreakpoints: PreviewBreakpoints;
}

export type PreviewBreakpoints = "sm" | "md" | "lg" | "auto";