import { type Container } from "./container.t";

export interface Section {
  section: SectionState[];
  selectedItem: SelectedEditorItem | null;
  selectedSection: SectionState | null;
  breakpoint: Breakpoint;
  updateSection: (payload: SectionState[]) => void;
  updateSelectedItem: (payload: SelectedEditorItem | null) => void;
  updateSelectedSection: (payload: SectionState | null) => void;
  setBreakpoint: (payload: Breakpoint) => void;
}

export type Breakpoint = "lg" | "md" | "sm";

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
  padding: Padding;
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

export interface Padding {
  sm: {
    paddingTop: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingRight: number;
  };
  md: {
    paddingTop: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingRight: number;
  };
  lg: {
    paddingTop: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingRight: number;
  };
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
  sm: string;
}

export interface SelectedEditorItem {
  elementType: string;
  id: string;
  layoutStyle?: LayoutState;
}
