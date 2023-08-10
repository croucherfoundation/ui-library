import { yupResolver } from "@hookform/resolvers/yup";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import findIndex from "lodash/findIndex";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import useSectionStore from "../../../../../store/section.store";
import { SectionState } from "../../../../../types/section.t";
import bgColors from "../../../../../utils/bgColors";
import { find } from "lodash";
import useEditorConfigStore from "../../../../../store/editorConfig.store";

interface PaddingFormValues {
  paddingTop: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingRight: number;
}
interface MarginFormValues {
  marginTop: number;
  marginLeft: number;
  marginBottom: number;
  marginRight: number;
}

const PaddingSchema = yup.object().shape({
  paddingTop: yup.number().min(0).required(),
  paddingLeft: yup.number().min(0).required(),
  paddingBottom: yup.number().min(0).required(),
  paddingRight: yup.number().min(0).required(),
});
const MarginSchema = yup.object().shape({
  marginTop: yup.number().min(0).required(),
  marginLeft: yup.number().min(0).required(),
  marginBottom: yup.number().min(0).required(),
  marginRight: yup.number().min(0).required(),
});

interface MaxwidthFormValues {
  maxWidth: number;
}

const MaxwidthSchema = yup.object().shape({
  maxWidth: yup.number().min(0).required(),
});
const units = [{ name: "px" }, { name: "%" }];

const useContainer = () => {
  const [lan] = useEditorConfigStore((state) => [state.lan]);
  const [
    sections,
    updateEnSection,
    updateHkSection,
    selectedSection,
    updateSelectedSection,
    updateSelectedItem,
    breakpoint,
  ] = useSectionStore((state) => [
    state.section,
    state.updateEnSection,
    state.updateHkSection,
    state.selectedSection,
    state.updateSelectedSection,
    state.updateSelectedItem,
    state.breakpoint,
  ]);
  const {
    register: paddingRegister,
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
  const {
    register: marginRegister,
    formState: { errors: marginErrors },
    handleSubmit: marginHandleSubmit,
    control: marginControl,
    setValue: marginSetValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(MarginSchema),
    defaultValues: {
      marginTop: 0,
      marginLeft: 0,
      marginBottom: 0,
      marginRight: 0,
    },
  });
  const {
    formState: { errors: maxWidthErrors },
    handleSubmit: maxWidthHandleSubmit,
    control: maxWidthControl,
    setValue: maxWidthSetValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(MaxwidthSchema),
    defaultValues: {
      maxWidth: 0,
    },
  });

  const [selectedUnit, setSelectedUnit] = useState<{ name: string }>(units[0]);

  const updateSelectedItemBreakpoints = ({
    sectionId,
    breakpoint,
    breakpointValue,
  }: {
    sectionId: string;
    breakpoint: "lg" | "md" | "sm";
    breakpointValue: string;
  }) => {
    const handleEnChangeBreakpoint = () => {
      const clonedSections = cloneDeep(sections["en"]);
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

        updateEnSection(clonedSections);
      }
    };
    const handleHkChangeBreakpoint = () => {
      const clonedSections = cloneDeep(sections["hk"]);
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

        updateHkSection(clonedSections);
      }
    };

    handleEnChangeBreakpoint();
    handleHkChangeBreakpoint();
  };

  const deleteSelectedSection = ({ sectionId }: { sectionId: string }) => {
    const handleEnDeleteSection = () => {
      const section = filter(
        sections["en"],
        (section) => section.id !== sectionId
      );

      updateSelectedItem(null);

      updateEnSection(section);
    };
    const handleHkDeleteSection = () => {
      const section = filter(
        sections["hk"],
        (section) => section.id !== sectionId
      );

      updateSelectedItem(null);

      updateHkSection(section);
    };

    handleEnDeleteSection();
    handleHkDeleteSection();
  };

  const handleOnChangeSectionBackgroundColor = (bgColor: string) => {
    const handleEnSectionBackground = () => {
      const clonedSections = cloneDeep(sections["en"]);
      const clonedSelectedSection = find(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );
      const currentSectionIdx = findIndex(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );
      if (clonedSelectedSection) {
        clonedSelectedSection.style.background.normal.bgColor = bgColor;

        clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

        updateSelectedSection(clonedSelectedSection);
        updateEnSection(clonedSections);
      } else {
        return;
      }
    };
    const handleHkSectionBackground = () => {
      const clonedSections = cloneDeep(sections["hk"]);
      const currentSectionIdx = findIndex(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );
      const clonedSelectedSection = find(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );
      if (clonedSelectedSection) {
        clonedSelectedSection.style.background.normal.bgColor = bgColor;

        clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

        updateSelectedSection(clonedSelectedSection);
        updateHkSection(clonedSections);
      } else {
        return;
      }
    };

    handleEnSectionBackground();
    handleHkSectionBackground();
  };

  const handlePaddingFormSubmit: SubmitHandler<PaddingFormValues> = (
    data: PaddingFormValues
  ) => {
    const handleEnPaddingChange = () => {
      const clonedSections = cloneDeep(sections["en"]);
      const clonedSelectedSection = find(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );
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
        updateEnSection(clonedSections);
      } else {
        return;
      }
    };
    const handleHkPaddingChange = () => {
      const clonedSections = cloneDeep(sections["hk"]);
      const clonedSelectedSection = find(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );
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
        updateHkSection(clonedSections);
      } else {
        return;
      }
    };

    handleEnPaddingChange();
    handleHkPaddingChange();
  };

  const handleMarginFormSubmit: SubmitHandler<MarginFormValues> = (
    data: MarginFormValues
  ) => {
    const handleEnPaddingChange = () => {
      const clonedSections = cloneDeep(sections["en"]);
      const clonedSelectedSection = find(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );
      const currentSectionIdx = findIndex(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );

      if (clonedSelectedSection) {
        const bkPoint = clonedSelectedSection?.style?.padding[breakpoint];
        if (bkPoint) {
          clonedSelectedSection.style.margin[breakpoint].marginTop =
            data.marginTop;
          clonedSelectedSection.style.margin[breakpoint].marginLeft =
            data.marginLeft;
          clonedSelectedSection.style.margin[breakpoint].marginBottom =
            data.marginBottom;
          clonedSelectedSection.style.margin[breakpoint].marginRight =
            data.marginRight;
        }

        clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

        updateSelectedSection(clonedSelectedSection);
        updateEnSection(clonedSections);
      } else {
        return;
      }
    };
    const handleHkPaddingChange = () => {
      const clonedSections = cloneDeep(sections["hk"]);
      const clonedSelectedSection = find(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );
      const currentSectionIdx = findIndex(
        clonedSections,
        (section) => section.id === selectedSection?.id
      );

      if (clonedSelectedSection) {
        const bkPoint = clonedSelectedSection?.style?.padding[breakpoint];
        if (bkPoint) {
          clonedSelectedSection.style.margin[breakpoint].marginTop =
            data.marginTop;
          clonedSelectedSection.style.margin[breakpoint].marginLeft =
            data.marginLeft;
          clonedSelectedSection.style.margin[breakpoint].marginBottom =
            data.marginBottom;
          clonedSelectedSection.style.margin[breakpoint].marginRight =
            data.marginRight;
        }

        clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

        updateSelectedSection(clonedSelectedSection);
        updateHkSection(clonedSections);
      } else {
        return;
      }
    };

    handleEnPaddingChange();
    handleHkPaddingChange();
  };

  const handleMaxwidthFormSubmit: SubmitHandler<MaxwidthFormValues> = (
    data
  ) => {
    const clonedSections = cloneDeep(sections[lan]);
    const clonedSelectedSection = cloneDeep(selectedSection);
    const currentSectionIdx = findIndex(
      clonedSections,
      (section) => section.id === selectedSection?.id
    );

    if (clonedSelectedSection) {
      if (clonedSelectedSection.option.maxWidth[breakpoint]) {
        clonedSelectedSection.option.maxWidth[breakpoint] = data.maxWidth;
      }

      clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

      updateSelectedSection(clonedSelectedSection);

      if (lan === "en") {
        updateEnSection(clonedSections);
      }
      if (lan === "hk") {
        updateHkSection(clonedSections);
      }
    } else {
      return;
    }
  };

  const handleChangeUnit = (unit: { name: string }) => {
    setSelectedUnit(unit);
    const clonedSections = cloneDeep(sections[lan]);
    const clonedSelectedSection = cloneDeep(selectedSection);
    const currentSectionIdx = findIndex(
      clonedSections,
      (section) => section.id === selectedSection?.id
    );

    if (clonedSelectedSection) {
      if (clonedSelectedSection.option.unit[breakpoint]) {
        clonedSelectedSection.option.unit[breakpoint] = unit.name;
      }

      clonedSections.splice(currentSectionIdx, 1, clonedSelectedSection);

      updateSelectedSection(clonedSelectedSection);
      if (lan === "en") {
        updateEnSection(clonedSections);
      }
      if (lan === "hk") {
        updateHkSection(clonedSections);
      }
    } else {
      return;
    }
  };

  // set selected styled
  useEffect(() => {
    //#region padding
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
    //#endregion padding
  }, [selectedSection, paddingSetValue, breakpoint]);

  useEffect(() => {
    //#region padding
    marginSetValue(
      "marginTop",
      selectedSection?.style.margin[breakpoint].marginTop as number
    );
    marginSetValue(
      "marginLeft",
      selectedSection?.style.margin[breakpoint].marginLeft as number
    );
    marginSetValue(
      "marginBottom",
      selectedSection?.style.margin[breakpoint].marginBottom as number
    );
    marginSetValue(
      "marginRight",
      selectedSection?.style.margin[breakpoint].marginRight as number
    );
    //#endregion padding
  }, [selectedSection, marginSetValue, breakpoint]);

  useEffect(() => {
    maxWidthSetValue(
      "maxWidth",
      selectedSection?.option.maxWidth[breakpoint] as number
    );
  }, [selectedSection, breakpoint, maxWidthSetValue]);

  useEffect(() => {
    if (selectedSection?.option.unit[breakpoint]) {
      setSelectedUnit({ name: selectedSection?.option.unit[breakpoint] });
    }
  }, [selectedSection, breakpoint]);

  return {
    bgColors: bgColors,
    handleOnChangeSectionBackgroundColor,
    breakpoint,
    updateSelectedItemBreakpoints,
    deleteSelectedSection,
    paddingControl,
    paddingRegister,
    paddingHandleSubmit,
    handlePaddingFormSubmit,
    paddingErrors,
    marginControl,
    marginRegister,
    marginHandleSubmit,
    handleMarginFormSubmit,
    marginErrors,
    maxWidthControl,
    maxWidthErrors,
    maxWidthHandleSubmit,
    handleMaxwidthFormSubmit,
    units,
    selectedUnit,
    handleChangeUnit,
  };
};

export default useContainer;
