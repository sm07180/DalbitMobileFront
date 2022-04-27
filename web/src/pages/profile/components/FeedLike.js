import React, {useCallback, useEffect, useRef, useState} from 'react';
import Utility from "components/lib/utility";
import {IMG_SERVER} from "context/config";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";

const FeedLike = (props) => {
  const {data, fetchHandleLike, type, likeType, detailPageParam, detail} = props;
  const infoRef = useRef();
  const [tooltipEvent, setTooltipEvent] = useState(true);

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
  };

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
            {(tooltipEvent && (type === "feed" || type === "notice") && detail) && <div className="likeTooltip"><img src={`${IMG_SERVER}/profile/likeTooltip-fix.png`} alt="" /></div>}
          </i>
          : type !== "fanBoard" && data?.like_yn === "y" &&
          <i className="likeOn" onClick={onClick} data-index={data.noticeIdx ? data.noticeIdx : data.reg_no}>
            {data.rcv_like_cnt ? Utility.printNumber(data.rcv_like_cnt) : 0}
          </i>
        }

        {detail ?
          <i className="cmt">{(data.replyCnt ? data.replyCnt : data.tail_cnt) ? Utility.printNumber(data.replyCnt ? data.replyCnt : data.tail_cnt) : 0}</i>
          :
          <i className="cmt" onClick={() => goProfileDetailPage(detailPageParam)}>{(data.replyCnt ? data.replyCnt : data.tail_cnt) ? Utility.printNumber(data.replyCnt ? data.replyCnt : data.tail_cnt) : 0}</i>
        }
        {type === "notice" && !detail && <span className="time">{Utility.writeTimeDffCalc(data.writeDate)}</span>}
      </div>

      {type === "notice" && likeType === "fix" ?
        <i className="fixIcon">
          <img src={`${IMG_SERVER}/profile/bookmark-on.png`}/>
        </i>
        : type === "notice" && likeType === "nonFix" &&
        <i className="fixIcon">
          <img src={`${IMG_SERVER}/profile/bookmark-off.png`} />
        </i>
      }
    </>
  );
};

export default FeedLike;