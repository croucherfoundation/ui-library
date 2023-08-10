import { Element } from "../../types/element.t";
import CroucherLinkButton from "../Croucher_Report/components/CroucherLinkButton";

interface Props {
  element: Element;
  containerId: string;
  sectionId: string;
  elementId: string;
  className?: string;
}

function Croucher_Subscribe({ element, containerId, sectionId }: Props) {
  return (
    <div className="max-w-[799px] group px-[20px] md:px-[23px] pt-[15px] pb-[20px] md:pt-[20px] md:pb-[14px] bg-edt-secondary rounded-[5px] mx-auto flex flex-col md:flex-row justify-between hover:bg-edt-primary hover:text-white">
      <div className="max-w-[369px] text-[20px] md:text-[24px] font-semibold leading-[28px]">
        Stay up to date with the latest scientific developments by Croucher
        scholars and the work of Croucher Foundation.
      </div>
      <div className="flex-1 flex flex-col items-end pt-[12px] md:pt-0 justify-center">
        <input
          type="text"
          className="bg-edt-white h-[40px] rounded-[5px] mb-[20px] w-full md:max-w-[256px] pl-[10px] placeholder-edt-white group-hover:placeholder-edt-dark"
          placeholder="Email"
        />
        <div className="">
          <CroucherLinkButton
            containerId={containerId}
            sectionId={sectionId}
            elementId={element.id}
            buttonText={element.content.link.linkText}
            buttonLink={element.content.link.linkUrl}
            size="lg"
            showBorder={true}
            className="group-hover:border-edt-white !hover:border-[1px] hover:border-edt-white !md:-mt-[2px]"
            onClick={() => {
              //
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default Croucher_Subscribe;
