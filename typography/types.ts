export type TextColor = "white" | "black" | "primary" | "croucher-grey";

export type BaseTextContainer = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  color?: TextColor;
  textAlign?: textAlignment;
};

export type textAlignment = "left" | "center" | "right" | "justify";

export type BaseText = BaseTextContainer & {
  children?: React.ReactNode;
};

export type componentType<T> = React.FC<T>;

export type BaseTextType = componentType<BaseText>;



export type HeaderType = React.HTMLAttributes<HTMLDivElement> & {
  color?: TextColor;
  children?: React.ReactNode;
};

export type HeaderTextType = componentType<HeaderType>;

export type HeaderContainerType = {
  textContent: React.ReactNode;
};


