import SelectedCroucherItem from "../../../../plugins/components/SelectedCroucherItem";
import useSectionStore from "../../../../store/section.store";
import {
  CONTAINER_BLOCK,
  IMAGE_BLOCK,
  SECTION_BLOCK,
} from "../../../../utils/dragComponentTypes";
import If from "../../../If";
import BreakPoints from "../BreakPoints/BreakPoints";
import SelectedContainerItem from "./SelectedContainerItem/SelectedContainerItem";
import SelectedElementItem from "./SelectedElementItem/SelectedElementItem";
import SelectedSectionItem from "./SelectedSectionItem/SelectedSectionItem";

function SelectedItem() {
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);

  return (
    <>
      <BreakPoints />
      <If isTrue={selectedItem?.elementType === SECTION_BLOCK}>
        <SelectedSectionItem />
      </If>
      <If isTrue={selectedItem?.elementType === CONTAINER_BLOCK}>
        <SelectedContainerItem />
      </If>
      <If isTrue={selectedItem?.elementType === IMAGE_BLOCK}>
        <SelectedElementItem />
      </If>

      <SelectedCroucherItem />
    </>
  );
}
export default SelectedItem;
