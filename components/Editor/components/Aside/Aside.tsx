import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  FiAlignRight,
  FiChevronRight,
  FiEye,
  FiImage,
  FiChevronLeft,
} from "react-icons/fi";
import useEditorConfigStore from "../../store/editorConfig.store";
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
import Croucher_3_3_6_Icon from "../Icons/Croucher_3_3_6_Icon";
import If from "../If";
import CroucherFourFourFourTextIcon from "./components/CroucherIcons/CroucherFourFourFourTextIcon";
import CroucherSixSixIcon from "./components/CroucherIcons/CroucherSixSixIcon";
import Element from "./components/Element";
import SelectedItem from "./components/SelectedItem/SelectedItem";
import useContainer from "./useContainer";
import IfElse from "../IfElse";
import AsideTab from "./components/AsideTab/AsideTab";
import Croucher_Image_Carousel_Icon from "../Icons/Croucher_Image_Carousel_Icon";
import Croucher_Report_Icon from "../Icons/Croucher_Report_Icon";
import Croucher_Heading_Icon from "../Icons/Croucher_Heading_Icon";
import Croucher_Subscriber_Icon from "../Icons/Croucher_Subscriber_Icon";

interface Props {
  publishOrSave?: React.ReactNode;
}

const Aside = ({ publishOrSave }: Props) => {
  const { isEditMode, previewMode, isSettingTab, isEditorTab, lan, updateLan } =
    useContainer();
  const [marginLeft, setMarginLeft] = useState<number>(0);
  const handleCloseSideBar = () => {
    setMarginLeft((prev) => (prev === 0 ? 300 : 0));
  };
  const [editorConfig, updateEditorConfig] = useEditorConfigStore((state) => [
    state.config,
    state.updateEditorConfig,
  ]);

  const handlePreviewMode = () => {
    updateEditorConfig({
      ...editorConfig,
      previewMode: !editorConfig.previewMode,
    });
  };

  useEffect(() => {
    if (editorConfig.previewMode) {
      setMarginLeft(0);
    }
  }, [editorConfig.previewMode]);

  return (
    <>
      <If isTrue={isEditMode}>
        <If isTrue={!previewMode}>
          <div className="flex">
            <aside
              className={clsx(
                `w-[300px] h-screen bg-slate-200 sticky top-0 z-50 overflow-y-auto`,
                editorConfig.previewMode && "hidden"
              )}
              style={{
                marginLeft: `-${marginLeft}px`,
              }}
            >
              <AsideTab />

              <div className={`${isEditorTab ? "" : "hidden"}`}>
                <div>
                  {/* <h4 className="px-3 pt-3 font-bold">Editor components</h4> */}
                  <div className="grid grid-cols-2 gap-3 p-3">
                    <Element
                      data={{
                        type: IMAGE_BLOCK,
                      }}
                      title="Image"
                      icon={<FiImage className="mx-auto w-7 h-7" />}
                    />
                    <Element
                      title="Rich text"
                      icon={<FiAlignRight className="mx-auto w-7 h-7" />}
                      data={{
                        type: RICH_TEXT,
                      }}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-300 ">
                  <h4 className="px-3 pt-3 font-bold">Croucher designs</h4>

                  <div className="grid grid-cols-2 gap-3 p-3 ">
                    <Element
                      title=""
                      icon={<CroucherSixSixIcon />}
                      data={{
                        type: CROUCHER_6_6,
                      }}
                    />
                    <Element
                      title=""
                      icon={<CroucherFourFourFourTextIcon />}
                      data={{
                        type: CROUCHER_3_3_3_TEXT,
                      }}
                    />
                    <Element
                      title=""
                      icon={<Croucher_3_3_6_Icon />}
                      data={{
                        type: CROUCHER_3_3_6,
                      }}
                    />
                    <Element
                      title=""
                      icon={<Croucher_Image_Carousel_Icon />}
                      data={{
                        type: CROUCHER_IMG_CARD_CAROUSEL,
                      }}
                    />
                    <Element
                      title=""
                      icon={<Croucher_Report_Icon />}
                      data={{
                        type: CROUCHER_REPORT_CARD,
                      }}
                    />
                    <Element
                      title=""
                      icon={<Croucher_Heading_Icon />}
                      data={{
                        type: CROUCHER_HEADING_TEXT,
                      }}
                    />
                    <Element
                      title=""
                      icon={<Croucher_Subscriber_Icon />}
                      data={{
                        type: CROUCHER_SUBSCRIBE,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ----- selected item ----- */}
              <div className={`${isSettingTab ? "" : "hidden"}`}>
                <SelectedItem />
              </div>

              {/* ----- preview ----- */}
              <div className="p-4 border-t border-gray-300 grid grid-cols-1 gap-3">
                <button
                  className="relative flex flex-row items-center justify-center w-full px-3 py-2 bg-white rounded-lg cursor-pointer sm:text-sm"
                  onClick={handlePreviewMode}
                >
                  <FiEye />
                  <IfElse
                    isTrue={lan === "en"}
                    ifBlock={<span className="ml-2">Preview</span>}
                    elseBlock={<span className="ml-2">Preview</span>}
                  />
                </button>

                <IfElse
                  isTrue={lan === "en"}
                  ifBlock={
                    <button
                      className="relative flex flex-row items-center justify-center w-full px-3 py-2 bg-white rounded-lg cursor-pointer sm:text-sm"
                      onClick={() => updateLan("hk")}
                    >
                      <span className="ml-2">中文</span>
                    </button>
                  }
                  elseBlock={
                    <button
                      className="relative flex flex-row items-center justify-center w-full px-3 py-2 bg-white rounded-lg cursor-pointer sm:text-sm"
                      onClick={() => updateLan("en")}
                    >
                      <span className="ml-2">EN</span>
                    </button>
                  }
                />
              </div>

              <If isTrue={publishOrSave !== null}>
                <div className="sticky bottom-0 z-50 px-4 py-3 bg-slate-200">
                  {publishOrSave}
                </div>
              </If>
            </aside>

            {/* ----- hide/show button ----- */}
            <div className="sticky top-0 h-screen w-[30px] bg-gray-300">
              <div className="w-full h-full" onClick={handleCloseSideBar}>
                <div className="absolute w-full py-5 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-gray-50">
                  <IfElse
                    isTrue={marginLeft === 0}
                    ifBlock={<FiChevronLeft className="mx-auto w-7 h-7" />}
                    elseBlock={<FiChevronRight className="mx-auto w-7 h-7" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </If>
      </If>
    </>
  );
};

export default Aside;
