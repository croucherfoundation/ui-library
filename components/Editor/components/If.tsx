import React from "react";

interface Props {
  isTrue: boolean;
  children: React.ReactNode;
}

const If = ({ isTrue, children }: Props) => {
  return <>{isTrue && <>{children}</>}</>;
};

export default If;
