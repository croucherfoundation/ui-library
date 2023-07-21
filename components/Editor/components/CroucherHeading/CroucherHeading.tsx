import useContainer from "./useContainer";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

const CroucherHeading = ({ containerId, sectionId, elementId }: Props) => {
  const { heading, isEditMode, handleSetHeading } = useContainer({
    containerId,
    sectionId,
    elementId,
  });
  return (
    <div className="relative">
      <div className="absolute top-[3px] left-[13px] min-h-[20px] w-[7px] md:w-[11px] bg-[#EE3A43]"></div>
      <input
        placeholder="Type heading here..."
        value={heading}
        onChange={(e) => handleSetHeading(e.target.value)}
        type="text"
        className="bg-transparent text-2xl font-bold focus:outline-none croucher-heading ml-[30px] md:ml-[40px]"
        disabled={!isEditMode}
      />
    </div>
  );
};

export default CroucherHeading;
