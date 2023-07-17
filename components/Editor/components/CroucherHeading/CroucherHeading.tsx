import useContainer from "./useContainer";

interface Props {
  containerId: string;
  sectionId: string;
  elementId: string;
}

const CroucherHeading = ({ containerId, sectionId, elementId }: Props) => {
  const { heading, setHeading } = useContainer({
    containerId,
    sectionId,
    elementId,
  });
  return (
    <div className="mb-3">
      <input
        placeholder="Type heading here..."
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
        type="text"
        className="bg-transparent text-2xl font-bold"
      />
    </div>
  );
};

export default CroucherHeading;
