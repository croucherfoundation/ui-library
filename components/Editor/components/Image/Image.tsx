import { Element } from "../../types/element.t";
import ImageCropper from "../ImageCroper/ImageCropper";
import useContainer from "./useContainer";

interface ImageProps {
  element: Element;
  containerId: string;
  sectionId: string;
  elementId: string;
}
const Image = ({ element, containerId, sectionId, elementId }: ImageProps) => {
  const {
    showModal,
    cropImageUrl,
    setShowModal,
    b4AspectRatio,
    selectedImage,
    inputRef,
    handleImageSelect,
    handleOnSaveCrop,
  } = useContainer({ element, containerId, sectionId, elementId });

  return (
    <>
      <ImageCropper
        showModal={showModal}
        image={cropImageUrl}
        onCancelCrop={() => setShowModal(false)}
        defaultAspectRatio={b4AspectRatio}
        onSaveCrop={(img) => {
          handleOnSaveCrop(img);
        }}
      />
      <div className="w-full h-auto">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => inputRef.current?.click()}
          />
        )}

        <input
          className="hidden"
          type="file"
          onChange={handleImageSelect}
          ref={inputRef}
        />
      </div>
    </>
  );
};

export default Image;
