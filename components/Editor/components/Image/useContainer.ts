import { find } from "lodash";
import cloneDeep from "lodash/cloneDeep";
import fill from "lodash/fill";
import { useRef, useState, type ChangeEvent } from "react";
import { sectionValueUpdater } from "../../helpers";
import useEditorConfigStore from "../../store/editorConfig.store";
import useImageConfigStore from "../../store/imageConfig.store";
import useSectionStore from "../../store/section.store";
import { type Element } from "../../types/element.t";
import { ResponseImageData } from "../../types/imageConfig.t";
import {
  CROUCHER_3_3_6,
  CROUCHER_6_6,
  IMAGE_BLOCK,
} from "../../utils/dragComponentTypes";
import { getFetchingImageInfo } from "../../utils/fetchingImageHelper";

interface Props<T = Element> {
  element: T;
  containerId: string;
  sectionId: string;
  elementId: string;
}

const useContainer = ({
  element,
  containerId,
  sectionId,
  elementId,
}: Props) => {
  const [lan, isEditMode, previewMode, handleTabName] = useEditorConfigStore(
    (state) => [
      state.lan,
      state.isEditMode,
      state.config.previewMode,
      state.handleTabName,
    ]
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    element.content.image || null
  );

  const [isFetchMethod, updateImageLoading] = useImageConfigStore((state) => [
    state.isFetchMethod,
    state.updateImageLoading,
  ]);

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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cropImageUrl, setCropImageUrl] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [b4AspectRatio, setB4AspectRatio] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const imgInfo = new window.Image();
      imgInfo.onload = () => {
        setB4AspectRatio(imgInfo.width / imgInfo.height);
        setShowModal(true);
        setFileType(file.type);
        setCropImageUrl(imageUrl);
      };
      imgInfo.src = imageUrl;
      event.target.value = "";
    }
  };

  const handleOnSaveCrop = async (base64: string) => {
    const tempCurrentElement: Element = element;

    let imageData: string = base64;

    const saveImage = () => {
      const language = lan === "en" ? "en" : "hk";
      const clonedSections = cloneDeep(sections[language]);
      const { currentElementIdx } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: element.id,
      });

      if (currentElementIdx !== -1) {
        updateEnSection(getImageBlockDataWithLang("en", currentElementIdx));
        updateHkSection(getImageBlockDataWithLang("hk", currentElementIdx));
        setSelectedImage(imageData);
      }

      setShowModal(false);
    };

    const getImageBlockDataWithLang = (
      language: "en" | "hk",
      selectedIndex: number
    ) => {
      const clonedSections = cloneDeep(sections[language]);
      const {
        currentSectionIdx,
        currentContainerIdx,
        currentSection,
        currentContainer,
      } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: elementId,
      });

      if (currentContainer.children[selectedIndex]) {
        currentContainer.children[selectedIndex].content.image = imageData;
        // update new value
        fill(
          currentContainer.children,
          currentContainer.children[selectedIndex],
          selectedIndex ?? 0,
          1
        );
      }

      fill(currentSection.children, currentContainer, currentContainerIdx, 1);
      fill(clonedSections, currentSection, currentSectionIdx, 1);

      return clonedSections;
    };

    const getCroucherDataWithLang = (language: "en" | "hk") => {
      const clonedSections = cloneDeep(sections[language]);
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
      });

      const clonedTempCurrentElement = find(
        currentContainer.children,
        ({ elementType: type }) =>
          type === CROUCHER_6_6 || type === CROUCHER_3_3_6
      );

      // update new value
      if (clonedTempCurrentElement) {
        clonedTempCurrentElement.content.image = imageData;
        fill(
          currentContainer.children,
          clonedTempCurrentElement,
          currentElementIdx ?? 0,
          1
        );

        fill(currentSection.children, currentContainer, currentContainerIdx, 1);
        fill(clonedSections, currentSection, currentSectionIdx, 1);
      }

      return clonedSections;
    };

    const saveImageInNestedElement = () => {
      updateEnSection(getCroucherDataWithLang("en"));
      updateHkSection(getCroucherDataWithLang("hk"));
      setSelectedImage(imageData);
      setShowModal(false);
    };

    if (isFetchMethod) {
      updateImageLoading(true);
      const { isSuccess, requestOptions, imageApi } =
        getFetchingImageInfo(base64);
      if (!isSuccess) {
        console.log("Error");
        updateImageLoading(false);
        return;
      }

      try {
        const response = await fetch(`${imageApi}`, requestOptions);
        const body = (await response.json()) as ResponseImageData;
        imageData = body.data.attributes.files.orginal;
        setSelectedImage(imageData);
      } catch (e) {
        // Handling Image Fetching Errors
      } finally {
        updateImageLoading(false);
      }
    }
    if (tempCurrentElement.elementType !== IMAGE_BLOCK) {
      saveImageInNestedElement();
    } else {
      saveImage();
    }
  };

  const handleFetchingImage = async (base64: string) => {
    let imageData = "";
    updateImageLoading(true);
    const { isSuccess, requestOptions, imageApi } =
      getFetchingImageInfo(base64);
    if (!isSuccess) {
      return "";
    }

    try {
      const response = await fetch(`${imageApi}`, requestOptions);
      const body = (await response.json()) as ResponseImageData;
      imageData = body.data.attributes.files.orginal;
      return imageData;
    } catch (e) {
      // Handling Image Fetching Errors
      return "";
    } finally {
      updateImageLoading(false);
    }
  };

  const handleImageSettingSelected = () => {
    const isAlreadySelected = elementId === selectedElement?.id;

    if (lan === "en") {
      if (isAlreadySelected) {
        updateSelectedItem(null);
        updateSelectedElement(null);
        handleTabName("editor");
        return;
      }

      const clonedSections = cloneDeep(sections["en"]);
      const { currentElement } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: elementId,
      });

      updateSelectedItem({
        id: containerId,
        elementType: IMAGE_BLOCK,
        sectionId: sectionId,
        containerId: containerId,
      });
      updateSelectedElement(currentElement);
      handleTabName("setting");
    } else if (lan === "hk") {
      if (isAlreadySelected) {
        updateSelectedItem(null);
        updateSelectedElement(null);
        handleTabName("editor");
        return;
      }

      const clonedSections = cloneDeep(sections["hk"]);
      const { currentElement } = sectionValueUpdater({
        sections: clonedSections,
        sectionId: sectionId,
        containerId: containerId,
        elementId: elementId,
      });

      updateSelectedItem({
        id: containerId,
        elementType: IMAGE_BLOCK,
        sectionId: sectionId,
        containerId: containerId,
      });
      updateSelectedElement(currentElement);
      handleTabName("setting");
    }
  };

  return {
    isEditMode,
    previewMode,
    showModal,
    cropImageUrl,
    setShowModal,
    setSelectedImage,
    b4AspectRatio,
    selectedImage,
    inputRef,
    handleImageSelect,
    handleOnSaveCrop,
    fileType,
    handleImageSettingSelected,
    isFetchMethod,
    handleFetchingImage,
  };
};

export default useContainer;
