import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";

const fontSizes = [
  { name: "10px", value: "10px" },
  { name: "11px", value: "11px" },
  { name: "12px", value: "12px" },
  { name: "13px", value: "13px" },
  { name: "14px", value: "14px" },
  { name: "15px", value: "15px" },
  { name: "16px", value: "16px" },
  { name: "17px", value: "17px" },
  { name: "18px", value: "18px" },
  { name: "19px", value: "19px" },
  { name: "20px", value: "20px" },
  { name: "21px", value: "21px" },
  { name: "22px", value: "22px" },
  { name: "23px", value: "23px" },
  { name: "24px", value: "24px" },
  { name: "25px", value: "25px" },
  { name: "26px", value: "26px" },
  { name: "27px", value: "27px" },
  { name: "28px", value: "28px" },
  { name: "29px", value: "29px" },
  { name: "30px", value: "30px" },
  { name: "31px", value: "31px" },
  { name: "32px", value: "32px" },
  { name: "33px", value: "33px" },
  { name: "34px", value: "34px" },
  { name: "35px", value: "35px" },
];

const useContainer = () => {
  const [editor] = useLexicalComposerContext();
  const [selectedFontSize, setSelectedFontSize] = useState<{
    name: string;
    value: string;
  }>(fontSizes[6]);

  const handleChangeFontSize = useCallback(
    (value: { name: string; value: string }) => {
      setSelectedFontSize(value);
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            "font-size": value.value,
          });
        }
      });
    },
    [editor]
  );

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        //#region set default font size
        const oldFontSize = $getSelectionStyleValueForProperty(
          selection,
          "font-size",
          "16px"
        );
        setSelectedFontSize({
          name: `${oldFontSize}`,
          value: `${oldFontSize}`,
        });
        //#endregion set default font size
      });
    });
  }, [editor]);

  return {
    fontSizes,
    selectedFontSize,
    setSelectedFontSize,
    handleChangeFontSize,
  };
};

export default useContainer;
