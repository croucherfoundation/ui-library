import { useEffect, useState } from "react";

const usePointerInteractions = () => {
  const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
  const [isPointerReleased, setIsPointerReleased] = useState<boolean>(true);

  useEffect(() => {
    const handlePointerUp = () => {
      setIsPointerDown(false);
      setIsPointerReleased(true);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    const handlePointerDown = () => {
      setIsPointerDown(true);
      setIsPointerReleased(false);
      document.addEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return { isPointerDown, isPointerReleased };
};

export default usePointerInteractions;
