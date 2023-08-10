import { TbPhotoEdit } from "react-icons/tb";
import { Element, imageObjectFitType } from "../../types/element.t";
import IfElse from "../IfElse";
import ImageCropper from "../ImageCroper/ImageCropper";
import useContainer from "./useContainer";
import If from "../If";
import { useCallback } from "react";

interface ImageProps<T = Element> {
  element: T;
  containerId: string;
  sectionId: string;
  elementId: string;
  className?: string;
  initialSelectedImage?: string;
  objectFit?: imageObjectFitType;
  onHandleImage?: (img: string) => void;
  onSelectedItem?: (element: T) => void;
}
const Image = ({
  element,
  containerId,
  sectionId,
  elementId,
  className = "",
  initialSelectedImage = undefined,
  objectFit,
  onHandleImage,
  onSelectedItem,
}: ImageProps) => {
  const {
    isEditMode,
    previewMode,
    showModal,
    cropImageUrl,
    setShowModal,
    b4AspectRatio,
    selectedImage,
    inputRef,
    handleImageSelect,
    handleOnSaveCrop,
    fileType,
    handleImageSettingSelected,
    isFetchMethod,
    handleFetchingImage,
  } = useContainer({ element, containerId, sectionId, elementId });

  const isInitialImage = initialSelectedImage !== "" && !!initialSelectedImage;

  const onHandleAfterImageCropping = useCallback(
    (base64image: string) => {
      // Handling Image From Parent
      if (onHandleImage) {
        void (async () => {
          const image = isFetchMethod
            ? await handleFetchingImage(base64image)
            : base64image;
          onHandleImage(image);
          setShowModal(false);
        })();
        return;
      }

      void handleOnSaveCrop(base64image);
    },
    [
      handleFetchingImage,
      handleOnSaveCrop,
      isFetchMethod,
      onHandleImage,
      setShowModal,
    ]
  );

  return (
    <>
      <ImageCropper
        showModal={showModal}
        image={cropImageUrl}
        onCancelCrop={() => setShowModal(false)}
        defaultAspectRatio={b4AspectRatio}
        fileType={fileType}
        onSaveCrop={onHandleAfterImageCropping}
      />
      <div className="relative w-full h-full">
        <If isTrue={isEditMode}>
          <If isTrue={!previewMode}>
            <button
              onClick={() => {
                if (onSelectedItem) {
                  onSelectedItem(element);
                  return;
                }
                handleImageSettingSelected();
              }}
              className="absolute top-[24px] right-0 z-40 p-1 bg-blue-500 rounded-[5px]"
            >
              <TbPhotoEdit className="w-3 h-3 stroke-white" />
            </button>
          </If>
        </If>

        <IfElse
          isTrue={isInitialImage}
          ifBlock={
            <img
              src={initialSelectedImage}
              alt="Selected"
              className={`w-full h-full ${className}`}
              style={{
                objectFit: `${
                  objectFit ? objectFit : element?.style?.objectFit || "cover"
                }`,
              }}
              onClick={() => {
                if (previewMode || isEditMode) {
                  inputRef.current?.click();
                }
              }}
            />
          }
          elseBlock={
            selectedImage && (
              <>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className={`w-full h-full ${className}`}
                  style={{
                    objectFit: `${
                      objectFit
                        ? objectFit
                        : element?.style?.objectFit || "cover"
                    }`,
                  }}
                  onClick={() => {
                    if (previewMode || isEditMode) {
                      inputRef.current?.click();
                    }
                  }}
                />
              </>
            )
          }
        />

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
