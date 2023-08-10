import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useCallback, useMemo } from "react";
import { sectionValueUpdater } from "../../helpers";
import { makeCroucherCarousels } from "../../plugins/createCroucherChild";
import useEditorConfigStore from "../../store/editorConfig.store";
import useSectionStore from "../../store/section.store";
import {
  CroucherImageCard,
  CroucherImageCardList,
} from "../../types/croucher.t";
import { ElementWithDynamicType } from "../../types/element.t";
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

  const onDeleteCard = (cardIndex: number) => {
    const enSection = getOnDeleteImageData(cardIndex, "en");
    const hkSection = getOnDeleteImageData(cardIndex, "hk");
    updateEnSection(enSection);
    updateHkSection(hkSection);
  };

  const getOnDeleteImageData = (cardIndex: number, lang: "en" | "hk") => {
    const clonedSections = cloneDeep(sections[lang]);
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

    currentEle.content.list.splice(cardIndex, 1);

    fill(currentContainer.children, currentEle, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);
    return clonedSections;
  };

  const handleContent = (
    title: string,
    cardId: string,
    key: "heading" | "content" = "heading"
  ) => {
    const clonedSections = cloneDeep(sections[lan]);
    const {
      currentSectionIdx,
      currentContainerIdx,
      currentElementIdx,
      currentSection,
      currentContainer,
      currentElement,
    } = sectionValueUpdater({
      sections: clonedSections,
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    // update new value
    const currentEle =
      currentElement as ElementWithDynamicType<CroucherImageCardList>;
    if (!currentEle) return;

    const index = currentEle.content.list.findIndex(
      (card) => card.id === cardId
    );

    if (index === -1) return;

    currentEle.content.list[index][key] = title;

    fill(currentContainer.children, currentEle, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    if (lan === "en") {
      updateEnSection(clonedSections);
    }

    if (lan === "hk") {
      updateHkSection(clonedSections);
    }
  };

  const getSectionNewCardWithLang = useCallback(
    (lang: "en" | "hk") => {
      const clonedSections = cloneDeep(sections[lang]);
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

      // update new value
      const currentEle = {
        ...currentContainer.children?.[0],
      } as ElementWithDynamicType<CroucherImageCardList>;

      currentEle.content.list.push(makeCroucherCarousels(1)[0]);
      fill(currentContainer.children, currentEle, currentElementIdx ?? 0, 1);
      fill(currentSection.children, currentContainer, currentContainerIdx, 1);
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      return clonedSections || [];
    },
    [containerId, elementId, sectionId, sections]
  );

  const addNewCard = useCallback(() => {
    const enNewCard = getSectionNewCardWithLang("en");
    updateEnSection(enNewCard);

    const hkNewCard = getSectionNewCardWithLang("hk");
    updateHkSection(hkNewCard);
  }, [getSectionNewCardWithLang, updateEnSection, updateHkSection]);

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
    const defaultStyle =
      "w-[250px] md:w-[275px] rounded-[5px] bg-edt-white min-h-[310px] mr-[32px]";
    if (isEditMode || previewMode) {
      return `${defaultStyle} border border-[#ccc]`;
    }
    return defaultStyle;
  }, [isEditMode, previewMode]);

  return {
    cardList,
    isEditMode,
    previewMode,
    carouselContainerStyle,
    handleOnSaveImage,
    handleContent,
    addNewCard,
    onDeleteCard,
    handleImageSettingSelected,
  };
};
export default useContainer;
