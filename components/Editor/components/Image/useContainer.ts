import { cloneDeep, fill } from "lodash";
import { useRef, useState, type ChangeEvent } from "react";
import { sectionValueUpdater } from "../../helpers";
import useSectionStore from "../../store/section.store";
import { type Element } from "../../types/element.t";
interface Props {
  element: Element;
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
  const [selectedImage, setSelectedImage] = useState<string | null>(
    element.content.image || null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cropImageUrl, setCropImageUrl] = useState<string>("");
  const [b4AspectRatio, setB4AspectRatio] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sections, updateSection] = useSectionStore((state) => [
    state.section,
    state.updateSection,
  ]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const imgInfo = new window.Image();
      imgInfo.onload = () => {
        setB4AspectRatio(imgInfo.width / imgInfo.height);
        setShowModal(true);
        setCropImageUrl(imageUrl);
      };
      imgInfo.src = imageUrl;
      event.target.value = "";
    }
  };

  const handleOnSaveCrop = (img: string) => {
    setSelectedImage(img);
    const clonedSections = cloneDeep(sections);
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
    if (currentElement !== null) currentElement.content.image = img;

    fill(currentContainer.children, currentElement, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    updateSection(clonedSections);
    setShowModal(false);
  };

  return {
    showModal,
    cropImageUrl,
    setShowModal,
    setSelectedImage,
    b4AspectRatio,
    selectedImage,
    inputRef,
    handleImageSelect,
    handleOnSaveCrop,
  };
};

export default useContainer;
