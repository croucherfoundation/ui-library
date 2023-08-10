import IfElse from "../../../IfElse";

interface Props {
  heading: string;
  isEditMode: boolean;
  previewMode: boolean;
  handleSetHeading: (value: string) => void;
}

const CroucherCardHeading = ({
  heading,
  isEditMode,
  previewMode,
  handleSetHeading,
}: Props) => {
  return (
    <div className="relative mt-[18px] px-[18px] md:px-[20px]">
      <IfElse
        isTrue={isEditMode}
        ifBlock={
          <>
            <IfElse
              isTrue={previewMode}
              ifBlock={
                <div className="relative">
                  <p className="text-[24px] ">{heading}</p>
                </div>
              }
              elseBlock={
                <textarea
                  placeholder="Title"
                  value={heading}
                  onChange={(e) => handleSetHeading(e.target.value)}
                  className="bg-transparent text-[24px] font-bold focus:outline-none resize-none h-auto w-full"
                  disabled={!isEditMode}
                  rows={2}
                ></textarea>
              }
            />
          </>
        }
        elseBlock={
          <div className="relative">
            <textarea
              placeholder="Heading"
              value={heading}
              className="hidden md:flex bg-transparent text-[24px] font-bold focus:outline-none resize-none h-auto w-full"
              disabled={true}
              rows={2}
            ></textarea>
            <h1 className="md:hidden text-[24px] font-bold focus:outline-none resize-none h-auto w-full">{heading}</h1>
          </div>
        }
      />
    </div>
  );
};

export default CroucherCardHeading;
