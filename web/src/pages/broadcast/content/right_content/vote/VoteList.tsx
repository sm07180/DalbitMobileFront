import React from 'react';
import Tabmenu from "../component/tabmenu";
import {moveVoteInsStep, moveVoteListStep} from "../../../../../redux/actions/vote";
import {DalbitScroll} from "../../../../../common/ui/dalbit_scroll";
import VoteListItem from "./VoteListItem";
import SubmitBtn from "../../../../../components/ui/submitBtn/SubmitBtn";
import {useDispatch, useSelector} from "react-redux";
import {VoteSlctKor} from "../../../../../redux/types/voteType";

const VoteList = ({roomInfo, roomNo, roomOwner}) => {
  const dispatch = useDispatch();
  const voteRdx = useSelector(({vote})=> vote);
  const submitButtonProps = {
    text: '투표 만들기',
    state: voteRdx.voteList.list.length >= 5 ? 'disabled' : ''
  }

  return (
    <>
      <section className="voteTab">
        <Tabmenu data={[VoteSlctKor.S, VoteSlctKor.E]} tab={voteRdx.voteTab} setTab={(target)=>{
          // 같은 탭 클릭
          if(target === voteRdx.voteTab) return;

          dispatch(moveVoteListStep({
            memNo: roomInfo.bjMemNo
            , roomNo: roomNo
            , voteSlct: target === VoteSlctKor.S ? 's' : 'e'
          }));
        }} />
      </section>
      <section className="contentWrap">
        <DalbitScroll width={338}>
          <>
            {
              voteRdx.voteList.list.map((item, index) =>
                <VoteListItem {...item} key={index}/>)
            }
          </>
        </DalbitScroll>
      </section>
      {
        roomOwner && voteRdx.voteTab === VoteSlctKor.S  &&
        <SubmitBtn {...submitButtonProps} onClick={()=>{
          // 투표는 동시에 5개까지 진행할 수 있어요.
          dispatch(moveVoteInsStep());
        }}/>
      }
    </>
  );
};

export default VoteList;
