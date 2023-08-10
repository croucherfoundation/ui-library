import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $isHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  DEPRECATED_$isGridSelection,
  LexicalNode,
} from "lexical";
import some from "lodash/some";
import { useCallback, useEffect, useState } from "react";

const headings = [
  { name: "normal", value: "normal" },
  { name: "h1", value: "h1" },
  { name: "h2", value: "h2" },
  { name: "h3", value: "h3" },
  { name: "h4", value: "h4" },
  { name: "h5", value: "h5" },
  { name: "h6", value: "h6" },
];

const useContainer = () => {
  const [editor] = useLexicalComposerContext();
  const [selectedHeading, setSelectedHeading] = useState<{
    name: string;
    value: string;
  }>(headings[0]);

  const handleChangeHeading = useCallback(
    (value: { name: string; value: string }) => {
      setSelectedHeading(value);
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () =>
            $createHeadingNode(value.value as HeadingTagType)
          );
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

        const anchorNode = selection.anchor.getNode() as LexicalNode;
        let element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : $findMatchingParent(anchorNode, (e: LexicalNode) => {
                const parent = e.getParent() as LexicalNode;
                return parent !== null && $isRootOrShadowRoot(parent);
              });
        if (element === null) {
          element = anchorNode.getTopLevelElementOrThrow() as LexicalNode;
        }

        const formattedHeadingType = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();

        // set formatted heading type
        if (
          some(headings, {
            name: `${formattedHeadingType}`,
            value: `${formattedHeadingType}`,
          })
        ) {
          setSelectedHeading({
            name: `${formattedHeadingType}`,
            value: `${formattedHeadingType}`,
          });
        }
        //#endregion set default font size
      });
    });
  }, [editor]);

  return {
    headings,
    selectedHeading,
    setSelectedHeading,
    handleChangeHeading,
  };
};

export default useContainer;
