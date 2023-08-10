export interface ImageConfigStates {
  isFetchMethod: boolean;
  isImageLoading: boolean;
  // fetchMethod: ((base64: string) => Promise<string | null>);
}

export interface ImageConfigActions {
  updateImageLoading: (loadingState: boolean) => void;
}

export interface ResponseImageData {
  data: {
    id: string;
    type: "image";
    attributes: {
      id: number;
      name: string;
      caption: string;
      record_type: "page";
      record_id: null;
      files: {
        orginal: string;
      };
      file_type: string;
      metadata: {
        identified: boolean;
      };
      thumbnail: boolean;
    };
  };
}
