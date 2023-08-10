import { useState } from "react";
import { type Element } from "../../types/element.t";
import CroucherHeading from "../CroucherHeading/CroucherHeading";
import Image from "../Image/Image";
import RichText from "./../RichText/RichText";
import { LeftContainer } from "./LeftContainer.style";
import ContainerWrapper from "./Croucher_6_6.style";

interface Props {
  element: Element;
  containerId: string;
  sectionId: string;
  elementId: string;
}

const Croucher_6_6 = ({
  element,
  containerId,
  sectionId,
  elementId,
}: Props) => {
  const [isReadMore, setIsReadMore] = useState<boolean>(false);
  return (
    <>
      <ContainerWrapper className="flex flex-col-reverse md:flex-row">
        {/* ----- left ----- */}
        <LeftContainer className="md:w-6/12 w-full">
          <CroucherHeading
            containerId={containerId}
            sectionId={sectionId}
            elementId={element.id}
            element={element}
          />
          <RichText
            containerId={containerId}
            sectionId={sectionId}
            elementId={element.id}
            bodyKey="body1"
          />
          <div className={`${isReadMore ? "" : "hidden md:block"} mt-[20px] `}>
            <RichText
              containerId={containerId}
              sectionId={sectionId}
              elementId={element.id}
              bodyKey="body2"
            />
          </div>

          <div className="justify-end flex sm:hidden mt-[14px]">
            <button
              onClick={() => setIsReadMore((prev) => !prev)}
              className="readmore-btn"
            >
              Read {isReadMore ? "less" : "more"}
            </button>
          </div>
        </LeftContainer>

        {/* ----- right ----- */}
        <div className="md:w-6/12 w-full">
          <div className="max-h-[389px] overflow-hidden">
            <Image
              element={element}
              containerId={containerId}
              sectionId={sectionId}
              elementId={elementId}
            />
          </div>
        </div>
      </ContainerWrapper>
    </>
  );
};

export default Croucher_6_6;
