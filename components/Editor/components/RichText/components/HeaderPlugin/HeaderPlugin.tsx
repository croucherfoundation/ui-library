import { Listbox } from "@headlessui/react";
import { INSERT_UNORDERED_LIST_COMMAND, insertList } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import clsx from "clsx";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  DEPRECATED_$isGridSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { FiBold, FiItalic, FiList, FiUnderline } from "react-icons/fi";

const HeaderPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection?.hasFormat("bold"));
      setIsItalic(selection?.hasFormat("italic"));
      setIsUnderline(selection?.hasFormat("underline"));
    }
  }, []);

  useEffect(() => {
    editor.registerCommand(
      INSERT_UNORDERED_LIST_COMMAND,
      () => {
        insertList(editor, "bullet");
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  const headings = [
    { id: 1, name: "Normal", value: "normal" },
    { id: 1, name: "Heading 1", value: "h1" },
    { id: 2, name: "Heading 2", value: "h2" },
    { id: 3, name: "Heading 3", value: "h3" },
  ];
  const [selectedHeading, setSelectedHeading] = useState(headings[0]);

  const handleFormatHeadings = (headingType: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)
      ) {
        $setBlocksType(selection, () => $createHeadingNode(headingType));
      }
    });
  };
  const handleFormatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)
      ) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  return (
    <div className="top-0 left-0 z-10 w-full h-10 bg-white rounded shadow-md">
      <div className="flex items-center w-full h-full gap-3 px-2">
        {/* ----- drop down ----- */}
        <Listbox
          value={selectedHeading}
          onChange={(e) => {
            setSelectedHeading(e);
            if (e.value === "normal") {
              handleFormatParagraph();
            } else {
              handleFormatHeadings(e.value as HeadingTagType);
            }
          }}
        >
          <div className="relative">
            <Listbox.Button className="border px-5 rounded-md">
              {selectedHeading.name}
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 rounded-md bg-white text-base shadow-lg ring-1 focus:outline-none z-50 overflow-hidden">
              {headings.map((heading) => (
                <Listbox.Option
                  key={heading.id}
                  value={heading}
                  className="w-32 px-3 py-2 cursor-pointer"
                >
                  {heading.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
          >
            <FiBold className={clsx(isBold && "stroke-green-500")} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
          >
            <FiItalic className={clsx(isItalic && "stroke-green-500")} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
          >
            <FiUnderline className={clsx(isUnderline && "stroke-green-500")} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            }}
          >
            <FiList className={clsx(isUnderline && "stroke-green-500")} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderPlugin;
