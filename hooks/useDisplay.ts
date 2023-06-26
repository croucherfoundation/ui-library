import { useEffect, useState } from "react";

interface useDisplayProps {
    
}
 
const useDisplay = () => {
    const [contentMargin, setContentMargin] = useState<number>(0);
    const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 1218) {
      setContentMargin((windowWidth - 1218) / 2);
    }
    setWindowWidth(windowWidth)
  }, []);
  return {
    contentMargin,
    windowWidth
  }
}
 
export default useDisplay;