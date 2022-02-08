import React, {useContext, useEffect, useRef} from 'react'
import {IMG_SERVER} from 'context/config'

// global components
import ListRow from 'components/ui/listRow/ListRow'
import DataCnt from 'components/ui/dataCnt/DataCnt'
// css
import './socialList.scss'
import {Context} from "context";

const FanSocialList = (props) => {
  const {profileData, list, isMyProfile} = props
  const moreRef = useRef([]);
  const context = useContext(Context);

  // 스와이퍼
  const swiperFeeds = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }

  /* 더보기 박스 열기 */
  const moreBoxOpenAction = (target) => {
    target.classList.remove('hidden');
    target.classList.add('isOpenMoreBox');
  }

  /* 더보기 박스 닫기 */
  const moreBoxCloseAction = (target) => {
    target.classList.add('hidden')
    target.classList.remove('isOpenMoreBox')
  }

  /* 더보기 박스 클릭 */
  const moreBoxClick = (index) => {
    const currentTarget = moreRef.current[index];

    // 이전에 열려있는 박스가 있으면 닫는다
    const prevTarget = document.getElementsByClassName('isOpenMoreBox')[0]
    if(prevTarget) {
      moreBoxCloseAction(prevTarget);
    }

    if(prevTarget !== currentTarget) {
      if(currentTarget.classList.contains('hidden')) {
        moreBoxOpenAction(currentTarget);
      }else {
        moreBoxCloseAction(currentTarget);
      }
    }
  }

  /* 더보기 박스 닫기 (외부 클릭) */
  const moreBoxClose = (e) => {
    if(!e.target.classList.contains('moreBoxImg')) {
      const target = document.getElementsByClassName('isOpenMoreBox')[0];
      if(target) {
        moreBoxCloseAction(target);
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', moreBoxClose);
    return () => document.removeEventListener('click', moreBoxClose);
  }, []);

  return (
    <div className="socialList">
      {list.map((item, index) => {
        return (
          <React.Fragment key={item.replyIdx}>
            <ListRow photo={profileData.profImg ? profileData.profImg.thumb50x50 : ""}>
              <div className="listContent">
                <div className="nick">{item.nickName}</div>
                <div className="time">{item.writeDt}</div>
              </div>
              <button className='more' onClick={() => moreBoxClick(index)}>
                <img className="moreBoxImg" src={`${IMG_SERVER}/mypage/dalla/btn_more.png`} alt="더보기" />
                <div ref={(el) => moreRef.current[index] = el} className="isMore hidden">
                  {(context.profile.memNo === item.mem_no || context.adminChecker) && <button>수정하기</button>}
                  {(isMyProfile || context.profile.memNo === item.mem_no || context.adminChecker) && <button>삭제하기</button>}
                  {context.profile.memNo !== item.mem_no && <button>차단/신고하기</button>}
                </div>
              </button>
            </ListRow>
            <div className="socialContent">
              <div className="text">
                {item.contents}
              </div>
              <div className="info">
                <DataCnt type={"replyCnt"} value={item.replyCnt ? item.replyCnt : 0} />
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default FanSocialList
