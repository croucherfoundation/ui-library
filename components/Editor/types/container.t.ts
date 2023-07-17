export interface Container {
  id: string;
  type: string;
  option: Option;
  style: Style;
  advancedStyle: any;
  children: any[];
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
