"use client";

import { ChangeEventHandler, ReactNode, useRef, useState } from "react";
import CropBox from "../components/CropBox";

import { useFormContext } from "react-hook-form";

interface UploadImageInputProps {
  id: string;
  name: string;
  label: string | ReactNode | ReactNode[];
  getImageURL: (value:{data: string, name: string}) => Promise<string>;
}

function resizeImage(img: CanvasImageSource, width: number, height: number) {
  // create an off-screen canvas
  var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

  // set its dimension to target size
  canvas.width = width;
  canvas.height = height;

  // draw source image into the off-screen canvas:
  ctx?.drawImage(img, 0, 0, width, height);
  // encode image to data-uri with base64 version of compressed image
  return canvas.toDataURL();
}

const UploadImageInput: React.FC<UploadImageInputProps> = ({ id, name, label, getImageURL }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [profileImageName, setProfileImageName] = useState<any>("");
  const [image, setImage] = useState<string>("");
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const {
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const removeImageFromInput = () => {
    const fileInput = fileUploadRef.current as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleImageInputChange: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    let files = e.target.files as any;
    if (files.length > 0 && files[0].size <= 4194304) {
      setProfileImageName(files ? files?.item(0)?.name?.toString() : "-");
      const reader = new FileReader();
      reader.onload = async () => {
        const data = reader.result as any;
        clearErrors(name);
        setImage(data);
        console.log("loaded image");
        setOpen(true);
        removeImageFromInput();
      };
      if (files && files.length > 0) {
        reader.readAsDataURL(files[0]);
      }
    } else {
      setError(name, {
        type: "custom",
        message: "Image size exceeded Maximum file size",
      });
    }
  };

  const handleClose = () => {
    removeImageFromInput();
    setOpen(false);
  };

  // heading
  // base

  const afterCrop = async (value: string) => {
    try {
      const img = new Image();
      img.src = value;
      img.onload = async function () {
        const resizeValue = resizeImage(img, 400, 400);
        if(getImageURL){
            const image_url = await getImageURL({data: resizeValue, name: profileImageName})
            setValue(name, image_url);
        }
        
        removeImageFromInput();
        setOpen(false);
      };
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="w-full">
        <label>
          {label}
        </label>{" "}
        <br />
        <div className="relative text-left">
          <label
            htmlFor="profile-image"
            className="rounded-full border-[1px] border-black flex justify-center pt-[10px] h-[40px] text-center text-[18px] leading-[21.6px] font-[600] hover:bg-csw-public-red hover:border-transparent hover:text-white w-full px-[2rem] cursor-pointer"
          >
            Upload photo
          </label>
          <input
            id="profile-image"
            style={{ visibility: "hidden" }}
            ref={fileUploadRef}
            type="file"
            accept="image/*"
            multiple={false}
            onChange={handleImageInputChange}
            className="absolute"
          />

          {/* <button className="rounded-full border-[1px] border-black sym-upload-photo hover:bg-sym-public-red hover:border-transparent hover:text-white">Upload photo</button> */}
        </div>
        {!errors[name] && profileImageName && (
          <div className="mt-[5px] pl-5 text-[14px] text-green-600">
            {profileImageName}
          </div>
        )}
        {errors[name] && (
          <div className="mt-[5px] pl-5 text-[14px] text-red-600">
            {errors[name]?.message?.toString()}
          </div>
        )}
      </div>
      <CropBox
        open={open}
        image={image}
        afterCrop={afterCrop}
        handleClose={handleClose}
      />
    </>
  );
};

export default UploadImageInput;
