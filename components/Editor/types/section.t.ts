import { type Container } from "./container.t";

export interface Section {
  section: SectionState[];
  selectedItem: SelectedEditorItem | null;
  previewMode: boolean;
  updateSection: (payload: SectionState[]) => void;
  updateSelectedItem: (payload: SelectedEditorItem | null) => void;
}

export interface SectionState {
  id: string;
  type: string;
  layoutStyle: LayoutState;
  option: Option;
  style: Style;
  children: Container[];
}

export interface Option {
  contentWidth: string;
  minWidth: string;
  minHeight: string;
  direction: string;
  justifyContent: string;
  alignContent: string;
  gap: number;
}

export interface Style {
  background: Background;
  border: Border;
}

export interface Background {
  normal: NormalClass;
  hover: NormalClass;
}

export interface NormalClass {
  type: string;
  bgColor: string;
}

export interface Border {
  normal: Normal;
  hover: BorderHover;
}

export interface BorderHover {
  borderType: string;
}

export interface Normal {
  borderType: string;
  radius: Radius;
  boxShadow: any;
}

export interface Radius {
  top: number;
  left: number;
  bottom: number;
  right: number;
  isLinked: boolean;
}

export interface LayoutState {
  lg: string;
  md: string;
  sm: string
}

export interface SelectedEditorItem {
  elementType: string;
  id: string;
  layoutStyle?: LayoutState;
}