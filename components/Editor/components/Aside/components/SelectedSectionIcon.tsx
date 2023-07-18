import { useCallback } from "react";
import { AiFillCloseSquare, AiTwotoneEdit } from "react-icons/ai";
import useSectionStore from "../../../store/section.store";
import { LayoutState } from "../../../types/section.t";

interface SelectedSectionIconProps {
  id: string;
  layoutStyle: LayoutState;
  isSelected: boolean;
}

function SelectedSectionIcon({
  id,
  layoutStyle,
  isSelected,
}: SelectedSectionIconProps) {
  const [updateSelectedItem] = useSectionStore((state) => [
    state.updateSelectedItem,
  ]);

  const handleEdit = useCallback(() => {
    updateSelectedItem(
      isSelected
        ? null
        : {
            elementType: "section",
            id,
            layoutStyle,
          }
    );
  }, [id, layoutStyle, isSelected, updateSelectedItem]);

  return (
    <div
      className={` cursor-pointer w-5 h-5 -top-2 flex items-center justify-center text-xs font-medium rounded-lg toggle-full-view hover:text-blue-700 text-white hover:text-white bg-${
        isSelected ? "indigo" : "gray"
      }-700 hover:bg-${isSelected ? "indigo" : "gray"}-600`}
      onClick={handleEdit}
    >
      {isSelected ? <AiFillCloseSquare /> : <AiTwotoneEdit />}
    </div>
  );
}
export default SelectedSectionIcon;
