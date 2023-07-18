import { useCallback, useEffect, useMemo } from "react";
import { Listbox } from "@headlessui/react";
import {
  FaMobileButton,
  FaArrowsUpDown,
  FaTabletScreenButton,
  FaLaptop,
} from "react-icons/fa6";
import useSectionStore from "../../../../store/section.store";
import useSelectedItem from "../hooks/useSelectedItem";
import generateGridColInfo from "../../../../utils/generateGridColInfo";
import BreakpointIcon from "../BreakpointIcon/BreakpointIcon";
import useContainer from "./useContainer";

function SelectedItem() {
  const {
    defaultBreakPointStyle,
    breakpoint,
    setBreakpoint,
    updateSelectedItemBreakpoints,
    deleteSelectedSection,
  } = useSelectedItem();
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);
  const { bgColors, handleOnChangeSectionBackgroundColor } = useContainer();

  const breakPointList = useMemo<string[]>(() => {
    if (!selectedItem?.layoutStyle) {
      return [];
    }

    return generateGridColInfo(selectedItem?.layoutStyle?.lg);
  }, [selectedItem?.layoutStyle]);

  const disabledBreakpoint = useMemo<boolean>(
    () => breakpoint === "lg" || selectedItem?.layoutStyle?.lg === "_12",
    [breakpoint, selectedItem?.layoutStyle]
  );

  const onChangeLayout = useCallback(
    (value: string) => {
      if (!selectedItem) return;
      updateSelectedItemBreakpoints({
        sectionId: selectedItem?.id,
        breakpoint,
        breakpointValue: value,
      });
    },
    [breakpoint, selectedItem, updateSelectedItemBreakpoints]
  );

  useEffect(() => {
    console.log("Changes selectedItem", selectedItem);
  }, [selectedItem]);

  return selectedItem ? (
    <>
      <div className="mt-3 w-full p-4 border-t border-gray-300">
        {/* ----- layout section ----- */}
        <div>
          <div className="items-center mb-2 justify-start col-span-1 space-x-2 flex mt-2">
            <button
              onClick={() => setBreakpoint("sm")}
              className={`${defaultBreakPointStyle} ${
                breakpoint === "sm" ? "bg-indigo-700 text-white" : "bg-white"
              }`}
            >
              <FaMobileButton />
            </button>

            <button
              onClick={() => setBreakpoint("md")}
              className={`${defaultBreakPointStyle} ${
                breakpoint === "md" ? "bg-indigo-700 text-white" : "bg-white"
              }`}
            >
              <FaTabletScreenButton />
            </button>

            <button
              onClick={() => setBreakpoint("lg")}
              className={`${defaultBreakPointStyle} ${
                breakpoint === "lg" ? "bg-indigo-700 text-white" : "bg-white"
              }`}
            >
              <FaLaptop />
            </button>
          </div>

          <Listbox
            value={selectedItem?.layoutStyle?.[breakpoint] || ""}
            onChange={onChangeLayout}
            disabled={disabledBreakpoint}
          >
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <div className="flex flex-row items-center">
                <span className="flex mr-2 items-center justify-center w-10 h-8 bg-white ">
                  <BreakpointIcon
                    layout={selectedItem?.layoutStyle?.[breakpoint] || ""}
                  />
                </span>
                {selectedItem?.layoutStyle?.[breakpoint]}
              </div>
              {!disabledBreakpoint && (
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <FaArrowsUpDown />
                </span>
              )}
            </Listbox.Button>
            <Listbox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {breakPointList.map((bp) => (
                <Listbox.Option
                  key={`bp_${bp}`}
                  value={bp}
                  className="relative pl-3 cursor-pointer select-none py-2 text-gray-900 flex items-center hover:bg-gray-100"
                >
                  <span className="flex mr-2 items-center justify-center w-10 h-8 bg-white ">
                    <BreakpointIcon layout={bp} />
                  </span>
                  <span className="flex-1">{bp}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
      {/* ----- background ----- */}
      <div className="border-t border-gray-300 p-4 ">
        <h3 className="mb-3">Choose background color</h3>

        <div className="flex gap-3">
          {bgColors.map((bgColor) => (
            <button
              key={bgColor.id}
              style={{
                backgroundColor: bgColor.value,
              }}
              onClick={() =>
                handleOnChangeSectionBackgroundColor(bgColor.value)
              }
              className="w-10 h-10 rounded-md shadow-md border border-blue-50"
            ></button>
          ))}
        </div>
      </div>

      {/* ----- delete section ----- */}
      <div className="p-4">
        <button
          onClick={() => deleteSelectedSection({ sectionId: selectedItem.id })}
          className="mt-3 relative w-full cursor-pointer rounded-lg bg-red-500 hover:bg-red-400 text-white py-2 text-center focus:outline-none text-xs"
        >
          Delete Section
        </button>
      </div>
    </>
  ) : null;
}
export default SelectedItem;
