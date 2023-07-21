import { type Element } from "../../types/element.t";
import CroucherHeading from "../CroucherHeading/CroucherHeading";
import Image from "../Image/Image";
import LinkButton from "../LinkButton/LinkButton";
import RichText from "../RichText/RichText";

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
          <div className="md:w-6/12 w-full">
            {/* ----- heading ----- */}
            <div>
              <CroucherHeading
                containerId={containerId}
                sectionId={sectionId}
                elementId={element.id}
              />
            </div>
            <div className="flex">
              {/* ----- stuff left ----- */}
              <div className="w-6/12">
                <RichText
                  containerId={containerId}
                  sectionId={sectionId}
                  elementId={element.id}
                  bodyKey="body1"
                />
              </div>
              {/* ----- stuff right ----- */}
              <div className="w-6/12">
                <RichText
                  containerId={containerId}
                  sectionId={sectionId}
                  elementId={element.id}
                  bodyKey="body2"
                />
                <div>
                  <LinkButton />
                </div>
              </div>
            </div>
          </div>
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
