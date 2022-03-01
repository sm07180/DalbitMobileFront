import React from 'react'
import {VoteResultType} from "../../../../../redux/types/voteType";
import {useDispatch} from "react-redux";
import {moveVoteStep} from "../../../../../redux/actions/vote";
import Utility from "../../../../../components/lib/utility";
import {Timer} from "./Timer";

const VoteListItem = (props: VoteResultType) => {
  const dispatch = useDispatch();

  const listClick = () => {
    dispatch(moveVoteStep(props));
  }

  const {hour, min, time, unitKor, isTimeOver} = Timer({endDate:props.endDate});

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
            <span>{hour}:{min}</span> {isTimeOver || props.voteEndSlct === 'e' ? '마감' : '마감예정'}
          </div>
        </div>
      </div>
      {
        !isTimeOver && props.voteEndSlct === 's' &&
        <div className={`time`}>
          <span className="icon"/>
          {time}{unitKor}
        </div>
      }
    </div>
  )
}

export default VoteListItem;
