import clsx from "clsx";
import { useEffect, useState } from "react";
import { FiAlignRight, FiEye, FiImage, FiMenu } from "react-icons/fi";
import useEditorConfigStore from "../../store/editorConfig.store";
import {
  CROUCHER_6_6,
  IMAGE_BLOCK,
  RICH_TEXT,
} from "../../utils/dragComponentTypes";
import CroucherSixSixIcon from "./components/CroucherIcons/CroucherSixSixIcon";
import Element from "./components/Element";
import SelectedItem from "./components/SelectedItem/SelectedItem";

interface Props {
  publishOrSave?: React.ReactNode;
}

const Aside = ({ publishOrSave }: Props) => {
  const [marginLeft, setMarginLeft] = useState<number>(0);
  const handleCloseSideBar = () => {
    setMarginLeft((prev) => (prev === 0 ? 350 : 0));
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
    <aside
      className={clsx(
        `w-[350px] h-screen bg-slate-200 sticky top-0 z-50`,
        editorConfig.previewMode && "hidden"
      )}
      style={{
        marginLeft: `-${marginLeft}px`,
      }}
    >
      <button
        onClick={handleCloseSideBar}
        className="p-2 px-4 absolute translate-y-1/2 top-1/2 -right-[48px] bg-slate-200"
      >
        <FiMenu />
      </button>

      <div className="p-3 grid grid-cols-2 gap-3">
        <Element
          data={{ type: IMAGE_BLOCK }}
          title="Image"
          icon={<FiImage className="w-7 h-7 mx-auto" />}
        />
        <Element
          title="Rich text"
          icon={<FiAlignRight className="w-7 h-7 mx-auto" />}
          data={{ type: RICH_TEXT }}
        />
      </div>

      <div className="border-t border-gray-300 ">
        <h4 className="px-3 pt-3">Croucher designs</h4>

        <div className="p-3 grid grid-cols-2 gap-3 ">
          <Element
            title=""
            icon={<CroucherSixSixIcon />}
            data={{ type: CROUCHER_6_6 }}
          />
        </div>
      </div>

      <SelectedItem />

      {/* ----- preview ----- */}
      <div className="border-t border-gray-300 p-4">
        <button
          className="relative flex flex-row justify-center items-center w-full cursor-pointer rounded-lg bg-white py-2 px-3 sm:text-sm"
          onClick={handlePreviewMode}
        >
          <FiEye />
          <span className="ml-2">Preview</span>
        </button>
      </div>

      {publishOrSave}
    </aside>
  );
};

export default Aside;
