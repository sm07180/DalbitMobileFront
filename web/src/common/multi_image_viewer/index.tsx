import React, {useEffect, useMemo, useState} from "react";
import {Swiper, SwiperSlide} from 'swiper/react';
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMultiViewer} from "../../redux/actions/globalCtx";


const IMAGE_THUMB_L = "thumb700x700";

const MultiImageViewer = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {multiViewer} = globalState;
  const [swiper, setSwiper] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(multiViewer.initSlide !== undefined ? multiViewer.initSlide : 0);
  const totalSlidesCnt = useMemo(() => multiViewer.list?.length || 0, [multiViewer.list]);

  const handleClose = () => {
    dispatch(setGlobalCtxMultiViewer({show: false}));
  };

  useEffect(() => {
    if (multiViewer.show && swiper !== null) {
      swiper.update();
    }
  }, [multiViewer.show, multiViewer.list, swiper]);

  useEffect(() => {
    if (multiViewer.show) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [multiViewer.show]);

  return (
    <div id="profileImgPop" className="overlay fullWidth">
      <div className="header">
        <button className="close" onClick={handleClose}>
          닫기
        </button>
      </div>
      {multiViewer.show && multiViewer.list && multiViewer.list.length && (
        <Swiper
          centeredSlides={true}
          slidesPerView={1}
          className="imgBox"
          initialSlide={multiViewer.initSlide !== undefined ? multiViewer.initSlide : 0}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.realIndex);
          }}
          onInit={(swiper) => {
            setSwiper(swiper);
          }}
          resizeObserver={true}
        >
          {multiViewer.list.map((img, index) => (
            <SwiperSlide key={`profile_image_${index}`}>
              <div className={`imgWrap`}>
                <img src={img.profImg[IMAGE_THUMB_L]} alt={img.profImg.path} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="footer">
        <p className="navi">{`${currentSlide + 1} / ${totalSlidesCnt}`}</p>
        <button className="prev" type="button" disabled={currentSlide === 0} onClick={() => swiper.slidePrev()}>
          이전으로
        </button>
        <button className="next" type="button" disabled={currentSlide === totalSlidesCnt - 1} onClick={() => swiper.slideNext()}>
          다음으로
        </button>
      </div>
    </div>
  );
};

export default MultiImageViewer;
