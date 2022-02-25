import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Utility from "../../../../../components/lib/utility";
import {delVote, insMemVote, setSelVoteItem} from "../../../../../redux/actions/vote";
import {Timer} from "./Timer";
import {DalbitScroll} from "../../../../../common/ui/dalbit_scroll";
import SubmitBtn from "../../../../../components/ui/submitBtn/SubmitBtn";

const VoteContent = () => {
  const dispatch = useDispatch();

  const memberRdx = useSelector((state) => state.member);
  const voteRdx = useSelector(({vote})=> vote);

  const [more, setMore] = useState(false);
  const {hour, minute, isDone} = Timer({endDate:voteRdx.voteSel.endDate});

  return (
    <>
      <DalbitScroll width={338}>
        <>
          <section className="voteTitleWrap">
            <h2>{voteRdx.voteSel.voteTitle}</h2>
            <div className="countBox">
              <div className="num">
                <span className="icon"/>
                <p><span>{Utility.addComma(voteRdx.voteSel.voteMemCnt)}</span>명 참여</p>
              </div>
              <div className="due">
                <span>{hour}:{minute}</span> {isDone ? '마감' : '마감예정'}
              </div>
            </div>
            {
              memberRdx.memNo === voteRdx.voteSel.memNo &&
              <div className="moreBtn" onClick={()=>{
                setMore(!more)
              }}>
                {
                  more &&
                  <div className="isMore">
                    {
                      !isDone && voteRdx.voteSel.voteEndSlct === 's' &&
                      <button onClick={()=>{
                        console.log('마감하기')
                      }}>마감하기</button>
                    }
                    <button onClick={()=>{
                      dispatch(delVote(voteRdx.voteSel))
                    }}>삭제하기</button>
                  </div>
                }
              </div>
            }
          </section>
          {
            voteRdx.voteDetailList &&
            <section className='optionWrap'>
              {
                voteRdx.voteDetailList.map((item, index)=>
                  <div className={`optionBox ${voteRdx.selVoteItem.itemNo === item.itemNo ? 'active' : ''}`} key={index} onClick={()=>{
                    if(isDone && voteRdx.voteSel.voteEndSlct !== 's'){
                      return;
                    }
                    dispatch(setSelVoteItem(item));
                  }}>
                    <div>{(index+1)<10 ? '0'+(index+1) : index+1}</div>
                    <span>{item.voteItemName}</span>
                  </div>
                )
              }
            </section>
          }
        </>
      </DalbitScroll>
      <TimeSection/>
      <SubmitBtn text='투표하기' onClick={()=>{
        if(isDone){
          console.log('진행중 아님, done')
          return;
        }
        if(voteRdx.voteSel.voteEndSlct !== 's'){
          console.log('진행중 아님')
          return;
        }
        if(!voteRdx.selVoteItem.itemNo){
          console.log('선택한거없음')
          return;
        }
        dispatch(insMemVote({
          voteNo: voteRdx.voteSel.voteNo
          , roomNo: voteRdx.voteSel.roomNo
          , memNo: voteRdx.voteSel.memNo
          , pmemNo: memberRdx.memNo
          , itemNo: voteRdx.selVoteItem.itemNo
          , voteItemName: voteRdx.selVoteItem.voteItemName
        }));
      }}/>


    </>
  );
};
const TimeSection = ()=>{
  const voteRdx = useSelector(({vote})=> vote);
  const {hour, minute, time, unitKor, isDone} = Timer({endDate:voteRdx.voteSel.endDate});

  if(isDone){
    return <></>
  }
  return(
    <section className="timeCheckWrap">
      <div className="timeCheck">
        <span className="icon"/>
        <span>{time}</span>{unitKor} 뒤 마감
      </div>
    </section>
  )
}

export default VoteContent;
