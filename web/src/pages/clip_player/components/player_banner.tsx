import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { postClipPlay } from "common/api";
import Swiper from "react-id-swiper";

type bannerType = {
  link: string;
  text: string;
  isLink: boolean;
};

let intervalOver;
let interval;
export default function ClipPlayerBanner({ clipPlayNo }) {
  const history = useHistory();
  const [bannerList, setBannerList] = useState<Array<bannerType>>([]);
  const [swiper, setSwiper] = useState<any | null>(null);
  const [isOne, setIsOne] = useState<boolean>(false);
  const SwiperRef = useRef<any | null>(null);

  const fetchBannerData = async () => {
    const { result, data } = await postClipPlay({
      clipNo: clipPlayNo,
    });
    if (result === "success") {
      if (data.hasOwnProperty("banners")) {
        if (data.banners.length > 1) {
          setIsOne(false);
        } else {
          setIsOne(true);
        }

        const banners = data.banners.map((item) => {
          if (item.link) {
            return { ...item, isLink: true };
          } else {
            return { ...item, isLink: false };
          }
        });
        setBannerList(banners);
      }
    }
  };

  const swiperParamsBanner: any = {
    slidesPerView: 1,
    centeredSlides: true,

    loop: true,
    on: {
      init: function() {
        setSwiper(this);
      },
    },
  };

  const goPrev = () => {
    swiper.slidePrev(1000);
  };

  const goNext = () => {
    swiper.slideNext(1000);
  };

  const goBannerUrl = (link, isLink) => {
    if (isLink) {
      history.push(`${link}`);
    }
  };

  const firstClick = () => {
    const { isLink, link } = bannerList[0];
    if (isLink) {
      history.push(`${link}`);
    }
  };

  const lastClick = () => {
    const { isLink, link } = bannerList[bannerList.length - 1];
    if (isLink) {
      history.push(`${link}`);
    }
  };

  const makeList = (bannerList) => {
    return bannerList.map((v, i) => {
      return (
        <div
          className={`bannerTextItem ${v.isLink ? " isLink" : ""}`}
          key={`banner-${i}`}
          onClick={() => v.isLink && goBannerUrl(v.link, v.isLink)}
        >
          {v.text}
        </div>
      );
    });
  };

  const MakeBtnWrap = () => {
    return (
      <div className="bannerBtnWrap">
        <button className="btn prev" onClick={() => goPrev()} disabled={isOne} />
        <button className="btn next" onClick={() => goNext()} disabled={isOne} />
      </div>
    );
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  useEffect(() => {
    interval = setInterval(() => {
      if (SwiperRef.current) {
        setSwiper(SwiperRef.current.swiper);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [SwiperRef.current, swiper]);

  useEffect(() => {
    if (swiper) {
      intervalOver = setInterval(() => {
        swiper.slideNext(1000);
      }, 5000);
    }
    let overEv = () => {
      clearInterval(intervalOver);
      intervalOver = null;
    };
    let leaveEv = () => {
      if (!intervalOver) {
        intervalOver = setInterval(() => {
          swiper.slideNext(1000);
        }, 5000);
      }
    };
    if (SwiperRef.current) {
      SwiperRef.current.addEventListener("mouseover", overEv);
      SwiperRef.current.addEventListener("mouseleave", leaveEv);
    }
    if (swiper) {
      swiper.slides[0].addEventListener("click", lastClick);
      swiper.slides[swiper.slides.length - 1].addEventListener("click", firstClick);
    }
    return () => {
      clearInterval(intervalOver);
      if (SwiperRef.current) {
        SwiperRef.current.removeEventListener("mouseover", overEv);
        SwiperRef.current.removeEventListener("mouseleave", leaveEv);
      }
      if (swiper) {
        swiper.slides[0].removeEventListener("click", lastClick);
        swiper.slides[swiper.slides.length - 1].removeEventListener("click", firstClick);
      }
    };
  }, [swiper]);

  return (
    <>
      {bannerList && bannerList.length > 0 && (
        <div className="playBannerWrap">
          <>
            {bannerList.length > 1 ? (
              <>
                <Swiper {...swiperParamsBanner} ref={SwiperRef}>
                  {makeList(bannerList)}
                </Swiper>
                <MakeBtnWrap />
              </>
            ) : (
              <>
                {makeList(bannerList)}
                <MakeBtnWrap />
              </>
            )}
          </>
        </div>
      )}
    </>
  );
}
