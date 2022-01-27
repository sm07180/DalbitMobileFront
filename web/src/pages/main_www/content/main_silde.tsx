import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

//modules
import Swiper from "react-id-swiper";

import { useHistory } from "react-router-dom";
import { GlobalContext } from "context";
import { RoomValidateFromClip } from "common/audio/clip_func";
import BadgeList from "../../../common/badge_list";

let interval;
let intervalOver;

export default function MainSlide(props: any) {
  const { slideList } = props;
  const gtx = useContext(GlobalContext);
  const history = useHistory();
  const SwiperRef = useRef<any>(null);

  const [swiper, setSwiper] = useState<any>(null);
  const [activeIndex, setAciveIndex] = useState(1);

  const swiperMainSlide: any = {
    slidesPerView: 1,
    loop: true,
    on: {
      slideChange: function() {
        setAciveIndex(this["realIndex"] + 1);
      },
    },
  };

  const firstClick = () => {
    const { roomNo, nickNm, roomType } = slideList[0];
    const broadUrl = /\/broadcast\/[0-9]*$/;
    if (roomNo && roomNo !== undefined) {
      if (nickNm === "banner") {
        if (roomType === "link") {
          if (roomNo.startsWith("http://") || roomNo.startsWith("https://")) {
            window.location.href = `${roomNo}`;
          } else {
            history.push(`${roomNo}`);
          }
        } else {
          if (broadUrl.test(roomNo)) {
            const room_no = roomNo.substring(roomNo.lastIndexOf("/") + 1);
            RoomValidateFromClip(room_no, gtx, history, "noName");
          } else {
            window.open(`${roomNo}`);
          }
        }
      } else {
        RoomValidateFromClip(roomNo, gtx, history, nickNm);
      }
    }
  };

  const lastClick = () => {
    const { roomNo, nickNm, roomType, bannerUrl } = slideList[
      slideList.length - 1
    ];
    const broadUrl = /\/broadcast\/[0-9]*$/;
    if (roomNo && roomNo !== undefined) {
      if (nickNm === "banner") {
        if (roomType === "link") {
          if (roomNo.startsWith("http://") || roomNo.startsWith("https://")) {
            window.location.href = `${roomNo}`;
          } else {
            history.push(`${roomNo}`);
          }
        } else {
          if (broadUrl.test(roomNo)) {
            const room_no = roomNo.substring(roomNo.lastIndexOf("/") + 1);
            RoomValidateFromClip(room_no, gtx, history, "noName");
          } else {
            window.open(`${roomNo}`);
          }
        }
      } else {
        RoomValidateFromClip(roomNo, gtx, history, nickNm);
      }
    }
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
    if (swiper) {
      intervalOver = setInterval(() => {
        swiper.slideNext();
      }, 3500);
    }
    let overEv = () => {
      clearInterval(intervalOver);
      intervalOver = null;
    };

    let leaveEv = () => {
      if (!intervalOver) {
        intervalOver = setInterval(() => {
          swiper.slideNext();
        }, 3500);
      }
    };

    if (SwiperRef.current) {
      SwiperRef.current.addEventListener("mouseover", overEv);
      SwiperRef.current.addEventListener("mouseleave", leaveEv);
    }

    if (swiper) {
      swiper.slides[0].addEventListener("click", lastClick);
      swiper.slides[swiper.slides.length - 1].addEventListener(
        "click",
        firstClick
      );
    }

    return () => {
      clearInterval(intervalOver);
      if (SwiperRef.current) {
        SwiperRef.current.removeEventListener("mouseover", overEv);
        SwiperRef.current.removeEventListener("mouseleave", leaveEv);
      }
      if (swiper) {
        swiper.slides[0].removeEventListener("click", lastClick);
        swiper.slides[swiper.slides.length - 1].removeEventListener(
          "click",
          firstClick
        );
      }
    };
  }, [swiper]);

  // swiper auto slide ------ end

  return (
    <div className="mainSlide">
      {slideList instanceof Array && slideList.length > 0 && (
        <>
          <Swiper {...swiperMainSlide} ref={SwiperRef}>
            {slideList.map((item, idx) => {
              const {
                bannerUrl,
                isAdmin,
                isConDj,
                isNew,
                nickNm,
                roomNo,
                roomType,
                profImg,
                title,
                liveBadgeList,
                badgeSpecial,
              } = item;

              return (
                <div
                  className={`slideWrap mainSlideItem ${
                    nickNm !== "banner" ? "broadcast" : "banner"
                  }`}
                  key={idx}
                  onClick={() => {
                    if (roomNo && roomNo !== undefined) {
                      const broadUrl = /\/broadcast\/[0-9]*$/;
                      if (nickNm === "banner") {
                        if (roomType === "link") {
                          if (
                            roomNo.startsWith("http://") ||
                            roomNo.startsWith("https://")
                          ) {
                            window.location.href = `${roomNo}`;
                          } else {
                            history.push(`${roomNo}`);
                          }
                        } else {
                          if (broadUrl.test(roomNo)) {
                            const room_no = roomNo.substring(
                              roomNo.lastIndexOf("/") + 1
                            );
                            RoomValidateFromClip(
                              room_no,
                              gtx,
                              history,
                              "noName"
                            );
                          } else {
                            window.open(`${roomNo}`);
                          }
                        }
                      } else {
                        RoomValidateFromClip(roomNo, gtx, history, nickNm);
                      }
                    }
                  }}
                  style={{
                    backgroundImage: `url("${bannerUrl}")`,
                  }}
                >
                  <div className="mainSlideItem__iconWrap">
                    {isAdmin ? <em className="adminIcon">운영자</em> : ""}
                    {nickNm !== "banner" && isNew === true ? (
                      <em className="icon_wrap icon_newdj">신입DJ</em>
                    ) : (
                      <></>
                    )}
                    {badgeSpecial > 0 && badgeSpecial === 2 && (
                      <em className="icon_wrap icon_bestdj">베스트DJ</em>
                    )}
                    {isConDj === true && (
                      <em className="icon_wrap icon_contentsdj">콘텐츠DJ</em>
                    )}
                    {badgeSpecial > 0 && badgeSpecial === 1 && (
                      <em className="icon_wrap icon_specialdj">스페셜DJ</em>
                    )}
                    {liveBadgeList && liveBadgeList.length !== 0 && (
                      <BadgeList list={liveBadgeList} />
                    )}
                    {nickNm === "banner" && (
                      <em className="icon_wrap icon_event">EVENT</em>
                    )}
                  </div>

                  {nickNm !== "banner" && (
                    <>
                      <span className="icon_wrap icon_live_text">live</span>
                      <div className="mainSlideItem__infoWrap">
                        <img className="thumb" src={profImg.url} />
                        <div className="text">
                          <span className="title">{title}</span>
                          <span className="nickname">{nickNm}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </Swiper>
          <div className="mainSlide__indexBox">
            <span className="mainSlide__indexBox--active">{activeIndex}</span>/
            <span>{slideList.length}</span>
          </div>
        </>
      )}
    </div>
  );
}
