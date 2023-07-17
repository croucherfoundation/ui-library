import React, { useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { BiCrop } from "react-icons/bi";

import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";
import {
  OneIsOne,
  SixteenNine,
  NineSixteen,
  Redo,
} from "./components/CropIcons/CropIcons";
import useCropper from "./useCropper";

interface ImageCropperProps {
  image: string;
  title?: string;
  showModal: boolean;
  defaultAspectRatio?: number;
  onSaveCrop: (str: string) => void;
  onCancelCrop: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  showModal,
  defaultAspectRatio,
  image,
  onSaveCrop,
  onCancelCrop,
}) => {
  const { getCroppedImg } = useCropper();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const saveCropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onSaveCrop(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, getCroppedImg, image, onSaveCrop]);

  const handleZoom = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  }, []);

  const handlePerspective = useCallback((value: number) => {
    return setAspectRatio(value);
  }, []);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelCrop?.();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [onCancelCrop]);

  const cropperParentDom = document.getElementById("image-cropper-portal");

  useEffect(() => {
    if (defaultAspectRatio) {
      setAspectRatio(defaultAspectRatio);
    }
  }, [defaultAspectRatio]);

  const iconClasses = useMemo<string>(() => {
    return "flex items-center justify-center w-9 h-9 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";
  }, [])

  return (
    <>
      {showModal && cropperParentDom
        ? createPortal(
            <>
              <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                <div className="relative w-auto my-6 mx-auto max-w-3xl ">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-hidden">
                    <div className="relative p-6 w-96 h-96">
                      <Cropper
                        image={image}
                        crop={crop}
                        onCropChange={setCrop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropComplete={onCropComplete}
                      />
                    </div>

                    <div className="items-center flex justify-center  col-span-1 space-x-2  mt-2">
                      <button
                        onClick={() => handlePerspective(1)}
                        data-tooltip-target="range-sizes-example-full-screen-tooltip"
                        className={iconClasses}
                      >
                        <OneIsOne />
                      </button>
                      <button
                        onClick={() => handlePerspective(16 / 9)}
                        data-tooltip-target="range-sizes-example-full-screen-tooltip"
                        className={iconClasses}
                      >
                        <SixteenNine />
                      </button>
                      <button
                        onClick={() => handlePerspective(9 / 16)}
                        data-tooltip-target="range-sizes-example-full-screen-tooltip"
                        className={iconClasses}
                      >
                        <NineSixteen />
                      </button>

                      {defaultAspectRatio && (
                        <button
                          onClick={() => handlePerspective(defaultAspectRatio)}
                          data-tooltip-target="range-sizes-example-full-screen-tooltip"
                          className={iconClasses}
                        >
                          <Redo />
                        </button>
                      )}
                    </div>

                    <div className="flex w-64 m-auto items-center h-12 justify-center">
                      <div className="py-1 relative min-w-full">
                        <input
                          type="range"
                          min={1}
                          max={3}
                          step={0.05}
                          value={zoom}
                          className="w-full h-3 mb-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          onChange={handleZoom}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end px-6 py-2 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="flex items-center bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          void onCancelCrop();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex items-center bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          void saveCropImage();
                        }}
                      >
                        <BiCrop className="w-6 h-6 mr-2 " />
                        Save Crop
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-20 fixed inset-0 z-40 bg-black"></div>
            </>,
            cropperParentDom
          )
        : null}
    </>
  );
};

export default ImageCropper;
