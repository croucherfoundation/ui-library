import useSectionStore from "../../../../../store/section.store";
import useContainer from "./useContainer";
// import { Controller } from "react-hook-form";

function SelectedContainerItem() {
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);

  const {
    bgColors,
    handleOnChangeSectionBackgroundColor,
    // paddingControl,
    // paddingHandleSubmit,
    // handlePaddingFormSubmit,
    // paddingErrors,
  } = useContainer();
  
  return selectedItem ? (
    <>
      <div className="p-4 grid grid-cols-1 gap-3 border-t border-gray-300">
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
                  // console.log("Hello")
                  handleOnChangeSectionBackgroundColor(bgColor.value)
                }
                className="w-10 h-10 rounded-md shadow-md border border-blue-50"
              ></button>
            ))}
          </div>
        </div>
      </div>
    </>
  ) : null;
}
export default SelectedContainerItem;
