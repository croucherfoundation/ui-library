import { useState } from "react";
import { type Element } from "../../types/element.t";
import Editor from "../RichText/RichText";

interface Props {
  element: Element;
  containerId: string;
  sectionId: string;
  elementId: string;
}

const Croucher_3_3_3_Text = ({
  element,
  containerId,
  sectionId,
  elementId,
}: Props) => {
  const [isReadMore, setIsReadMore] = useState<boolean>(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
        <div>
          <Editor
            sectionId={sectionId}
            containerId={containerId}
            elementId={elementId}
            bodyKey="body1"
          />
        </div>
        <div className={`${isReadMore ? "" : "hidden md:block"}`}>
          <Editor
            sectionId={sectionId}
            containerId={containerId}
            elementId={elementId}
            bodyKey="body2"
          />
        </div>
        <div className={`${isReadMore ? "" : "hidden md:block"}`}>
          <Editor
            sectionId={sectionId}
            containerId={containerId}
            elementId={elementId}
            bodyKey="body3"
          />
        </div>
      </div>
      <div className="flex justify-end md:hidden">
        <button
          onClick={() => setIsReadMore((prev) => !prev)}
          className="border px-3 py-1 rounded-full border-black"
        >
          Read {isReadMore ? "less" : "more"}
        </button>
      </div>
    </>
  );
};

export default Croucher_3_3_3_Text;
