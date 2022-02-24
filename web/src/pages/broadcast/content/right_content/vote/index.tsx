// React
import React, {useState} from "react";

// global Component
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import InputItems from 'components/ui/inputItems/InputItems'
import { DalbitScroll } from "common/ui/dalbit_scroll";

// component
import Tabmenu from '../component/tabmenu'
import VotingList from './votingList'
import VoteClosed from "./voteClosed";
import MakeVote from "./MakeVote";
import VoteContent from "./voteContent";

// style
import "./index.scss";

const tabmenu = ['진행중인 투표', '마감된 투표']

const Vote = ({ roomNo }) => {
  const [tabType, setTabType] = useState(tabmenu[0])
  const [makeVote, setMakeVote] = useState(false);
  const [roomOwner, setRoomOwner] = useState(true);
  const [temp, setTemp] = useState("list");

  return (
    <div id="vote">
      {makeVote !== true ?
        <>
          {temp === 'list' ?
            <>
              <section className="voteTab">
                <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
              </section>
              <section className="contentWrap">
                {tabType === tabmenu[0] ?
                  <DalbitScroll width={338}>
                    <VotingList setTemp={setTemp}/>
                  </DalbitScroll>
                :
                  <DalbitScroll width={338}>
                    <VoteClosed />
                  </DalbitScroll>
                }
              </section>
              {roomOwner && <SubmitBtn text='투표 만들기' onClick={()=>{setMakeVote(true)}}/> }
            </>
           : 
            <>
              <DalbitScroll width={338}>
                <VoteContent />
              </DalbitScroll>
              <section className="timeCheckWrap">
                <div className="timeCheck">
                  <span className="icon"></span>
                  <span>56</span>분 뒤 마감
                </div>
              </section>
              <SubmitBtn text='투표하기'/>
            </>
          }
        </>
       :
        <>
          <section className="titleInput">
            <InputItems>
              <input type="text" maxLength={20} placeholder='투표의 제목을 입력해주세요.'/>
            </InputItems>
          </section>
          <span className="subTitle">보기</span>
          <section className="makeVoteWrap">
            <DalbitScroll width={338}>
              <MakeVote />
            </DalbitScroll>
          </section>
          <section className="deadlineWrap">
            <div>
              마감 시간 설정 <span>( 최대 60분 )</span>
            </div>
            <InputItems>
              <input type="text" placeholder="직접 입력" />
              <span>분 뒤</span>
            </InputItems>
          </section>
          <SubmitBtn text='완료'/>
        </>
      }
    </div>
  )
};

export default Vote;