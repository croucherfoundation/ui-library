import { useRef } from "react";
import { FiPlus, FiTrash, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Grid } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { CroucherImageCardList } from "../../types/croucher.t";
import { ElementWithDynamicType } from "../../types/element.t";
import CroucherHeading from "../CroucherHeading/CroucherHeading";
import If from "../If";
import Image from "../Image/Image";
import CroucherCardBodyText from "./components/CroucherCardBodyText/CroucherCardBodyText";
import CroucherCardHeading from "./components/CroucherCardHeading/CroucherCardHeading";
import useContainer from "./useContainer";
interface Props {
  element: ElementWithDynamicType<CroucherImageCardList>;
  containerId: string;
  sectionId: string;
  elementId: string;
}

const Croucher_Img_Card_Carousel = ({
  element,
  containerId,
  sectionId,
  elementId,
}: Props) => {
  const {
    cardList,
    carouselContainerStyle,
    isEditMode,
    previewMode,
    addNewCard,
    handleOnSaveImage,
    handleContent,
    onDeleteCard,
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
        <div className="mb-[7px] flex justify-between items-center">
          <CroucherHeading
            containerId={containerId}
            sectionId={sectionId}
            elementId={element.id}
            element={element}
          />

          <div className="flex mr-[22px]">
            <div
              className="cursor-pointer w-[30px] h-[30px]"
              onClick={() => {
                swiperRef?.current?.swiper?.slidePrev();
              }}
            >
              <FiChevronLeft className="w-full h-full" />
            </div>
            <div
              className="cursor-pointer w-[30px] h-[30px]"
              onClick={() => {
                swiperRef?.current?.swiper?.slideNext();
              }}
            >
              <FiChevronRight className="w-full h-full" />
            </div>
          </div>
        </div>
        <Swiper
          // spaceBetween={32}
          slidesPerView={"auto"}
          modules={[Grid]}
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
                  className="!h-[130px] md:!h-[153px] rounded-t-[5px] overflow-hidden"
                  initialSelectedImage={card.image}
                  objectFit={card.style.objectFit}
                  onHandleImage={(img) => {
                    handleOnSaveImage(img, cardIndex);
                  }}
                  onSelectedItem={() => {
                    handleImageSettingSelected(card);
                  }}
                />

                <If
                  isTrue={isEditMode && !previewMode}
                  children={
                    <div
                      onClick={() => onDeleteCard(cardIndex)}
                      className="p-1 cursor-pointer bg-edt-primary hover:bg-edt-white text-edt-white hover:text-edt-primary top-[50px] right-[0px] border border-edt-primary hover:border-edt-primary rounded-[5px] absolute z-5 flex justify-center items-center"
                    >
                      <FiTrash className="relative w-2.5 h-2.5" />
                    </div>
                  }
                />
              </div>

              <div>
                <CroucherCardHeading
                  heading={card.heading}
                  isEditMode={isEditMode}
                  previewMode={previewMode}
                  handleSetHeading={(text) => {
                    handleContent(text, card.id);
                  }}
                />
              </div>

              <div>
                <CroucherCardBodyText
                  bodyText={card.content}
                  isEditMode={isEditMode}
                  previewMode={previewMode}
                  handlBodyText={(text) => {
                    handleContent(text, card.id, "content");
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <If
          isTrue={isEditMode && !previewMode}
          children={
            <div
              onClick={() => {
                addNewCard();
                setTimeout(
                  () =>
                    swiperRef?.current?.swiper?.slideTo(cardList.length - 1),
                  50
                );
              }}
              className="bg-edt-white cursor-pointer hover:bg-edt-success hover:text-white text-edt-success border border-edt-success hover:border-edt-success w-12 h-12 rounded-full absolute mt-7 top-1/2 -right-1 transform -translate-y-1/2 z-10 flex justify-center items-center"
            >
              <FiPlus className="relative w-6 h-6" />
            </div>
          }
        />
      </div>
    </>
  );
};

export default Croucher_Img_Card_Carousel;
