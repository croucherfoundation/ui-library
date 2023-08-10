import { yupResolver } from "@hookform/resolvers/yup";
import { cloneDeep, fill } from "lodash";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { sectionValueUpdater } from "../../helpers";
import useSectionStore from "../../store/section.store";
import useEditorConfigStore from "../../store/editorConfig.store";

interface ButtonLinkFormValues {
  buttonUrl: string;
  buttonText: string;
}

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

const ButtonLinkFormSchema = yup.object().shape({
  buttonText: yup.string().required(),
  buttonUrl: yup.string().url().required(),
});

const useContainer = ({ containerId, sectionId, elementId }: Props) => {
  const [lan] = useEditorConfigStore((state) => [state.lan]);
  const [sections, updateEnSection, updateHkSection] = useSectionStore(
    (state) => [state.section, state.updateEnSection, state.updateHkSection]
  );
  const {
    formState: { errors, isValid },
    handleSubmit,
    control,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(ButtonLinkFormSchema),
    defaultValues: {
      buttonText: "Job openings",
      buttonUrl: "",
    },
  });
  const buttonText = watch("buttonText");

  const handleButtonLinkForm: SubmitHandler<ButtonLinkFormValues> = (
    data: ButtonLinkFormValues
  ) => {
    const clonedSections = cloneDeep(sections[lan]);
    const {
      currentSectionIdx,
      currentContainerIdx,
      currentElementIdx,
      currentSection,
      currentContainer,
      currentElement,
    } = sectionValueUpdater({
      sections: clonedSections,
      sectionId: sectionId,
      containerId: containerId,
      elementId: elementId,
    });

    if (currentElement !== null) {
      currentElement.content.link.linkText = data.buttonText;
      currentElement.content.link.linkUrl = data.buttonUrl;
    }

    fill(currentContainer.children, currentElement, currentElementIdx ?? 0, 1);
    fill(currentSection.children, currentContainer, currentContainerIdx, 1);
    fill(clonedSections, currentSection, currentSectionIdx, 1);

    if (lan === "en") {
      updateEnSection(clonedSections);
    }

    if (lan === "hk") {
      updateHkSection(clonedSections);
    }
  };

  return {
    control,
    handleSubmit,
    handleButtonLinkForm,
    errors,
    isValid,
    buttonText,
  };
};

export default useContainer;
