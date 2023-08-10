import { useRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { CroucherImageCardList } from "../../types/croucher.t";
import { ElementWithDynamicType } from "../../types/element.t";
import CroucherHeading from "../CroucherHeading/CroucherHeading";
import IfElse from "../IfElse";
import Image from "../Image/Image";
import CroucherLinkButton from "./components/CroucherLinkButton";
import useContainer from "./useContainer";

interface Props {
  element: ElementWithDynamicType<CroucherImageCardList>;
  containerId: string;
  sectionId: string;
  elementId: string;
  className?: string;
}

const Croucher_Report = ({
  element,
  containerId,
  sectionId,
  elementId,
  className = "",
}: Props) => {
  const {
    cardList,
    carouselContainerStyle,
    isEditMode,
    handleOnSaveImage,
    handleImageSettingSelected,
  } = useContainer({
    element,
    elementId,
    containerId,
    sectionId,
  });

  const swiperRef = useRef<SwiperRef>(null);

  return (
    <>
      <div className="w-full relative">
        <div
          className={`${"flex flex-col lg:flex-row justify-between"} ${className}`}
        >
          <div className="w-full md:w-[388px] mb-[7px] md:-mt-[8px]">
            <CroucherHeading
              containerId={containerId}
              sectionId={sectionId}
              elementId={element.id}
              element={element}
            />
          </div>
          <div className="w-full md:max-w-[590px] mx-auto">
            <Swiper
              freeMode={{
                enabled: true,
                momentum: false,
              }}
              spaceBetween={30}
              slidesPerView={"auto"}
              // modules={[Grid]}
              ref={swiperRef}
            >
              {cardList.map((card, cardIndex) => (
                <SwiperSlide key={card.id} className={carouselContainerStyle}>
                  <div>
                    <Image
                      element={element}
                      containerId={containerId}
                      sectionId={sectionId}
                      elementId={elementId}
                      className="!h-[245px] overflow-hidden"
                      initialSelectedImage={card.image}
                      objectFit={card.style.objectFit}
                      onHandleImage={(img) => {
                        handleOnSaveImage(img, cardIndex);
                      }}
                      onSelectedItem={() => {
                        handleImageSettingSelected(card);
                      }}
                    />
                    <IfElse
                      isTrue={isEditMode}
                      ifBlock={
                        // <CroucherLinkButton
                        //   containerId={containerId}
                        //   sectionId={sectionId}
                        //   elementId={element.id}
                        //   buttonText={card.link.linkText}
                        //   buttonLink={card.link.linkUrl}
                        // />
                        <div className="text-right text-[16px] mt-[16px] font-body font-semibold pr-[4px]">
                          download
                        </div>
                      }
                      elseBlock={
                        <div className="text-right text-[16px] mt-[16px] font-body font-semibold pr-[4px]">
                          download
                        </div>
                      }
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="mt-[12px] mb-0 lg:mr-0 md:mx-auto md:mb-[35px] md:w-[590px] lg:w-auto md:mt-0 self-end flex justify-end">
            <CroucherLinkButton
              containerId={containerId}
              sectionId={sectionId}
              elementId={element.id}
              buttonText={element.content.link.linkText}
              buttonLink={element.content.link.linkUrl}
              size="lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Croucher_Report;
