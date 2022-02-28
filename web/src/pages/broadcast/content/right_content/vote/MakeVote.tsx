import React from 'react';

import InputItems from 'components/ui/inputItems/InputItems';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import {useDispatch, useSelector} from "react-redux";
import {insVote, moveVoteListStep, setTempInsVote} from "../../../../../redux/actions/vote";
import {DalbitScroll} from "../../../../../common/ui/dalbit_scroll";
import {initTempInsVoteVoteItemNames, MAX_END_TIME, MAX_VOTE_ITEM} from "../../../../../redux/reducers/vote";
import {VoteSlctKor} from "../../../../../redux/types/voteType";

const MakeVote = ({roomInfo, roomNo}) => {
  const voteRdx = useSelector(({vote})=> vote);
  const dispatch = useDispatch();
  const memberRdx = useSelector((state) => state.member);

  const submitButtonProps = {
    text: '완료',
    state:
      voteRdx.tempInsVote.voteTitle.length < 1  ||
      voteRdx.tempInsVote.voteItemNames.length < initTempInsVoteVoteItemNames.length ||
      voteRdx.tempInsVote.voteItemNames.filter(f=>f.length<1).length > 0 ||
      voteRdx.tempInsVote.endTime < 1 ? 'disabled' : ''
  }

  return (
    <>
      <>
        <h3 className="tabTitle">
          <button className="back" onClick={()=>{
            dispatch(moveVoteListStep({
              memNo:roomInfo.bjMemNo,
              roomNo: roomNo,
              voteSlct: voteRdx.voteTab === VoteSlctKor.S ? 's' : 'e'
            }));
          }}/>
          투표 만들기
        </h3>
        <section className="titleInput">
          <InputItems>
            <input type="text" maxLength={20} placeholder='투표의 제목을 입력해주세요.' value={voteRdx.tempInsVote.voteTitle} onChange={event=>{
              dispatch(setTempInsVote({
                ...voteRdx.tempInsVote, voteTitle:event.currentTarget.value
              }))
            }}/>
          </InputItems>
        </section>
        <span className="subTitle">보기</span>
        <section className="makeVoteWrap">
          <DalbitScroll width={338}>
            <>
              {
                voteRdx.tempInsVote.voteItemNames.map((item, index)=>
                  <InputItems key={index}>
                    <div className="number">
                      {(index+1) < 10 ? '0'+(index+1) : index+1}
                    </div>
                    <input type="text" maxLength={15} placeholder={!item ? '내용을 입력해주세요' : ''} value={voteRdx.tempInsVote.voteItemNames[index]} onChange={event => {
                      const copy = [...voteRdx.tempInsVote.voteItemNames];
                      copy[index] = event.currentTarget.value;
                      dispatch(setTempInsVote({
                        ...voteRdx.tempInsVote, voteItemNames:copy
                      }))
                    }}/>
                    <button className="delete" onClick={()=>{
                      if(voteRdx.tempInsVote.voteItemNames.length < initTempInsVoteVoteItemNames.length+1){
                        // 항목 최소 개수 제한
                      }else{
                        const copy = [...voteRdx.tempInsVote.voteItemNames];
                        const voteItemNames = copy.filter((f,i)=>i!==index);
                        dispatch(setTempInsVote({
                          ...voteRdx.tempInsVote, voteItemNames:voteItemNames, voteItemCnt:voteItemNames.length
                        }));
                      }
                    }}/>
                  </InputItems>
                )
              }
              {
                voteRdx.tempInsVote.voteItemNames.length < MAX_VOTE_ITEM &&
                <SubmitBtn text='+ 항목추가' onClick={()=>{
                  const voteItemNames = voteRdx.tempInsVote.voteItemNames.concat('');
                  dispatch(setTempInsVote({
                    ...voteRdx.tempInsVote, voteItemNames:voteItemNames, voteItemCnt:voteItemNames.length
                  }))
                }}/>
              }
            </>
          </DalbitScroll>
        </section>
        <section className="deadlineWrap">
          <div>
            마감 시간 설정 <span>( 최대 {MAX_END_TIME}분 )</span>
          </div>
          <InputItems>
            <input type="tel" placeholder="직접 입력" value={voteRdx.tempInsVote.endTime} onChange={event => {
              if(/^[0-9\b]+$/.test(event.currentTarget.value)){
                const endTime = Number(event.currentTarget.value);
                dispatch(setTempInsVote({
                  ...voteRdx.tempInsVote, endTime: endTime > MAX_END_TIME ? MAX_END_TIME : endTime
                }))
              }
            }}/>
            <span>분 뒤</span>
          </InputItems>
        </section>
        <SubmitBtn {...submitButtonProps} onClick={()=>{
          dispatch(insVote({
            ...voteRdx.tempInsVote,
            memNo: memberRdx.memNo,
            endTime: voteRdx.tempInsVote.endTime * 60,
            // endTime: voteRdx.tempInsVote.endTime,
            roomNo: roomNo
          }));
        }}/>
      </>
    </>
  );
};

export default MakeVote;
