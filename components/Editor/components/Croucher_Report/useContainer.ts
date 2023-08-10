import cloneDeep from "lodash/cloneDeep";
import { useMemo } from "react";
import fill from "lodash/fill";
import { sectionValueUpdater } from "../../helpers";
import useSectionStore from "../../store/section.store";
import {
  CroucherImageCard,
  CroucherImageCardList,
} from "../../types/croucher.t";
import { ElementWithDynamicType } from "../../types/element.t";
import useEditorConfigStore from "../../store/editorConfig.store";
import { CROUCHER_IMAGE_LIST_BLOCK } from "../../utils/dragComponentTypes";

interface UseContainerProps {
  element: ElementWithDynamicType<CroucherImageCardList>;
  elementId: string;
  containerId: string;
  sectionId: string;
}
const useContainer = ({
  element,
  elementId,
  sectionId,
  containerId,
}: UseContainerProps) => {
  const [lan, isEditMode, previewMode, handleTabName] = useEditorConfigStore(
    (state) => [
      state.lan,
      state.isEditMode,
      state.config.previewMode,
      state.handleTabName,
    ]
  );

  const [
    sections,
    updateEnSection,
    updateHkSection,
    updateSelectedItem,
    selectedElement,
    updateSelectedElement,
  ] = useSectionStore((state) => [
    state.section,
    state.updateEnSection,
    state.updateHkSection,
    state.updateSelectedItem,
    state.selectedElement,
    state.updateSelectedElement,
  ]);

  const handleOnSaveImage = (img: string, cardIndex: number) => {
    const enSection = getOnSaveImageData(img, cardIndex, "en");
    const hkSection = getOnSaveImageData(img, cardIndex, "hk");
    updateEnSection(enSection);
    updateHkSection(hkSection);
  };

  const getOnSaveImageData = (
    img: string,
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
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    const currentEle = {
      ...currentContainer.children?.[0],
    } as ElementWithDynamicType<CroucherImageCardList>;

    currentEle.content.list[cardIndex].image = img;

    fill(currentContainer.children, currentEle, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    return clonedSections;
  };

  const handleImageSettingSelected = (card: CroucherImageCard) => {
    const isAlreadySelected = elementId === selectedElement?.id;
    // console.log(ele);
    if (isAlreadySelected) {
      updateSelectedItem(null);
      updateSelectedElement(null);
      handleTabName("editor");
      return;
    }

    const clonedSections = cloneDeep(sections[lan]);
    const { currentElement } = sectionValueUpdater({
      sections: clonedSections,
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    updateSelectedItem({
      id: card.id,
      elementType: CROUCHER_IMAGE_LIST_BLOCK,
      sectionId: sectionId,
      containerId: containerId,
      style: { objectFit: card?.style?.objectFit || "cover" },
    });
    updateSelectedElement(currentElement);
    handleTabName("setting");
  };

  const cardList = useMemo(() => {
    return element.content.list;
  }, [element]);

  const carouselContainerStyle = useMemo(() => {
    const defaultStyle = "w-[175px] rounded-[5px] ";
    if (isEditMode || previewMode) {
      return `${defaultStyle}`;
    }
    return defaultStyle;
  }, [isEditMode, previewMode]);

  return {
    cardList,
    isEditMode,
    previewMode,
    carouselContainerStyle,
    handleOnSaveImage,
    handleImageSettingSelected,
  };
};
export default useContainer;
