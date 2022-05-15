import React from 'react';
import Utility from "components/lib/utility";
// global components
import ListRow from "../../../components/ui/listRow/ListRow";
// components
import MoreBtn from "../../../components/ui/moreBtn/MoreBtn";
import {useSelector} from "react-redux";

const ListRowComponent = (props) => {
  const {item, index, type, isMyProfile, openSlidePop, modifyEvent, deleteEvent, photoClick, disableMoreButton} = props;
  const globalState = useSelector(({globalCtx}) => globalCtx);

  {/* 차단/신고하기 */}
  const openBlockReport = (e) => {
    const nickNm = type === 'feed' ? item.mem_nick : item.nickName;
    openSlidePop(e, {memNo: item.mem_no, nickNm });
  }

  return (
    <ListRow photo={item.profImg?.thumb292x292} photoClick={photoClick}>
      <div className="listContent" onClick={photoClick}>
        <div className='listItem'>
          {item.viewOn === 0 && <div className="lock" />}
          <div className="nick">{item.mem_nick ? item.mem_nick : item.nickName}</div>
        </div>
        <div className="time">{item.ins_date ? Utility.writeTimeDffCalc(item.ins_date) : item.writeDate ? Utility.writeTimeDffCalc(item.writeDate) : item.writeDt && Utility.writeTimeDffCalc(item.writeDt)}</div>
      </div>
      <div className="listBack">
        {disableMoreButton && 
        <MoreBtn index={index}>
          {type !=='fanBoard' && (globalState.profile.memNo === item.mem_no.toString()) && 
            <button onClick={modifyEvent}>수정하기</button>
          }
          {(isMyProfile || globalState.profile.memNo === item.mem_no || (type==='feed' && globalState.adminChecker)) && 
            <button onClick={deleteEvent}>삭제하기</button>
          }
          {globalState.profile.memNo !== item.mem_no.toString() && 
            <button data-target-type="block" onClick={openBlockReport}>차단/신고하기</button>
          }
        </MoreBtn>}
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
