import IfElse from "../../../IfElse";

interface Props {
  bodyText: string;
  isEditMode: boolean;
  previewMode: boolean;
  handlBodyText: (value: string) => void;
}

const CroucherCardBodyText = ({
  bodyText,
  isEditMode,
  previewMode,
  handlBodyText,
}: Props) => {
  return (
    <div className="relative mt-[10px] px-[18px] md-px[20px]">
      <IfElse
        isTrue={isEditMode}
        ifBlock={
          <>
            <IfElse
              isTrue={previewMode}
              ifBlock={
                <div className="relative">
                  <p className="text-[16px] ">{bodyText}</p>
                </div>
              }
              elseBlock={
                <input
                  placeholder="Body text"
                  value={bodyText}
                  onChange={(e) => handlBodyText(e.target.value)}
                  className="bg-transparent text-[16px] focus:outline-none croucher-heading resize-none h-auto w-full pb-[20px]"
                  disabled={!isEditMode}
                />
              }
            />
          </>
        }
        elseBlock={
          <div className="relative">
            <p className="text-[16px] pb-[18px]">{bodyText}</p>
          </div>
        }
      />
    </div>
  );
};

export default CroucherCardBodyText;
