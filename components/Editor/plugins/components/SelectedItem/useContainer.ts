import { cloneDeep, fill, find } from "lodash";
import { useEffect, useState } from "react";
import useSectionStore from "../../../store/section.store";
import { sectionValueUpdater } from "../../../helpers";
import {
  ElementWithDynamicType,
  imageObjectFitType,
} from "../../../types/element.t";
import { CroucherImageCardList } from "../../../types/croucher.t";

export interface TObjectFit {
  name: string;
  value: "unset" | "contain" | "cover" | "fill";
}

const objectFit: TObjectFit[] = [
  { name: "Unset", value: "unset" },
  { name: "Contain", value: "contain" },
  { name: "Cover", value: "cover" },
  { name: "Fill", value: "fill" },
];

const useContainer = () => {
  const [
    selectedElement,
    sections,
    selectedItem,
    updateSelectedItem,
    updateEnSection,
    updateHkSection,
  ] = useSectionStore((state) => [
    state.selectedElement,
    state.section,
    state.selectedItem,
    state.updateSelectedItem,
    state.updateEnSection,
    state.updateHkSection,
  ]);
  const [selectedProperty, setSelectedProperty] = useState<TObjectFit>(
    objectFit[0]
  );

  const handleSelected = (obj: TObjectFit) => {
    setSelectedProperty(obj);
    if (!selectedItem) {
      return;
    }

    const enElement = findElementEn();
    const hkElement = findElementHk();

    let index = -1;

    if (enElement) {
      const getIndex = enElement.content.list.findIndex(
        (item) => item.id === selectedItem.id
      );
      index = getIndex;
    }

    if (hkElement) {
      const getIndex = hkElement.content.list.findIndex(
        (item) => item.id === selectedItem.id
      );
      index = getIndex;
    }

    if (index !== -1) {
      updateEnSection(getOnSaveImageData(obj.value, index, "en"));
      updateHkSection(getOnSaveImageData(obj.value, index, "en"));
      updateSelectedItem({
        ...selectedItem,
        style: { objectFit: obj.value },
      });
    }
  };

  const getOnSaveImageData = (
    value: imageObjectFitType,
    cardIndex: number,
    lan: "en" | "hk"
  ) => {
    const clonedSections = cloneDeep(sections[lan]);
    const {
      currentSectionIdx,
      currentContainerIdx,
      currentElementIdx,
      currentSection,
      currentContainer,
    } = sectionValueUpdater({
      sections: clonedSections,
      sectionId:
        selectedItem && selectedItem.sectionId ? selectedItem.sectionId : "",
      containerId:
        selectedItem && selectedItem.containerId
          ? selectedItem.containerId
          : "",
      elementId: selectedElement?.id,
    });

    const currentEle = {
      ...currentContainer.children?.[0],
    } as ElementWithDynamicType<CroucherImageCardList>;

    currentEle.content.list[cardIndex].style.objectFit = value;

    fill(currentContainer.children, currentEle, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    return clonedSections;
  };

  const findElementEn = () => {
    const clonedSections = cloneDeep(sections["en"]);
    const { currentElement } = sectionValueUpdater({
      sections: clonedSections,
      sectionId:
        selectedItem && selectedItem.sectionId ? selectedItem.sectionId : "",
      containerId:
        selectedItem && selectedItem.containerId
          ? selectedItem.containerId
          : "",
      elementId: selectedElement?.id,
    });

    return currentElement as ElementWithDynamicType<CroucherImageCardList>;
  };

  const findElementHk = () => {
    const clonedSections = cloneDeep(sections["hk"]);
    const { currentElement } = sectionValueUpdater({
      sections: clonedSections,
      sectionId:
        selectedItem && selectedItem.sectionId ? selectedItem.sectionId : "",
      containerId:
        selectedItem && selectedItem.containerId
          ? selectedItem.containerId
          : "",
      elementId: selectedElement?.id,
    });

    return currentElement as ElementWithDynamicType<CroucherImageCardList>;
  };

  // set old value
  useEffect(() => {
    // console.log(selectedItem);
    if (selectedItem?.style?.objectFit) {
      const oldObjectFit = find(
        objectFit,
        (property) => property.value === selectedItem?.style?.objectFit
      );
      setSelectedProperty(oldObjectFit as TObjectFit);
    }
  }, [selectedItem]);

  return {
    objectFit,
    selectedProperty,
    handleSelected,
  };
};

export default useContainer;
