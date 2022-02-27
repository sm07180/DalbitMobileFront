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
    state: voteRdx.voteTab === VoteSlctKor.S && voteRdx.voteList.list.length >= 5 ? 'disabled' : ''
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
        roomOwner &&
        <SubmitBtn {...submitButtonProps} onClick={()=>{
          dispatch(moveVoteInsStep());
        }}/>
      }
    </>
  );
};

export default VoteList;
