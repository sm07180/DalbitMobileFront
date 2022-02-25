import React from 'react'
import {VoteResultType} from "../../../../../redux/types/voteType";
import {useDispatch, useSelector} from "react-redux";
import {moveVoteStep} from "../../../../../redux/actions/vote";
import Utility from "../../../../../components/lib/utility";
import {Timer} from "./Timer";

const VoteListItem = (props: VoteResultType) => {
  const memberRdx = useSelector((state) => state.member);
  const dispatch = useDispatch();

  const listClick = () => {
    dispatch(moveVoteStep(props));
  }

  const {hour, minute, time, unitKor, isTimeOver} = Timer({endDate:props.endDate});

  return (
    <div className="voteList" onClick={listClick}>
      <div className="listInfo">
        <div className="listItem">
          {
            props.voteEndSlct === 's' &&
            <span className="voteOn">진행중</span>
          }
          {props.voteTitle}
        </div>
        <div className="listItem countBox">
          <div className="num">
            <span className="icon"/>
            <p><span>{Utility.addComma(props.voteMemCnt)}</span>명 참여</p>
          </div>
          <div className="due">
            <span>{hour}:{minute}</span> {isTimeOver ? '마감' : '마감예정'}
          </div>
        </div>
      </div>
      {
        !isTimeOver &&
        <div className={`time ${props.voteEndSlct === 'e' ? 'end' : ''}`}>
          <span className="icon"/>
          {time}{unitKor}
        </div>
      }
    </div>
  )
}

export default VoteListItem;
