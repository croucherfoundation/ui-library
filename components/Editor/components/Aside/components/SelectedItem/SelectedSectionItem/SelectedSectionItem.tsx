import { Listbox } from "@headlessui/react";
import { useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import {
  FaArrowsUpDown,
  FaLaptop,
  FaMobileButton,
  FaTabletScreenButton,
} from "react-icons/fa6";
import useSectionStore from "../../../../../store/section.store";
import generateGridColInfo from "../../../../../utils/generateGridColInfo";
import BreakpointIcon from "../../BreakpointIcon/BreakpointIcon";
import useContainer from "./useContainer";

function SelectedSectionItem() {
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);
  const {
    bgColors,
    handleOnChangeSectionBackgroundColor,
    defaultBreakPointStyle,
    breakpoint,
    setBreakpoint,
    updateSelectedItemBreakpoints,
    deleteSelectedSection,
    paddingControl,
    paddingHandleSubmit,
    handlePaddingFormSubmit,
    paddingErrors,
  } = useContainer();

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

  return selectedItem ? (
    <>
      <div className="p-4 grid grid-cols-1 gap-3 border-t border-gray-300">
        {/* ----- breakpoints ----- */}
        <div>
          <h3 className="mb-3">Select breakpoints</h3>
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
        </div>

        {/* ----- background ----- */}
        <div>
          <h3 className="mb-3">Section background</h3>

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

        {/* ----- layout ----- */}
        <div>
          <h3 className="mb-3">Section layout</h3>

          <div className="grid grid-cols-1 gap-5">
            {/* ----- layouts ----- */}
            <div className="">
              <h3 className="text-gray-500 mb-2">Choose layouts</h3>
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

            {/* ----- padding ----- */}
            <div className="">
              <h3 className="text-gray-500 mb-2">Padding</h3>
              <form
                className="flex gap-2"
                onChange={(e) =>
                  void paddingHandleSubmit(handlePaddingFormSubmit)(e)
                }
              >
                <Controller
                  control={paddingControl}
                  name="paddingTop"
                  render={({ field }) => (
                    <input
                      placeholder="T"
                      type="text"
                      className={`w-12 text-xs h-10 rounded-md p-2 focus:outline-none ${
                        paddingErrors.paddingTop ? "border border-red-500" : ""
                      }`}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={paddingControl}
                  name="paddingLeft"
                  render={({ field }) => (
                    <input
                      placeholder="L"
                      type="text"
                      className={`w-12 text-xs h-10 rounded-md p-2 focus:outline-none ${
                        paddingErrors.paddingLeft ? "border border-red-500" : ""
                      }`}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={paddingControl}
                  name="paddingBottom"
                  render={({ field }) => (
                    <input
                      placeholder="B"
                      type="text"
                      className={`w-12 text-xs h-10 rounded-md p-2 focus:outline-none ${
                        paddingErrors.paddingBottom
                          ? "border border-red-500"
                          : ""
                      }`}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={paddingControl}
                  name="paddingRight"
                  render={({ field }) => (
                    <input
                      placeholder="R"
                      type="text"
                      className={`w-12 text-xs h-10 rounded-md p-2 focus:outline-none ${
                        paddingErrors.paddingRight
                          ? "border border-red-500"
                          : ""
                      }`}
                      {...field}
                    />
                  )}
                />

                <div className="w-10 h-10 p-2 text-xs border border-gray-50 rounded-md">
                  px
                </div>
              </form>
            </div>

            {/* ----- margin ----- */}
            <div className="">
              <h3 className="text-gray-500 mb-2">Margin</h3>
              <div className="flex gap-2">
                <input type="text" className="w-10 h-10 rounded-md p-2" />
                <input type="text" className="w-10 h-10 rounded-md p-2" />
                <input type="text" className="w-10 h-10 rounded-md p-2" />
                <input type="text" className="w-10 h-10 rounded-md p-2" />
              </div>
            </div>
          </div>
        </div>

        {/* ----- delete section ----- */}
        <div>
          <button
            onClick={() =>
              deleteSelectedSection({ sectionId: selectedItem.id })
            }
            className="mt-3 relative w-full cursor-pointer rounded-lg bg-red-500 hover:bg-red-400 text-white py-2 text-center focus:outline-none text-xs"
          >
            Delete section
          </button>
        </div>
      </div>
    </>
  ) : null;
}
export default SelectedSectionItem;
