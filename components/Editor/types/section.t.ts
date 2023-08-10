import { type Container } from "./container.t";
import { selectedCroucherElementType } from "./croucher.t";
import { type Element, imageObjectFitType } from "./element.t";

interface SectionStateAll {
  en: SectionState[],
  hk: SectionState[]
}
export interface Section {
  section: SectionStateAll;
  selectedItem: SelectedEditorItem | null;
  selectedSection: SectionState | null;
  selectedContainer: Container | null;
  breakpoint: Breakpoint;
  selectedElement: Element | null;
  updateAllSection: (payload: SectionStateAll) => void;
  updateEnSection: (payload: SectionState[]) => void;
  updateHkSection: (payload: SectionState[]) => void;
  updateSelectedItem: (payload: SelectedEditorItem | null) => void;
  updateSelectedSection: (payload: SectionState | null) => void;
  updateSelectedContainer: (payload: Container | null) => void;
  updateSelectedElement: (payload: Element | null) => void;
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
  maxWidth: {
    sm: number;
    md: number;
    lg: number;
  };
  minHeight: string;
  direction: string;
  justifyContent: string;
  alignContent: string;
  gap: number;
  unit: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface Style {
  background: Background;
  border: Border;
  padding: Padding;
  margin: Margin;
}

export interface SocketStyle {
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
export interface Margin {
  sm: {
    marginTop: number;
    marginLeft: number;
    marginBottom: number;
    marginRight: number;
  };
  md: {
    marginTop: number;
    marginLeft: number;
    marginBottom: number;
    marginRight: number;
  };
  lg: {
    marginTop: number;
    marginLeft: number;
    marginBottom: number;
    marginRight: number;
  };
}

export interface BorderHover {
  borderType: string;
}

export interface Normal {
  borderType: string;
  radius: Radius;
  boxShadow: unknown;
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

export type selectedElementType = "section" | "container" | "imageBlock";

export interface SelectedEditorItem {
  id: string;
  elementType: selectedElementType | selectedCroucherElementType;
  layoutStyle?: LayoutState;
  sectionId?: string;
  containerId?: string;
  style?: { objectFit: imageObjectFitType };
}
