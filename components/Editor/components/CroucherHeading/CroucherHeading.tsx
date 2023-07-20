import useContainer from "./useContainer";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

const CroucherHeading = ({ containerId, sectionId, elementId }: Props) => {
  const { heading, setHeading, isEditMode } = useContainer({
    containerId,
    sectionId,
    elementId,
  });
  return (
    <div className="mb-3 relative">
      <div className="absolute top-0 left-0 h-full w-3 bg-[#EE3A43]"></div>
      <input
        placeholder="Type heading here..."
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
        type="text"
        className="bg-transparent text-2xl font-bold focus:outline-none croucher-heading ml-5"
        disabled={!isEditMode}
      />
    </div>
  );
};

export default CroucherHeading;
