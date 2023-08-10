import React, { CSSProperties } from "react";
import { type Container } from "../../types/container.t";
import { ElementWithDynamicType, type Element } from "../../types/element.t";
import {
  CROUCHER_3_3_3_TEXT,
  CROUCHER_3_3_6,
  CROUCHER_6_6,
  CROUCHER_HEADING_TEXT,
  CROUCHER_IMG_CARD_CAROUSEL,
  CROUCHER_REPORT_CARD,
  CROUCHER_SUBSCRIBE,
  IMAGE_BLOCK,
  RICH_TEXT,
} from "../../utils/dragComponentTypes";
import Croucher_3_3_3_Text from "../Croucher_3_3_3_Text/Croucher_3_3_3_Text";
import Croucher_6_6 from "../Croucher_6_6/Croucher_6_6";
import Image from "../Image/Image";
import RichText from "./../../components/RichText/RichText";
import useContainer from "./useContainer";

import { FiPlus, FiSettings, FiXCircle } from "react-icons/fi";
import { CroucherImageCardList } from "../../types/croucher.t";
import CroucherHeading from "../CroucherHeading/CroucherHeading";
import Croucher_3_3_6 from "../Croucher_3_3_6/Croucher_3_3_6";
import Croucher_Img_Card_Carousel from "../Croucher_Img_Card_Carousel/Croucher_Img_Card_Carousel";
import Croucher_Report from "../Croucher_Report/Croucher_Report";
import Croucher_Subscribe from "../Croucher_Subscribe/Croucher_Subscribe";
import { EditorTooltip } from "../EditorTooltip/EditorTooltip";
import If from "../If";
import IfElse from "../IfElse";
import StyledSocketBlock from "./SocketBlock.style";

interface Props {
  style: CSSProperties;
  containerId: string;
  sectionId: string;
  container: Container;
  gridColClass: string;
}

const SocketBlock = ({
  containerId,
  sectionId,
  style,
  container,
  gridColClass,
}: Props) => {
  const {
    isActive,
    dropRef,
    previewMode,
    isEditMode,
    onSelectedContainer,
    isSelectedContainer,
  } = useContainer({
    containerId,
    sectionId,
  });

  return (
    <>
      <div
        ref={dropRef}
        style={style}
        className={`w-full group/container ${
          isActive ? "!bg-slate-300" : ""
        } relative ${gridColClass} min-h-[50px]
      ${
        isEditMode
          ? previewMode
            ? ""
            : `border border-dashed ${
                isSelectedContainer
                  ? "border-edt-primary"
                  : "border-rose-200 hover:border-edt-primary"
              }`
          : ""
      }
      `}
      >
        <StyledSocketBlock ref={dropRef} style={container.style}>
          <If isTrue={isEditMode}>
            <If isTrue={!previewMode}>
              <div
                className={`absolute right-0 top-0 z-10 ${
                  isSelectedContainer
                    ? ""
                    : "opacity-0 group-hover/container:opacity-100"
                }`}
              >
                <button
                  onClick={() => onSelectedContainer(container, sectionId)}
                  className={`bg-edt-primary rounded-[5px] p-1`}
                >
                  <EditorTooltip
                    renderOpener={(props) => (
                      <div {...props}>
                        <IfElse
                          isTrue={isSelectedContainer}
                          ifBlock={
                            <FiXCircle className="w-3 h-3 stroke-white" />
                          }
                          elseBlock={
                            <FiSettings className="w-3 h-3 stroke-white" />
                          }
                        />
                      </div>
                    )}
                  >
                    <>
                      <div className="text-xs">
                        {isSelectedContainer
                          ? "Cancel selected container"
                          : "Select to edit container"}
                      </div>
                    </>
                  </EditorTooltip>
                </button>
              </div>
            </If>
          </If>
          {container?.children?.length === 0 ? (
            <div className="w-full h-full min-h-[80px] justify-center items-center flex">
              <If isTrue={isEditMode && !previewMode}>
                <FiPlus className="w-4 h-4 stroke-edt-primary" />
              </If>
            </div>
          ) : null}
          {container?.children?.map((element: Element) => (
            <React.Fragment key={element.id}>
              {element?.elementType === RICH_TEXT && (
                <RichText
                  containerId={containerId}
                  sectionId={sectionId}
                  elementId={element.id}
                  bodyKey="body1"
                />
              )}
              {element?.elementType === IMAGE_BLOCK && (
                <>
                  <Image
                    element={element}
                    containerId={containerId}
                    sectionId={sectionId}
                    elementId={element.id}
                  />
                </>
              )}
              {element?.elementType === CROUCHER_6_6 && (
                <>
                  <Croucher_6_6
                    element={element}
                    containerId={containerId}
                    sectionId={sectionId}
                    elementId={element.id}
                  />
                </>
              )}
              {element?.elementType === CROUCHER_3_3_3_TEXT && (
                <>
                  <Croucher_3_3_3_Text
                    containerId={containerId}
                    sectionId={sectionId}
                    elementId={element.id}
                  />
                </>
              )}
              {element?.elementType === CROUCHER_3_3_6 && (
                <>
                  <Croucher_3_3_6
                    element={element}
                    containerId={containerId}
                    sectionId={sectionId}
                    elementId={element.id}
                  />
                </>
              )}
              {element?.elementType === CROUCHER_IMG_CARD_CAROUSEL && (
                <>
                  <Croucher_Img_Card_Carousel
                    element={
                      element as ElementWithDynamicType<CroucherImageCardList>
                    }
                    containerId={containerId}
                    sectionId={sectionId}
                    elementId={element.id}
                  />
                </>
              )}

              {element?.elementType === CROUCHER_REPORT_CARD && (
                <>
                  <Croucher_Report
                    element={
                      element as ElementWithDynamicType<CroucherImageCardList>
                    }
                    containerId={containerId}
                    sectionId={sectionId}
                    elementId={element.id}
                  />
                </>
              )}
              {element?.elementType === CROUCHER_HEADING_TEXT && (
                <>
                  <CroucherHeading
                    containerId={containerId}
                    sectionId={sectionId}
                    elementId={element.id}
                    element={element}
                  />
                </>
              )}

              {element?.elementType === CROUCHER_SUBSCRIBE && (
                <>
                  <Croucher_Subscribe
                    containerId={containerId}
                    sectionId={sectionId}
                    element={element}
                    elementId={element.id}
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </StyledSocketBlock>
      </div>
    </>
  );
};

export default SocketBlock;
