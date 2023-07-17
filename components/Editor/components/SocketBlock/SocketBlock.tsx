import React, { CSSProperties, useState } from "react";
import { type Container } from "../../types/container.t";
import { type Element } from "../../types/element.t";
import {
  CROUCHER_6_6,
  IMAGE_BLOCK,
  RICH_TEXT,
} from "../../utils/dragComponentTypes";
import Croucher_6_6 from "../Croucher_6_6/Croucher_6_6";
import Image from "../Image/Image";
import RichText from "./../../components/RichText/RichText";
import useContainer from "./useContainer";

import {
  FloatingFocusManager,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";

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
  const { isActive, dropRef, removeChildElements } = useContainer({
    containerId,
    sectionId,
  });
  const [isShowContextMenu, setIsShowContextMenu] = useState<boolean>(false);
  const { refs, floatingStyles, context, x, y } = useFloating({
    open: isShowContextMenu,
    onOpenChange: setIsShowContextMenu,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
    // transform: false,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const headingId = useId();

  console.log({ floatingStyles, x, y });

  return (
    <div
      ref={dropRef}
      style={style}
      className={`w-full ${
        isActive ? "!bg-slate-300" : ""
      } relative ${gridColClass} min-h-[200px]`}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsShowContextMenu(true);
      }}
    >
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="w-full relative"
      >
        {isShowContextMenu && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              className="bg-white/50 drop-shadow-md shadow-md rounded-md"
              ref={refs.setFloating}
              style={floatingStyles}
              aria-labelledby={headingId}
              {...getFloatingProps()}
            >
              <h1 id={headingId} className="text-xl px-3 py-2">
                Layout settings
              </h1>
              <div className="">
                <div
                  onClick={() => {
                    removeChildElements();
                    setIsShowContextMenu(false);
                  }}
                  className="w-full cursor-pointer hover:bg-red-300 hover:text-red-500 px-3 py-2"
                >
                  Delete element
                </div>
                <div className="w-full cursor-pointer hover:bg-red-300 hover:text-red-500 px-3 py-2">
                  Delete section
                </div>
              </div>
            </div>
          </FloatingFocusManager>
        )}

        {container?.children?.map((element: Element) => (
          <React.Fragment key={element.id}>
            {element?.type === RICH_TEXT && (
              <RichText
                containerId={containerId}
                sectionId={sectionId}
                elementId={element.id}
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
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SocketBlock;
