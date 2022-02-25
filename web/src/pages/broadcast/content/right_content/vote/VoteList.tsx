import React, {useState} from 'react';
import Tabmenu from "../component/tabmenu";
import {getVoteList, moveVoteInsStep} from "../../../../../redux/actions/vote";
import {DalbitScroll} from "../../../../../common/ui/dalbit_scroll";
import VoteListItem from "./VoteListItem";
import SubmitBtn from "../../../../../components/ui/submitBtn/SubmitBtn";
import {useDispatch, useSelector} from "react-redux";

const tabMenu = ['진행중인 투표', '마감된 투표']
const VoteList = ({roomInfo, roomNo, roomOwner}) => {
  const [tabType, setTabType] = useState(tabMenu[0])
  const dispatch = useDispatch();
  const voteRdx = useSelector(({vote})=> vote);

  return (
    <>
      <section className="voteTab">
        <Tabmenu data={tabMenu} tab={tabType} setTab={(target)=>{
          if(target === tabType){
            console.log('같은 탭 클릭')
            return;
          }
          dispatch(getVoteList({
            memNo: roomInfo.bjMemNo
            , roomNo: roomNo
            , voteSlct: target === tabMenu[0] ? 's' : 'e'
          }));
          setTabType(target);
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
        <SubmitBtn text='투표 만들기' onClick={()=>{
          dispatch(moveVoteInsStep());
        }}/>
      }
    </>
  );
};

export default VoteList;
