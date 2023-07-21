import { useState } from "react";
import { type Element } from "../../types/element.t";
import CroucherHeading from "../CroucherHeading/CroucherHeading";
import Image from "../Image/Image";
import RichText from "./../RichText/RichText";

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
      <div className="flex flex-col-reverse md:flex-row">
        {/* ----- left ----- */}
        <div className="md:w-6/12 w-full py-[16px] md:py-[40px] px-[21px] md:px-[26px]">
          <CroucherHeading
            containerId={containerId}
            sectionId={sectionId}
            elementId={element.id}
          />
          <RichText
            containerId={containerId}
            sectionId={sectionId}
            elementId={element.id}
            bodyKey="body1"
          />
          <div className={isReadMore ? "" : "hidden md:block"}>
            <RichText
              containerId={containerId}
              sectionId={sectionId}
              elementId={element.id}
              bodyKey="body2"
            />
          </div>

          <div className="justify-end flex sm:hidden">
            <button
              onClick={() => setIsReadMore((prev) => !prev)}
              className="border px-4 rounded-full py-1 border-gray-700"
            >
              Read {isReadMore ? "less" : "more"}
            </button>
          </div>
        </div>

        {/* ----- right ----- */}
        <div className="md:w-6/12 w-full">
          <Image
            element={element}
            containerId={containerId}
            sectionId={sectionId}
            elementId={elementId}
          />
        </div>
      </div>
    </>
  );
};

export default Croucher_6_6;
