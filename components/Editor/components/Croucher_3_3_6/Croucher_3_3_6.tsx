import { type Element } from "../../types/element.t";
import CroucherHeading from "../CroucherHeading/CroucherHeading";
import Image from "../Image/Image";
import LinkButton from "../LinkButton/LinkButton";
import RichText from "../RichText/RichText";
import { LeftContainer } from "./LeftContainer.style";

interface Props {
  element: Element;
  containerId: string;
  sectionId: string;
  elementId: string;
}

const Croucher_3_3_6 = ({
  element,
  containerId,
  sectionId,
  elementId,
}: Props) => {
  return (
    <>
      <div>
        <div className="flex flex-col-reverse md:flex-row">
          <LeftContainer className="md:w-6/12 w-full">
            {/* ----- heading ----- */}
            <div className="-mt-[8px] md:mt-0 mb-[2px] md:mb-0">
              <CroucherHeading
                containerId={containerId}
                sectionId={sectionId}
                elementId={element.id}
                element={element}
              />
            </div>
            <div className="flex gap-[22px]">
              {/* ----- stuff left ----- */}
              <div className="md:w-[255px]">
                <RichText
                  containerId={containerId}
                  sectionId={sectionId}
                  elementId={element.id}
                  bodyKey="body1"
                />
              </div>
              {/* ----- stuff right ----- */}
              <div className="md:w-[255px] ">
                <RichText
                  containerId={containerId}
                  sectionId={sectionId}
                  elementId={element.id}
                  bodyKey="body2"
                />
                <div className="mt-[26px]">
                  <LinkButton
                    containerId={containerId}
                    sectionId={sectionId}
                    elementId={element.id}
                  />
                </div>
              </div>
            </div>
          </LeftContainer>
          {/* ----- image ----- */}
          <div className="md:w-6/12 w-full">
              <Image
                element={element}
                containerId={containerId}
                sectionId={sectionId}
                elementId={elementId}
              />
          </div>
        </div>
      </div>
    </>
  );
};

export default Croucher_3_3_6;
