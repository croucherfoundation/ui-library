import useSectionStore from "../../../../store/section.store";
import SelectedContainerItem from "./SelectedContainerItem/SelectedContainerItem";
import SelectedSectionItem from "./SelectedSectionItem/SelectedSectionItem";

function SelectedItem() {
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);

  if (selectedItem?.elementType === "section") {
    return <SelectedSectionItem />;
  }

  if (selectedItem?.elementType === "container") {
    return <SelectedContainerItem />;
  }

  return <></>;
}
export default SelectedItem;
