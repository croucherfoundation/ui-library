import { useState } from "react";
import Editor from "../RichText/RichText";
import ContainerWrapper from "./ContainerWrapper.style";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

const Croucher_3_3_3_Text = ({ containerId, sectionId, elementId }: Props) => {
  const [isReadMore, setIsReadMore] = useState<boolean>(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
        <ContainerWrapper>
          <Editor
            sectionId={sectionId}
            containerId={containerId}
            elementId={elementId}
            bodyKey="body1"
          />
        </ContainerWrapper>
        <ContainerWrapper
          className={`${isReadMore ? "" : "hidden md:block"} my-[20px] md:my-0`}
        >
          <Editor
            sectionId={sectionId}
            containerId={containerId}
            elementId={elementId}
            bodyKey="body2"
          />
        </ContainerWrapper>
        <ContainerWrapper className={`${isReadMore ? "" : "hidden md:block"}`}>
          <Editor
            sectionId={sectionId}
            containerId={containerId}
            elementId={elementId}
            bodyKey="body3"
          />
        </ContainerWrapper>
      </div>
      <div className="flex justify-end md:hidden mt-[8px]">
        <button
          onClick={() => setIsReadMore((prev) => !prev)}
          className="readmore-btn"
        >
          Read {isReadMore ? "less" : "more"}
        </button>
      </div>
    </>
  );
};

export default Croucher_3_3_3_Text;
