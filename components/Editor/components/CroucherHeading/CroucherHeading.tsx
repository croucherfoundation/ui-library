import { type Element } from "../../types/element.t";
import IfElse from "../IfElse";
import StyledComponentHeading from "./StyledCroucherHeading";
import useContainer from "./useContainer";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
  element: Element;
}

const CroucherHeading = ({
  containerId,
  sectionId,
  elementId,
  element,
}: Props) => {
  const { heading, isEditMode, handleSetHeading, previewMode } = useContainer({
    containerId,
    sectionId,
    elementId,
    element,
  });

  return (
    <div className="relative">
      <IfElse
        isTrue={isEditMode}
        ifBlock={
          <>
            <IfElse
              isTrue={previewMode}
              ifBlock={
                <div>
                  <StyledComponentHeading>{heading}</StyledComponentHeading>
                </div>
              }
              elseBlock={
                <>
                  <input
                    placeholder="Heading"
                    value={heading}
                    onChange={(e) => handleSetHeading(e.target.value)}
                    className="bg-transparent text-[28px] md:text-[36px] font-bold focus:outline-none croucher-heading resize-none h-auto w-full"
                    disabled={!isEditMode}
                    type="text"
                  />
                </>
              }
            />
          </>
        }
        elseBlock={
          <div>
            <StyledComponentHeading>{heading}</StyledComponentHeading>
            {/* <p className="text-[28px] md:text-[36px] font-bold ml-[18px] lg:ml-[24px] croucher-text">
            </p> */}
          </div>
        }
      />
    </div>
  );
};

export default CroucherHeading;
