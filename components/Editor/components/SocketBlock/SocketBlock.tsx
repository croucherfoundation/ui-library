import React, { CSSProperties } from "react";
import { type Container } from "../../types/container.t";
import { type Element } from "../../types/element.t";
import {
  CROUCHER_3_3_3_TEXT,
  CROUCHER_6_6,
  IMAGE_BLOCK,
  RICH_TEXT,
} from "../../utils/dragComponentTypes";
import Croucher_6_6 from "../Croucher_6_6/Croucher_6_6";
import Croucher_3_3_3_Text from "../Croucher_3_3_3_Text/Croucher_3_3_3_Text";
import Image from "../Image/Image";
import RichText from "./../../components/RichText/RichText";
import useContainer from "./useContainer";

import { FiTrash } from "react-icons/fi";
import If from "../If";

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
  const { isActive, dropRef, removeChildElements, previewMode, isEditMode } =
    useContainer({
      containerId,
      sectionId,
    });

  return (
    <div
      ref={dropRef}
      style={style}
      className={`w-full ${
        isActive ? "!bg-slate-300" : ""
      } relative ${gridColClass} min-h-[200px]
      ${previewMode ? "" : "border border-dashed"}
      `}
    >
      <If isTrue={isEditMode}>
        <If isTrue={!previewMode}>
          <div className="flex gap-3">
            <button
              onClick={removeChildElements}
              className="bg-gray-700 rounded-md p-1"
            >
              <FiTrash className="stroke-white w-3 h-3" />
            </button>
          </div>
        </If>
      </If>

      {container?.children?.map((element: Element) => (
        <React.Fragment key={element.id}>
          {element?.type === RICH_TEXT && (
            <RichText
              containerId={containerId}
              sectionId={sectionId}
              elementId={element.id}
              bodyKey="body1"
            />
          )}
          {element?.type === IMAGE_BLOCK && (
            <>
              <Image
                element={element}
                containerId={containerId}
                sectionId={sectionId}
                elementId={element.id}
              />
            </>
          )}
          {element?.type === CROUCHER_6_6 && (
            <>
              <Croucher_6_6
                element={element}
                containerId={containerId}
                sectionId={sectionId}
                elementId={element.id}
              />
            </>
          )}
          {element?.type === CROUCHER_3_3_3_TEXT && (
            <>
              <Croucher_3_3_3_Text
                element={element}
                containerId={containerId}
                sectionId={sectionId}
                elementId={element.id}
              />
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SocketBlock;
