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
          해당 투표는 DJ에 의해 삭제되었습니다.
        </section>
      </>
    </DalbitScroll>
  );
};

export default VoteContentNone;
