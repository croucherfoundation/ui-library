import { yupResolver } from "@hookform/resolvers/yup";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import findIndex from "lodash/findIndex";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import useSectionStore from "../../../../store/section.store";
import { SectionState } from "../../../../types/section.t";

const bgColors = [
  {
    id: "#F3F3F0",
    value: "#F3F3F0",
  },
  {
    id: "#FFFFFF",
    value: "#FFFFFF",
  },
  {
    id: "#ee3a43",
    value: "#ee3a43",
  },
];

interface PaddingFormValues {
  paddingTop: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingRight: number;
}

const PaddingSchema = yup.object().shape({
  paddingTop: yup.number().min(0).required(),
  paddingLeft: yup.number().min(0).required(),
  paddingBottom: yup.number().min(0).required(),
  paddingRight: yup.number().min(0).required(),
});

const useContainer = () => {
  const [
    sections,
    updateSection,
    selectedSection,
    updateSelectedSection,
    updateSelectedItem,
    breakpoint,
    setBreakpoint,
  ] = useSectionStore((state) => [
    state.section,
    state.updateSection,
    state.selectedSection,
    state.updateSelectedSection,
    state.updateSelectedItem,
    state.breakpoint,
    state.setBreakpoint,
  ]);
  const {
    register: paddingRegister,
    watch: paddingWatch,
    formState: { errors: paddingErrors },
    handleSubmit: paddingHandleSubmit,
    control: paddingControl,
    setValue: paddingSetValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(PaddingSchema),
    defaultValues: {
      paddingTop: 0,
      paddingLeft: 0,
      paddingBottom: 0,
      paddingRight: 0,
    },
  });

  const defaultBreakPointStyle =
    "flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-700 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 bg-gray-800 focus:outline-none text-gray-400 hover:text-white hover:bg-indigo-500 border hover:border-indigo-500";

  const updateSelectedItemBreakpoints = ({
    sectionId,
    breakpoint,
    breakpointValue,
  }: {
    sectionId: string;
    breakpoint: "lg" | "md" | "sm";
    breakpointValue: string;
  }) => {
    const clonedSections = cloneDeep(sections);
    const isFound = clonedSections.some((sec) => sec.id === sectionId);
    if (!isFound) return;

    const section = clonedSections.find((sec) => sec.id === sectionId);

    if (section) {
      section.layoutStyle[breakpoint] = breakpointValue;

      updateSelectedItem({
        elementType: "section",
        id: section.id,
        layoutStyle: section.layoutStyle,
      });

      const sectionIdx = findIndex(
        clonedSections,
        (section: SectionState) => section.id === sectionId
      );

      clonedSections[sectionIdx].layoutStyle[breakpoint] = breakpointValue;

      updateSection(clonedSections);
    }
  };

  const deleteSelectedSection = ({ sectionId }: { sectionId: string }) => {
    const section = filter(sections, (section) => section.id !== sectionId);

    updateSelectedItem(null);

    updateSection(section);
  };

  const handleOnChangeSectionBackgroundColor = (bgColor: string) => {
    const clonedSections = cloneDeep(sections);
    const clonedSelectedSection = cloneDeep(selectedSection);
    const currentSectionIdx = findIndex(
      clonedSections,
      (section) => section.id === selectedSection?.id
    );
    if (clonedSelectedSection) {
      clonedSelectedSection.style.background.normal.bgColor = bgColor;

      clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

      updateSelectedSection(clonedSelectedSection);
      updateSection(clonedSections);
    } else {
      return;
    }
  };

  const handlePaddingFormSubmit: SubmitHandler<PaddingFormValues> = (
    data: PaddingFormValues
  ) => {
    const clonedSections = cloneDeep(sections);
    const clonedSelectedSection = cloneDeep(selectedSection);
    const currentSectionIdx = findIndex(
      clonedSections,
      (section) => section.id === selectedSection?.id
    );

    if (clonedSelectedSection) {
      const bkPoint = clonedSelectedSection?.style?.padding[breakpoint];
      if (bkPoint) {
        clonedSelectedSection.style.padding[breakpoint].paddingTop =
          data.paddingTop;
        clonedSelectedSection.style.padding[breakpoint].paddingLeft =
          data.paddingLeft;
        clonedSelectedSection.style.padding[breakpoint].paddingBottom =
          data.paddingBottom;
        clonedSelectedSection.style.padding[breakpoint].paddingRight =
          data.paddingRight;
      }

      clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

      updateSelectedSection(clonedSelectedSection);
      updateSection(clonedSections);
    } else {
      return;
    }
  };

  // set selected [section-padding] to [form-fields]
  useEffect(() => {
    paddingSetValue(
      "paddingTop",
      selectedSection?.style.padding[breakpoint].paddingTop as number
    );
    paddingSetValue(
      "paddingLeft",
      selectedSection?.style.padding[breakpoint].paddingLeft as number
    );
    paddingSetValue(
      "paddingBottom",
      selectedSection?.style.padding[breakpoint].paddingBottom as number
    );
    paddingSetValue(
      "paddingRight",
      selectedSection?.style.padding[breakpoint].paddingRight as number
    );
  }, [selectedSection, paddingSetValue, breakpoint]);

  return {
    bgColors,
    handleOnChangeSectionBackgroundColor,
    defaultBreakPointStyle,
    breakpoint,
    setBreakpoint,
    updateSelectedItemBreakpoints,
    deleteSelectedSection,
    paddingControl,
    paddingRegister,
    paddingHandleSubmit,
    handlePaddingFormSubmit,
    paddingErrors,
  };
};

export default useContainer;
