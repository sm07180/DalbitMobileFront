import React, {Dispatch, SetStateAction} from 'react'
import {VoteResultType} from "../../../../../redux/types/voteType";
import {useDispatch, useSelector} from "react-redux";
import {getVoteDetailList, getVoteSel} from "../../../../../redux/actions/vote";
import Utility from "../../../../../components/lib/utility";

const Voting = (props: VoteResultType & { setTemp: Dispatch<SetStateAction<string>> }) => {
  const memberRdx = useSelector((state) => state.member);
  const dispatch = useDispatch();
  const {setTemp} = props;

  const listClick = () => {
    dispatch(getVoteSel({
      roomNo: props.roomNo
      , memNo: props.memNo
      , voteNo: props.voteNo
    }))
    dispatch(getVoteDetailList({
      roomNo: props.roomNo
      , voteNo: props.voteNo
      , memNo: props.memNo
      , pmemNo: memberRdx.memNo
    }))
    setTemp('content');
  }

  const hour = props.endDate.time.hour < 10 ? '0' + props.endDate.time.hour : props.endDate.time.hour;
  const minute = props.endDate.time.minute < 10 ? '0' + props.endDate.time.minute : props.endDate.time.minute;
  return (
    <>
      <div className="voteList" onClick={listClick}>
        <div className="listInfo">
          <div className="listItem">
            <span className="voteOn">진행중</span>
            {props.voteTitle}
          </div>
          <div className="listItem countBox">
            <div className="num">
              <span className="icon"/>
              <p><span>{Utility.addComma(props.voteMemCnt)}</span>명 참여</p>
            </div>
            <div className="due">
              <span>{hour}:{minute}</span> 마감예정
            </div>
          </div>
        </div>
        <div className="time">
          <span className="icon"/>
          60분
        </div>
      </div>
    </>
  )
}

export default Voting;
