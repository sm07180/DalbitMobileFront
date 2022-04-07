import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {IMG_SERVER} from "context/config";
import ListRow from "components/ui/listRow/ListRow";
import {Context} from "context";
import Utility from "components/lib/utility";

const ListRowComponent = (props) => {
  const {type, item, isMyProfile, index, photoClick, openBlockReportPop, disableMoreButton, modifyEvent, deleteEvent } = props;
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
    <ListRow photo={item.profImg?.thumb292x292} photoClick={photoClick}>
      <div className="listContent">
        <div className='listItem'>
          {item.viewOn === 0 && <div className="lock" />}
          <div className="nick">{item.mem_nick ? item.mem_nick : item.nickName}</div>
        </div>
        <div className="time">{item.ins_date ? Utility.writeTimeDffCalc(item.ins_date) : item.writeDate ? Utility.writeTimeDffCalc(item.writeDate) : item.writeDt && Utility.writeTimeDffCalc(item.writeDt)}</div>
      </div>
      <div className="listBack">
        {disableMoreButton && <div className='moreBtn' onClick={() => moreBoxClick(index)}>
          <img className="moreBoxImg" src={`${IMG_SERVER}/mypage/dalla/btn_more.png`} alt="더보기" />
          <div ref={(el) => moreRef.current[index] = el} className="isMore hidden">
            {type !=='fanBoard' && (context.profile.memNo === item.mem_no.toString()) && <button onClick={modifyEvent}>수정하기</button>}
            {(isMyProfile || context.profile.memNo === item.mem_no || (type==='feed' && context.adminChecker)) && <button onClick={deleteEvent}>삭제하기</button>}
            {context.profile.memNo !== item.mem_no.toString() && <button onClick={() => openBlockReportPop({memNo: item.mem_no, memNick: item.nickName})}>차단/신고하기</button>}
          </div>
        </div>}
      </div>
    </ListRow>
  )
};

export default ListRowComponent;

ListRowComponent.defaultProps = {
  disableMoreButton : true,  // .moreBtn 태그 노출여부
  type: null,

  modifyEvent: ()=>{},  // 수정 이벤트
  deleteEvent: ()=>{},  // 삭제 이벤트
};