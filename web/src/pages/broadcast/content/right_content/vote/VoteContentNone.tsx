import React from 'react';
import {useDispatch} from "react-redux";
import {moveVoteListStep} from "../../../../../redux/actions/vote";
import {DalbitScroll} from "../../../../../common/ui/dalbit_scroll";

const VoteContentNone = ({roomInfo, roomNo}) => {
  const dispatch = useDispatch();
  return (
    <DalbitScroll width={338}>
      <>
        <h3 className="tabTitle">
          <button className="back" onClick={()=>{
            dispatch(moveVoteListStep({
              memNo:roomInfo.bjMemNo,
              roomNo: roomNo,
              voteSlct: 's'
            }));
          }}/>
          투표
        </h3>
        <section className="voteTitleWrap">
          투표 정보를 불러 올 수 없습니다.<br/>
          새로고침 후 이용 부탁드립니다.
        </section>
      </>
    </DalbitScroll>
  );
};

export default VoteContentNone;
