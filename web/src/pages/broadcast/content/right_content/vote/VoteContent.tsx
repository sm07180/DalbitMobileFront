import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Utility from "../../../../../components/lib/utility";
import {
  delVote,
  endVote,
  insMemVote,
  moveVoteListStep,
  moveVoteStep,
  setVoteSel
} from "../../../../../redux/actions/vote";
import {Timer} from "./Timer";
import {DalbitScroll} from "../../../../../common/ui/dalbit_scroll";
import SubmitBtn from "../../../../../components/ui/submitBtn/SubmitBtn";
import {VoteResultType, VoteSlctKor} from "../../../../../redux/types/voteType";
import {initVoteSel} from "../../../../../redux/reducers/vote";

const VoteContent = ({roomOwner}) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const memberRdx = useSelector((state) => state.member);
  const voteRdx = useSelector(({vote})=> vote);

  const [more, setMore] = useState(false);
  const {hour, minute, isTimeOver, time, unitKor} = Timer({endDate:voteRdx.voteSel.endDate});

  const [selVote, setSelVote] = useState<VoteResultType>(initVoteSel);

  useEffect(()=>{
    if(isTimeOver && voteRdx.voteSel.voteEndSlct === 's'){
      setSelVote(initVoteSel);
    }
  }, [isTimeOver])

  const submitButtonProps = {
    text: isTimeOver || voteRdx.voteSel.voteEndSlct === 'e' ?
      '투표마감'
      : voteRdx.voteDetailList.filter(f=>f.voteNo === voteRdx.selVoteItem.voteNo).length > 0 ?
        '다시 투표하기' : '투표하기',
    state: isTimeOver || voteRdx.voteSel.voteEndSlct === 'e' || !selVote.voteNo ? 'disabled' : ''
  }

  const optionBoxActiveClassNames = (item:VoteResultType):string=> {
    if (voteRdx.voteSel.voteEndSlct === 's') {
      return isTimeOver ? `optionBox` : `optionBox ${selVote.itemNo === item.itemNo ? 'active' : ''}`
    } else if (isTimeOver || voteRdx.voteSel.voteEndSlct === 'e') {
      return `optionBox ${item.rank === 1 ? 'active' : ''}`
    } else {
      return ``;
    }
  };
  const detailList = voteRdx.voteSel.voteEndSlct === 's' ?
    voteRdx.voteDetailList
    : voteRdx.voteDetailList.sort((a,b)=>a.rank-b.rank);

  return (
    <>
      <DalbitScroll width={338}>
        <>
          <h3 className="tabTitle">
            <button className="back" onClick={()=>{
              dispatch(moveVoteListStep({
                memNo:voteRdx.voteSel.memNo,
                roomNo: voteRdx.voteSel.roomNo,
                voteSlct: voteRdx.voteTab === VoteSlctKor.S ? 's' : 'e'
              }));
            }}/>
            투표
          </h3>
          <section className="voteTitleWrap">
            <h2>{voteRdx.voteSel.voteTitle}</h2>
            <div className="countBox">
              <div className="num">
                <span className="icon"/>
                <p><span>{Utility.addComma(voteRdx.voteSel.voteMemCnt)}</span>명 참여</p>
              </div>
              <div className="due">
                <span>{hour}:{minute}</span> {isTimeOver || voteRdx.voteSel.voteEndSlct === 'e' ? '마감' : '마감예정'}
              </div>
            </div>
            {
              memberRdx.memNo === voteRdx.voteSel.memNo &&
              !isTimeOver &&
              voteRdx.voteSel.voteEndSlct === 's' &&
              <div className="moreBtn" onClick={()=>{
                setMore(!more)
              }}>
                {
                  more &&
                  <div className="isMore">
                    <button onClick={()=>{
                      dispatch(endVote({
                        ...voteRdx.voteSel
                        , endSlct: 'o'
                      }))
                    }}>마감하기</button>
                    <button onClick={()=>{
                      dispatch(delVote(voteRdx.voteSel))
                    }}>삭제하기</button>
                  </div>
                }
              </div>
            }
          </section>
          {
            detailList &&
            <section className='optionWrap'>
              {
                detailList.map((item, index)=>{
                  return (
                    <div className={`${optionBoxActiveClassNames(item)}`} key={index} onClick={()=>{
                      if(isTimeOver || voteRdx.voteSel.voteEndSlct !== 's'){
                        return;
                      }
                      setSelVote(item);
                    }}>
                      <div className={`number`}>
                        {
                          voteRdx.voteSel.voteEndSlct === 's' ?
                            (index+1)<10 ? '0'+(index+1) : index+1
                            : `${item.rank}위`
                        }
                      </div>
                      <span>{item.voteItemName}</span>
                      <div className={`counterBox ${voteRdx.selVoteItem.itemNo === item.itemNo ? 'active' : ''}`}>
                        <span className="person"/>
                        <p>{item.voteMemCnt}</p>
                      </div>
                    </div>
                  )
                })
              }
            </section>
          }
        </>
      </DalbitScroll>

      {
        !isTimeOver &&
        voteRdx.voteSel.voteEndSlct === 's' &&
        <section className="timeCheckWrap">
          <div className="timeCheck">
            <span className="icon"/>
            <span>{time}</span>{unitKor} 뒤 마감
          </div>
        </section>
      }
      <section className="btnWrap">
        {
          roomOwner && voteRdx.voteSel.voteEndSlct === 's' &&
          <button className="btnRefresh" onClick={()=>{
            dispatch(moveVoteStep(voteRdx.voteSel));
          }}/>
        }

        <SubmitBtn {...submitButtonProps} onClick={()=>{
          // 시간초과
          if(isTimeOver) return;
          // 진행중 아님
          if(voteRdx.voteSel.voteEndSlct !== 's') return;
          // 선택한거없음
          if(!selVote.itemNo) return;
          // 같은거 선택
          if(selVote.itemNo === voteRdx.selVoteItem.itemNo) return;
          // 어드민 투표 안됨
          if(globalState.shadowAdmin) return;
          dispatch(insMemVote({
            voteNo: voteRdx.voteSel.voteNo
            , roomNo: voteRdx.voteSel.roomNo
            , memNo: voteRdx.voteSel.memNo
            , pmemNo: memberRdx.memNo
            , itemNo: selVote.itemNo
            , voteItemName: selVote.voteItemName
          }));
        }}/>
      </section>
    </>
  );
};

export default VoteContent;
