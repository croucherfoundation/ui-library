import { Controller } from "react-hook-form";
import useSectionStore from "../../../../../store/section.store";
import useContainer from "./useContainer";
// import { Controller } from "react-hook-form";

function SelectedContainerItem() {
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);

  const {
    bgColors,
    handleOnChangeSectionBackgroundColor,
    removeChildElements,
    paddingErrors,
    paddingHandleSubmit,
    paddingControl,
    handlePaddingFormSubmit,
  } = useContainer();

  return selectedItem ? (
    <>
      <div className="p-4 grid grid-cols-1 gap-3 border-t border-gray-300">
        {/* ----- background ----- */}
        <div>
          <h3 className="mb-3 font-bold">Container background</h3>

          <div className="flex gap-3">
            {bgColors.map((bgColor) => (
              <button
                key={bgColor.id}
                style={{
                  backgroundColor: bgColor.value,
                }}
                onClick={() =>
                  // console.log("Hello")
                  handleOnChangeSectionBackgroundColor(bgColor.value)
                }
                className="w-10 h-10 rounded-md shadow-md border border-blue-50"
              ></button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-bold">Container padding</h3>

          <div className="">
            <h3 className="text-gray-500 mb-2">Padding</h3>
            <form
              className="grid grid-cols-5 gap-2 items-end"
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
                      <label htmlFor="pt" className="text-[11px] text-gray-500">
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
                      <label htmlFor="pt" className="text-[11px] text-gray-500">
                        Right :
                      </label>
                      <input
                        placeholder="R"
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
                name="paddingBottom"
                render={({ field }) => (
                  <>
                    <div>
                      <label htmlFor="pt" className="text-[10px] text-gray-500">
                        Bottom :
                      </label>
                      <input
                        placeholder="B"
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
                name="paddingLeft"
                render={({ field }) => (
                  <>
                    <div>
                      <label htmlFor="pt" className="text-[11px] text-gray-500">
                        Left :
                      </label>
                      <input
                        placeholder="L"
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

              <div className="w-full h-10 p-2 text-xs border border-gray-50 rounded-md">
                px
              </div>
            </form>
          </div>
        </div>

        {/* ----- delete ----- */}
        <div>
          <button
            onClick={() => removeChildElements()}
            className="mt-3 relative w-full cursor-pointer rounded-lg bg-edt-error hover:opacity-90 text-white py-2 text-center focus:outline-none text-xs"
          >
            Delete component
          </button>
        </div>
      </div>
    </>
  ) : null;
}
export default SelectedContainerItem;
