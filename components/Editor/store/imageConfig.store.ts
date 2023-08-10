import { create } from "zustand";
import { ImageConfigActions, ImageConfigStates } from "../types/imageConfig.t";
import { getIsFetchingImage } from "../utils/fetchingImageHelper";

const useImageConfigStore = create<ImageConfigStates & ImageConfigActions>()(
  (set) => {
    const isFetchMethod = getIsFetchingImage();

    return {
      isFetchMethod: isFetchMethod,
      isImageLoading: false,
      updateImageLoading: (loadingStaet: boolean) => {
        return set({ isImageLoading: loadingStaet });
      },
    };
  }
);

export default useImageConfigStore;
