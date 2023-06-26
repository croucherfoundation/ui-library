import {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
} from "react";
import * as htmlToImage from "html-to-image";
import clsx from "clsx";

interface CropBoxProps {
  open: boolean;
  image: string;
  afterCrop: (value: string) => void;
  handleClose: () => void;
}

const CropBox: React.FC<CropBoxProps> = ({ open, image, afterCrop, handleClose }) => {
  const cropBoxRef = useRef<HTMLDivElement>(null);
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const resultRef = useRef<HTMLImageElement>(null);
  const handleScale: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    const cropBox = target.closest(".cropbox");
    const image = cropBox?.querySelector("img") as any;
    image.style.scale = `${1 + +target.value / 100}`;
    console.log({ value: e.target.value });
  };

  const handleCrop: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("working");
    if (cropAreaRef.current) {
      htmlToImage
        .toPng(cropAreaRef.current)
        .then(function (dataUrl: any) {
          console.log({ dataUrl });
          afterCrop(dataUrl);
        })
        .catch(function (error: any) {
          console.error("oops, something went wrong!", error);
        });
    }
  };

  useEffect(() => {
    let mousePosition: any = { x: 0, y: 0 };
    let offset = [0, 0];
    let isDown = false;
    const cropArea = cropAreaRef.current;
    const cropImage = cropImageRef.current;
    const startDragging = (e: any) => {
      isDown = true;
      console.log("hello");
      if (cropImage)
        offset = [
          cropImage.offsetLeft - e.clientX,
          cropImage.offsetTop - e.clientY,
        ];

      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("mousemove", dragImage);
      document.addEventListener("mouseup", stopDragging);
      document.addEventListener("mousemove", dragImage);
    };

    const stopDragging = () => {
      isDown = false;
      document.removeEventListener("mousemove", dragImage);
      document.removeEventListener("mouseup", stopDragging);
    };

    const dragImage = (event: any) => {
      event.preventDefault();
      if (isDown) {
        mousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        if (cropImage) {
          cropImage.style.left = mousePosition.x + offset[0] + "px";
          cropImage.style.top = mousePosition.y + offset[1] + "px";
        }
      }
    };

    cropArea?.addEventListener("mousedown", startDragging);

    return () => {
      cropArea?.removeEventListener("mousedown", startDragging);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("mousemove", dragImage);
    };
  }, []);

  return (
    <div
      className={clsx(
        "w-screen h-screen fixed top-0 left-0 bg-black/10 z-50",
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={clsx(
          "bg-[#F3F3F0] mx-auto rounded-lg shadow w-full md:w-[30%] p-5 transition-all duration-100 ease-in",
          open ? "mt-[3.5rem]" : "mt-[-100vh]"
        )}
      >
        <div ref={cropBoxRef} className="cropbox flex w-full flex-col gap-5">
          <div
            ref={cropAreaRef}
            className="relative w-[100%] bg-[#deded7] aspect-square overflow-hidden cursor-grab"
          >
            {
              //eslint-disable-next-line
              <img
                ref={cropImageRef}
                src={image}
                className="w-full transition-all ease-in-out duration-100 absolute"
                alt="crop image"
              />
            }
          </div>
          <input
            type="range"
            className="w-full cursor-grab"
            id="vol"
            name="vol"
            min="-100"
            max="100"
            onChange={handleScale}
            style={{
              accentColor: "#EE3A43",
            }}
          ></input>
          <div className="w-full flex justify-end gap-2">
            <button
              type="button"
              className="bg-csw-public-red rounded px-5 py-1 text-white font-bold"
              onClick={handleCrop}
            >
              Crop
            </button>
            <button
              type="button"
              className="bg-gray-500 rounded px-3 py-1 text-white font-bold"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropBox;
