import { FiSettings, FiXCircle } from "react-icons/fi";
import { type LayoutState, type SectionState } from "../../../../types/section.t";
import { EditorTooltip } from "../../../EditorTooltip/EditorTooltip";
import IfElse from "../../../IfElse";
import { useContainer } from "./useContainer";

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
  const { handleEdit } = useContainer({id, layoutStyle, isSelected, section});

  return (
    <div
      className={`cursor-pointer w-5 h-5 -top-2 flex items-center justify-center text-xs font-medium rounded-[5px] toggle-full-view bg-indigo-500 ml-auto relative top-3 mt-3`}
      onClick={handleEdit}
    >
      <EditorTooltip
        renderOpener={(props) => (
          <div {...props}>
            <IfElse
              isTrue={isSelected}
              ifBlock={<FiXCircle className="stroke-white w-3 h-3" />}
              elseBlock={<FiSettings className="stroke-white w-3 h-3" />}
            />
          </div>
        )}
      >
        <>
          <div className="text-xs"> {isSelected ? "Cancel selected section" : "Click to edit section"} </div>
        </>
      </EditorTooltip>
    </div>
  );
}
export default SelectedSectionIcon;
