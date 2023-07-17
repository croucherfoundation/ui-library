import { ReactNode } from "react";
import { useDrag } from "react-dnd";

interface Props {
  icon: ReactNode;
  title: string;
  data: {
    type: string;
  };
}

const Element = ({ icon, title, data }: Props) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "element",
      item: data,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );

  return (
    <div
      ref={dragRef}
      style={{ opacity }}
      className="w-full rounded bg-slate-100 text-center py-5 cursor-move"
    >
      {icon}
      <p>{title}</p>
    </div>
  );
};

export default Element;
