import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {IMG_SERVER} from "context/config";
import ListRow from "components/ui/listRow/ListRow";
import {Context} from "context";
import Utility from "components/lib/utility";

const ListRowComponent = (props) => {
  const { item, isMyProfile, index, photoClick, openBlockReportPop, disableMoreButton } = props;
  const context = useContext(Context);
  const moreRef = useRef([]);

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

  /* 피드 더보기 박스 클릭 */
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

  /* 피드 더보기 박스 닫기 (외부 클릭) */
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
    <ListRow photo={item.profImg?.thumb50x50} photoClick={photoClick}>
      <div className="listContent">
        <div className="nick">{item.nickName}</div>
        <div className="time">{item.writeDate ? Utility.writeTimeDffCalc(item.writeDate) : Utility.writeTimeDffCalc(item.writeDt)}</div>
      </div>
      {disableMoreButton && <div className='moreBtn' onClick={() => moreBoxClick(index)}>
        <img className="moreBoxImg" src={`${IMG_SERVER}/mypage/dalla/btn_more.png`} alt="더보기" />
        <div ref={(el) => moreRef.current[index] = el} className="isMore hidden">
          {(context.profile.memNo === item.mem_no || context.adminChecker) && <button>수정하기</button>}
          {(isMyProfile || context.profile.memNo === item.mem_no || context.adminChecker) && <button>삭제하기</button>}
          {context.profile.memNo !== item.mem_no && <button onClick={() => openBlockReportPop({memNo: item.mem_no, memNick: item.nickName})}>차단/신고하기</button>}
        </div>
      </div>}
    </ListRow>
  )
};

export default ListRowComponent;

ListRowComponent.defaultProps = {
  disableMoreButton : true  //.moreBtn 태그 노출여부
};