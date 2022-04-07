import React, {useCallback, useEffect, useRef, useState} from 'react';
import Utility from "components/lib/utility";
import {IMG_SERVER} from "context/config";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {isHybrid, isMobileWeb} from "context/hybrid";

const FeedLike = (props) => {
  const {data, fetchHandleLike, type, likeType, detailPageParam, detail} = props;
  const infoRef = useRef();
  const [tooltipEvent, setTooltipEvent] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  /* 좋아요 툴팁 이벤트 */
  const tooltipScrollEvent = useCallback(() => {
    const infoNode = infoRef.current;
    const infoPosition = infoNode?.offsetTop;
    const scrollBottom = window.scrollY + document.documentElement.clientHeight - 100;

    if (scrollBottom > infoPosition) {
      setTooltipEvent(true);
    }
  }, []);

  /* 좋아요 클릭 이벤트 */
  const onClick = (e) => {
    const index = e.currentTarget.dataset.index;
    fetchHandleLike((data.noticeIdx ? data.noticeIdx : data.reg_no), data.mem_no, data.like_yn, likeType, index);
  }

  useEffect(() => {
    document.addEventListener('scroll', tooltipScrollEvent);
    return () => {
      document.removeEventListener('scroll', tooltipScrollEvent);
    }
  },[])

  return (
    <>
      <div className="info" ref={infoRef}>
        {type !== "fanBoard" && data?.like_yn === "n" ?
          <i className="likeOff" onClick={onClick} data-index={data.noticeIdx ? data.noticeIdx : data.reg_no}>
            {data.rcv_like_cnt ? Utility.printNumber(data.rcv_like_cnt) : 0}
            {(tooltipEvent && type === "feed" && detail) && <div className="likeTooltip"><img src={`${IMG_SERVER}/profile/likeTooltip.png`} alt="" /></div>}
          </i>
          : type !== "fanBoard" && data?.like_yn === "y" &&
          <i className="likeOn" onClick={onClick} data-index={data.noticeIdx ? data.noticeIdx : data.reg_no}>
            {data.rcv_like_cnt ? Utility.printNumber(data.rcv_like_cnt) : 0}
          </i>
        }

        {detail ?
          <i className="cmt">{(data?.replyCnt || data?.tail_cnt) ? Utility.printNumber(data.replyCnt || data.tail_cnt) : 0}</i>
          :
          <i className="cmt" onClick={() => goProfileDetailPage(detailPageParam)}>{(data.replyCnt || data.tail_cnt) ? Utility.printNumber(data.replyCnt || data.tail_cnt) : 0}</i>
        }
        {type === "notice" && !detail && <span className="time">{Utility.writeTimeDffCalc(data.writeDate)}</span>}
      </div>

      {type === "notice" && likeType === "fix" ?
        <button className="fixIcon">
          <img src={`${IMG_SERVER}/profile/bookmark-on.png`}/>
        </button>
        : type === "notice" && likeType === "nonFix" &&
        <button className="fixIcon">
          <img src={`${IMG_SERVER}/profile/bookmark-off.png`} />
        </button>
      }
    </>
  );
};

export default FeedLike;