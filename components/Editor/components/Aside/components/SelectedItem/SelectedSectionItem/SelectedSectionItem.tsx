import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import { FiChevronDown, FiCode } from "react-icons/fi";
import useSectionStore from "../../../../../store/section.store";
import generateGridColInfo from "../../../../../utils/generateGridColInfo";
import BreakpointIcon from "../../BreakpointIcon/BreakpointIcon";
import useContainer from "./useContainer";

function SelectedSectionItem() {
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);
  const {
    bgColors,
    handleOnChangeSectionBackgroundColor,
    breakpoint,
    updateSelectedItemBreakpoints,
    deleteSelectedSection,
    paddingControl,
    paddingHandleSubmit,
    handlePaddingFormSubmit,
    paddingErrors,
    marginControl,
    marginHandleSubmit,
    handleMarginFormSubmit,
    marginErrors,
    maxWidthControl,
    maxWidthErrors,
    maxWidthHandleSubmit,
    handleMaxwidthFormSubmit,
    units,
    selectedUnit,
    handleChangeUnit,
  } = useContainer();

  const breakPointList = useMemo<string[]>(() => {
    if (!selectedItem?.layoutStyle) {
      return [];
    }

    return generateGridColInfo(
      selectedItem?.layoutStyle ? selectedItem?.layoutStyle?.lg : ""
    );
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
      <div className="grid grid-cols-1 gap-5 p-4 border-t border-gray-300">
        {/* ----- max-width ----- */}
        <div>
          <h3 className="mb-3 font-bold">Section max-width</h3>
          <form
            onChange={(e) =>
              void maxWidthHandleSubmit(handleMaxwidthFormSubmit)(e)
            }
          >
            <Controller
              control={maxWidthControl}
              name="maxWidth"
              render={({ field }) => (
                <div className="flex gap-3">
                  <input
                    type="text"
                    className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                      maxWidthErrors.maxWidth ? "border border-red-500" : ""
                    }`}
                    {...field}
                  />
                  <div>
                    <div className="">
                      <Listbox value={selectedUnit}>
                        <div className="relative">
                          <Listbox.Button className="relative h-10 pl-3 pr-10 text-left bg-white rounded-[5px] cursor-default w-16">
                            <span className="block">{selectedUnit.name}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <FiChevronDown
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {units.map((un, unitIdx) => (
                                <Listbox.Option
                                  onClick={() => handleChangeUnit(un)}
                                  key={unitIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 text-center ${
                                      active
                                        ? "bg-edt-secondary"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={un}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {un.name}
                                      </span>
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                </div>
              )}
            />
          </form>
        </div>

        {/* ----- background ----- */}
        <div>
          <h3 className="mb-3 font-bold">Section background</h3>
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
                className="w-10 h-10 border rounded-md shadow-md border-blue-50"
              ></button>
            ))}
          </div>
        </div>

        {/* ----- layout ----- */}
        <div>
          <h3 className="mb-3 font-bold">Section layout</h3>

          <div className="grid grid-cols-1 gap-5">
            {/* ----- layouts ----- */}
            <div className="">
              <h3 className="mb-2 text-gray-500">Choose layouts</h3>
              <Listbox
                value={selectedItem?.layoutStyle?.[breakpoint] || ""}
                onChange={onChangeLayout}
                disabled={disabledBreakpoint}
              >
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <div className="flex flex-row items-center">
                    <span className="flex items-center justify-center w-10 h-8 mr-2 bg-white ">
                      <BreakpointIcon
                        layout={selectedItem?.layoutStyle?.[breakpoint] || ""}
                      />
                    </span>
                    {selectedItem?.layoutStyle?.[breakpoint]}
                  </div>
                  {!disabledBreakpoint && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <FiCode className="transform rotate-90" />
                    </span>
                  )}
                </Listbox.Button>
                <Listbox.Options className="w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-sm max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {breakPointList.map((bp) => (
                    <Listbox.Option
                      key={`bp_${bp}`}
                      value={bp}
                      className="relative flex items-center py-2 pl-3 text-gray-900 cursor-pointer select-none hover:bg-gray-100"
                    >
                      <span className="flex items-center justify-center w-10 h-8 mr-2 bg-white ">
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
              <h3 className="mb-2 text-gray-500">Padding</h3>
              <form
                className="grid items-end grid-cols-5 gap-2"
                onChange={(e) =>
                  void paddingHandleSubmit(handlePaddingFormSubmit)(e)
                }
              >
                <Controller
                  control={paddingControl}
                  name="paddingTop"
                  render={({ field }) => (
                    <>
                      <div>
                        <label
                          htmlFor="pt"
                          className="text-[11px] text-gray-500"
                        >
                          Top :
                        </label>
                        <input
                          placeholder="T"
                          type="text"
                          id="pt"
                          className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                            paddingErrors.paddingTop
                              ? "border border-red-500"
                              : ""
                          }`}
                          {...field}
                        />
                      </div>
                    </>
                  )}
                />
                <Controller
                  control={paddingControl}
                  name="paddingRight"
                  render={({ field }) => (
                    <>
                      <div>
                        <label
                          htmlFor="pt"
                          className="text-[11px] text-gray-500"
                        >
                          Right :
                        </label>
                        <input
                          placeholder="R"
                          type="text"
                          id="pt"
                          className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                            paddingErrors.paddingRight
                              ? "border border-red-500"
                              : ""
                          }`}
                          {...field}
                        />
                      </div>
                    </>
                  )}
                />
                <Controller
                  control={paddingControl}
                  name="paddingBottom"
                  render={({ field }) => (
                    <>
                      <div>
                        <label
                          htmlFor="pt"
                          className="text-[10px] text-gray-500"
                        >
                          Bottom :
                        </label>
                        <input
                          placeholder="B"
                          type="text"
                          id="pt"
                          className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                            paddingErrors.paddingBottom
                              ? "border border-red-500"
                              : ""
                          }`}
                          {...field}
                        />
                      </div>
                    </>
                  )}
                />
                <Controller
                  control={paddingControl}
                  name="paddingLeft"
                  render={({ field }) => (
                    <>
                      <div>
                        <label
                          htmlFor="pt"
                          className="text-[11px] text-gray-500"
                        >
                          Left :
                        </label>
                        <input
                          placeholder="L"
                          type="text"
                          id="pt"
                          className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                            paddingErrors.paddingLeft
                              ? "border border-red-500"
                              : ""
                          }`}
                          {...field}
                        />
                      </div>
                    </>
                  )}
                />

                <div className="w-full h-10 p-2 text-xs border rounded-md border-gray-50">
                  px
                </div>
              </form>
            </div>

            {/* ----- margin ----- */}
            <div className="">
              <h3 className="mb-2 text-gray-500">Margin</h3>
              <form
                className="grid items-end grid-cols-5 gap-2"
                onChange={(e) =>
                  void marginHandleSubmit(handleMarginFormSubmit)(e)
                }
              >
                <Controller
                  control={marginControl}
                  name="marginTop"
                  render={({ field }) => (
                    <>
                      <div>
                        <label
                          htmlFor="pt"
                          className="text-[11px] text-gray-500"
                        >
                          Top :
                        </label>
                        <input
                          placeholder="T"
                          type="text"
                          id="pt"
                          className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                            marginErrors.marginTop
                              ? "border border-red-500"
                              : ""
                          }`}
                          {...field}
                        />
                      </div>
                    </>
                  )}
                />
                <Controller
                  control={marginControl}
                  name="marginRight"
                  render={({ field }) => (
                    <>
                      <div>
                        <label
                          htmlFor="pt"
                          className="text-[11px] text-gray-500"
                        >
                          Right :
                        </label>
                        <input
                          placeholder="R"
                          type="text"
                          id="pt"
                          className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                            marginErrors.marginRight
                              ? "border border-red-500"
                              : ""
                          }`}
                          {...field}
                        />
                      </div>
                    </>
                  )}
                />
                <Controller
                  control={marginControl}
                  name="marginBottom"
                  render={({ field }) => (
                    <>
                      <div>
                        <label
                          htmlFor="pt"
                          className="text-[10px] text-gray-500"
                        >
                          Bottom :
                        </label>
                        <input
                          placeholder="B"
                          type="text"
                          id="pt"
                          className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                            marginErrors.marginBottom
                              ? "border border-red-500"
                              : ""
                          }`}
                          {...field}
                        />
                      </div>
                    </>
                  )}
                />
                <Controller
                  control={marginControl}
                  name="marginLeft"
                  render={({ field }) => (
                    <>
                      <div>
                        <label
                          htmlFor="pt"
                          className="text-[11px] text-gray-500"
                        >
                          Left :
                        </label>
                        <input
                          placeholder="L"
                          type="text"
                          id="pt"
                          className={`w-full text-xs h-10 rounded-md p-2 focus:outline-none ${
                            marginErrors.marginLeft
                              ? "border border-red-500"
                              : ""
                          }`}
                          {...field}
                        />
                      </div>
                    </>
                  )}
                />

                <div className="w-full h-10 p-2 text-xs border rounded-md border-gray-50">
                  px
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ----- delete section ----- */}
        <div>
          <button
            onClick={() =>
              deleteSelectedSection({ sectionId: selectedItem.id })
            }
            className="relative w-full py-2 mt-3 text-xs text-center text-white bg-red-500 rounded-lg cursor-pointer hover:bg-red-400 focus:outline-none"
          >
            Delete section
          </button>
        </div>
      </div>
    </>
  ) : null;
}
export default SelectedSectionItem;
