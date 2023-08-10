import {
  FaBold,
  FaItalic,
  FaListOl,
  FaListUl,
  FaUnderline,
} from "react-icons/fa6";
import FontSizes from "./components/FontSizes/FontSizes";
import useContainer from "./useContainer";
import Headings from "./components/Headings/Headings";

const FloatingMenu = () => {
  const {
    floatingMenuRef,
    floatingMenuState,
    handleFormatEditor,
    floatingMenuCords,
    handleListFormat,
    listType,
  } = useContainer();

  return (
    <>
      <div
        ref={floatingMenuRef}
        aria-hidden={!floatingMenuCords}
        className="shadow-lg w-fit rounded-[5px] border py-2 bg-white z-30"
        style={{
          position: "absolute",
          top: floatingMenuCords?.y,
          left: floatingMenuCords?.x,
          visibility: floatingMenuCords ? "visible" : "hidden",
          opacity: floatingMenuCords ? 1 : 0,
        }}
      >
        <div className="flex items-center divide-x-2">
          {/* ----- Headings ----- */}
          <div className="px-3">
            <Headings />
          </div>

          {/* ----- font size ----- */}
          <div className="px-3">
            <FontSizes />
          </div>

          {/* ----- text transform ----- */}
          <div className="flex gap-3 px-3">
            <button
              onClick={() => {
                handleFormatEditor("bold");
              }}
              className={`w-10 h-6 rounded-[5px] ${
                floatingMenuState.isBold ? "bg-[#F3F3F0]" : ""
              }`}
            >
              <FaBold className="w-3 h-3 mx-auto" />
            </button>
            <button
              className={`w-10 h-6 rounded-[5px] ${
                floatingMenuState.isItalic ? "bg-[#F3F3F0]" : ""
              }`}
              onClick={() => {
                handleFormatEditor("italic");
              }}
            >
              <FaItalic className="w-3 h-3 mx-auto" />
            </button>
            <button
              className={`w-10 h-6 rounded-[5px] ${
                floatingMenuState.isUnderline ? "bg-[#F3F3F0]" : ""
              }`}
              onClick={() => {
                handleFormatEditor("underline");
              }}
            >
              <FaUnderline className="w-3 h-3 mx-auto" />
            </button>
          </div>

          {/* ----- list ----- */}
          <div className="flex gap-3 px-3">
            <button
              className={`w-10 h-6 rounded-[5px] ${
                listType === "bullet" ? "bg-[#F3F3F0]" : ""
              }`}
              onClick={() => handleListFormat("ul")}
            >
              <FaListUl className="w-3 h-3 mx-auto" />
            </button>
            <button
              className={`w-10 h-6 rounded-[5px] ${
                listType === "number" ? "bg-[#F3F3F0]" : ""
              }`}
              onClick={() => handleListFormat("ol")}
            >
              <FaListOl className="w-3 h-3 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingMenu;
