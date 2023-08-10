import { computePosition, flip, offset, shift } from "@floating-ui/react";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  DEPRECATED_$isGridSelection,
  FORMAT_TEXT_COMMAND,
  LexicalNode,
  type TextFormatType,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import usePointerInteractions from "./hooks/usePointerInteractions";

interface FloatingMenuState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

interface FloatingMenuCords {
  x: number;
  y: number;
}

const useContainer = () => {
  const { isPointerDown } = usePointerInteractions();
  const floatingMenuRef = useRef<HTMLDivElement>(null);
  const [editor] = useLexicalComposerContext();
  const [floatingMenuState, setFloatingMenuState] = useState<FloatingMenuState>(
    {
      isBold: false,
      isItalic: false,
      isUnderline: false,
    }
  );
  const [listType, setListType] = useState<string | null>(null);
  const [floatingMenuCords, setFloatingMenuCords] = useState<
    FloatingMenuCords | undefined
  >(undefined);

  //#region handle methods
  const handleFormatEditor = (command: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  };

  const handleListFormat = useCallback(
    (type: string) => {
      if (type === "ul") {
        if (listType === "bullet") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          editor.update(() => {
            const selection = $getSelection();
            if (
              $isRangeSelection(selection) ||
              DEPRECATED_$isGridSelection(selection)
            ) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          });
          setListType(null);
        } else {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
      } else if (type === "ol") {
        if (listType === "number") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          editor.update(() => {
            const selection = $getSelection();
            if (
              $isRangeSelection(selection) ||
              DEPRECATED_$isGridSelection(selection)
            ) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          });
          setListType(null);
        } else {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      }
    },
    [editor, listType]
  );

  const handleCalculateCords = useCallback(() => {
    const domSelection = getSelection();
    const domRange =
      domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0);

    if (!domRange || !floatingMenuRef.current || isPointerDown)
      return setFloatingMenuCords(undefined);

    computePosition(domRange, floatingMenuRef.current, {
      middleware: [flip(), shift(), offset(10)],
    })
      .then(({ x, y }) => {
        setFloatingMenuCords({ x, y });
      })
      .catch(() => {
        setFloatingMenuCords(undefined);
      });
  }, [isPointerDown]);

  const handleSelectionChange = useCallback(() => {
    if (
      editor.isComposing() ||
      editor.getRootElement() !== document.activeElement
    ) {
      setFloatingMenuCords(undefined);
      return;
    }

    const selection = $getSelection();

    if ($isRangeSelection(selection) && !selection.anchor.is(selection.focus)) {
      handleCalculateCords();
    } else {
      setFloatingMenuCords(undefined);
    }
  }, [editor, handleCalculateCords]);

  const handleUpdateToolbar = useCallback(() => {
    const selection = $getSelection();
    handleSelectionChange();
    if ($isRangeSelection(selection)) {
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
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(
          anchorNode,
          ListNode
        );
        const type = parentList
          ? parentList.getListType()
          : element.getListType();
        setListType(type);
      } else {
        //
      }
      setFloatingMenuState({
        isBold: selection.hasFormat("bold"),
        isItalic: selection.hasFormat("italic"),
        isUnderline: selection.hasFormat("underline"),
      });
    }
  }, [handleSelectionChange]);
  //#endregion handle methods

  // ---- watch all changes in editor
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        handleUpdateToolbar();
      });
    });
  }, [
    editor,
    handleSelectionChange,
    handleCalculateCords,
    handleUpdateToolbar,
  ]);

  return {
    floatingMenuRef,
    floatingMenuState,
    handleFormatEditor,
    floatingMenuCords,
    handleListFormat,
    listType,
  };
};

export default useContainer;
