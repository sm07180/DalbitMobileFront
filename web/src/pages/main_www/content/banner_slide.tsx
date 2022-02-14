import React, { useContext, useEffect, useReducer, useRef, useState } from "react";

//modules
import Swiper from "react-id-swiper";
import { getBanner } from "common/api";

import { useHistory } from "react-router-dom";
import { GlobalContext } from "context";

let interval;
let intervalOver;

export default function bannerSlide(props: any) {
  const { ref } = props;
  const gtx = useContext(GlobalContext);
  const history = useHistory();
  const SwiperRef = useRef<any>(null);

  const [swiper, setSwiper] = useState<any>(null);
  const [activeIndex, setAciveIndex] = useState(1);
  const [bannerView, setBannerView] = useState(false);
  const [list, setList] = useState([]);

  const buttonToogle = () => {
    if (bannerView === false) {
      setBannerView(true);
    } else {
      setBannerView(false);
    }
  };

  const goEvent = (linkUrl, linkType) => {
    if (linkUrl.startsWith("http://") || linkUrl.startsWith("https://")) {
      location.href = linkUrl;
    } else {
      history.push(linkUrl);
    }
  };

  async function fetchBannerData() {
    const res = await getBanner({
      position: 9,
    });
    if (res.result === "success") {
      if (res.hasOwnProperty("data")) setList(res.data);
    } else {
      console.log(res.result, res.message);
    }
  }

  useEffect(() => {
    fetchBannerData();
  }, []);

  const basicSliderList = () => {
    if (!list) return null;
    return list.map((banner, idx) => {
      const { bannerUrl, linkUrl, title, linkType } = banner;

      return (
        <div className="basicBanner" key={`banner-${idx}`}>
          <img
            src={bannerUrl}
            alt={title}
            onClick={() => {
              goEvent(linkUrl, linkType);
            }}
          />
        </div>
      );
    });
  };

  const swiperBannerSlide: any = {
    slidesPerView: 1,
    loop: true,

    on: {
      slideChange: function() {
        setAciveIndex(this["realIndex"] + 1);
      },
    },
  };

  // swiper auto slide
  useEffect(() => {
    if (SwiperRef.current) {
      setSwiper(SwiperRef.current.swiper);
    }

    interval = setInterval(() => {
      if (SwiperRef.current) {
        setSwiper(SwiperRef.current.swiper);
      }
    }, 200);

    if (swiper) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [SwiperRef.current, swiper]);

  useEffect(() => {
    if (swiper && bannerView === false) {
      intervalOver = setInterval(() => {
        swiper.slideNext();
      }, 2500);
    }
    let overEv = () => {
      clearInterval(intervalOver);
      intervalOver = null;
    };

    let leaveEv = () => {
      if (!intervalOver) {
        intervalOver = setInterval(() => {
          swiper.slideNext();
        }, 2500);
      }
    };

    if (SwiperRef.current) {
      SwiperRef.current.addEventListener("mouseover", overEv);
      SwiperRef.current.addEventListener("mouseleave", leaveEv);
    }

    return () => {
      clearInterval(intervalOver);
      if (SwiperRef.current) {
        SwiperRef.current.removeEventListener("mouseover", overEv);
        SwiperRef.current.removeEventListener("mouseleave", leaveEv);
      }
    };
  }, [swiper, bannerView]);
  // swiper auto slide ------ end

  return (
    <>
      <div className="bannerListBox">
        <button
          className={`bannerListBox__button ${bannerView === true ? "bannerListBox__button--active" : ""}`}
          onClick={() => buttonToogle()}
        ></button>

        <div className={`bannerSlide ${bannerView === false ? "" : "active"}`}>
          {list instanceof Array && list.length > 0 && (
            <>
              <Swiper {...swiperBannerSlide} ref={SwiperRef}>
                {list.map((banner, idx) => {
                  const { bannerUrl, linkUrl, title, linkType } = banner;
                  return (
                    <div
                      className="slideWrap bannerItem"
                      key={`banner-${idx}`}
                      onClick={() => {
                        goEvent(linkUrl, linkType);
                      }}
                    >
                      <img src={bannerUrl} alt={title} />
                    </div>
                  );
                })}
              </Swiper>
              <div className="bannerSlide__indexBox">
                <span className="bannerSlide__indexBox--active">{activeIndex}</span>/<span>{list.length}</span>
              </div>
            </>
          )}
        </div>
        <div className={`bannerView ${bannerView === true ? "active" : ""}`}>{list && basicSliderList()}</div>
      </div>
    </>
  );
}
