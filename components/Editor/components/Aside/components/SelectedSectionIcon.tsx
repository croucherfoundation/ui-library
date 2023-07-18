import { useCallback } from "react";
import { AiFillCloseSquare, AiTwotoneEdit } from "react-icons/ai";
import useSectionStore from "../../../store/section.store";
import { type LayoutState, type SectionState } from "../../../types/section.t";

interface SelectedSectionIconProps {
  id: string;
  layoutStyle: LayoutState;
  isSelected: boolean;
  section: SectionState;
}

function SelectedSectionIcon({
  id,
  layoutStyle,
  isSelected,
  section,
}: SelectedSectionIconProps) {
  const [updateSelectedItem, updateSelectedSection] = useSectionStore(
    (state) => [state.updateSelectedItem, state.updateSelectedSection]
  );

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
    updateSelectedSection(isSelected ? null : section);
  }, [
    id,
    layoutStyle,
    isSelected,
    updateSelectedItem,
    section,
    updateSelectedSection,
  ]);

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
