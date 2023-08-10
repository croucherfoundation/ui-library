import { cloneDeep, fill, find } from "lodash";
import { useEffect, useState } from "react";
import { sectionValueUpdater } from "../../../../../helpers";
import useSectionStore from "../../../../../store/section.store";

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
  const [selectedElement, sections, selectedItem, updateEnSection] =
    useSectionStore((state) => [
      state.selectedElement,
      state.section,
      state.selectedItem,
      state.updateEnSection,
      state.updateHkSection,
    ]);
  const [selectedProperty, setSelectedProperty] = useState<TObjectFit>(
    objectFit[0]
  );

  const handleSelected = (obj: TObjectFit) => {
    setSelectedProperty(obj);
    const clonedSections = cloneDeep(sections["en"]);

    if (!selectedItem) {
      return;
    }
    const {
      currentSectionIdx,
      currentContainerIdx,
      currentSection,
      currentElementIdx,
      currentContainer,
      currentElement,
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
    if (currentElement) {
      currentElement.style.objectFit = obj.value;
    }

    fill(currentContainer.children, currentElement, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    updateEnSection(clonedSections);
  };

  // set old value
  useEffect(() => {
    const oldObjectFit = find(
      objectFit,
      (property) => property.value === selectedElement?.style.objectFit
    );
    setSelectedProperty(oldObjectFit as TObjectFit);
  }, [selectedElement?.style.objectFit]);

  return {
    objectFit,
    selectedProperty,
    handleSelected,
  };
};

export default useContainer;
