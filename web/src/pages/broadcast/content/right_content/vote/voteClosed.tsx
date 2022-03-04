import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {VoteResultType} from "../../../../../redux/types/voteType";
import Utility from "../../../../../components/lib/utility";
import {moveVoteStep} from "../../../../../redux/actions/vote";
import {Timer} from "./Timer";

//@Deprecated
const VoteClosed =(props: VoteResultType)=>{
  const memberRdx = useSelector((state) => state.member);
  const dispatch = useDispatch();
  const listClick = () => {
    dispatch(moveVoteStep(props));
  }

  const {hour, minute, time, unitKor} = Timer({endDate:props.endDate});

  return(
    <div className="voteList" onClick={listClick}>
      <div className="listInfo">
        <div className="listItem">
          {props.voteTitle}
        </div>
        <div className="listItem countBox">
          <div className="num">
            <span className="icon"/>
            <p><span>{Utility.addComma(props.voteMemCnt)}</span>명 참여</p>
          </div>
          <div className="due">
            <span>{hour}:{minute}</span>
          </div>
        </div>
      </div>
      <div className="time end">
        <span className="icon"/>
        마감
      </div>
    </div>
  )
}

export default VoteClosed;
