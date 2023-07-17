import Image from "../Image/Image";
import { type Element } from "../../types/element.t";
import RichText from "./../RichText/RichText";
import CroucherHeading from "../CroucherHeading/CroucherHeading";

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
  return (
    <>
      <div className="flex flex-col-reverse md:flex-row">
        {/* ----- left ----- */}
        <div className="md:w-6/12 w-full p-3">
          <CroucherHeading
            containerId={containerId}
            sectionId={sectionId}
            elementId={element.id}
          />
          <RichText
            containerId={containerId}
            sectionId={sectionId}
            elementId={element.id}
          />
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
