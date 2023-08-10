import If from "../../components/If";
import useSectionStore from "../../store/section.store";
import { CROUCHER_IMAGE_LIST_BLOCK } from "../../utils/dragComponentTypes";
import SelectedCroucherImage from "./SelectedItem/SelectedCroucherImage";

function SelectedCroucherItem() {
  const [selectedItem] = useSectionStore((state) => [state.selectedItem]);

  return (
    <>
      <If isTrue={selectedItem?.elementType === CROUCHER_IMAGE_LIST_BLOCK}>
        <SelectedCroucherImage />
      </If>
    </>
  );
}
export default SelectedCroucherItem;
