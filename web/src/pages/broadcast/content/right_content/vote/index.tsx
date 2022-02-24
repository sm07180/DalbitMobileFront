// React
import React, {useEffect, useState} from "react";

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
import {useDispatch, useSelector} from "react-redux";
import {getVoteList} from "../../../../../redux/actions/vote";

const tabMenu = ['진행중인 투표', '마감된 투표']

const Vote = ({ roomInfo, roomOwner, roomNo }) => {
  const [tabType, setTabType] = useState(tabMenu[0])
  const [makeVote, setMakeVote] = useState<boolean>(false);
  const [temp, setTemp] = useState("list");
  const voteRdx = useSelector(({vote})=> vote);

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getVoteList({
      memNo: roomInfo.bjMemNo
      , roomNo: roomNo
      , voteSlct: tabType === tabMenu[0] ? 's' : 'e'
    }))
  }, []);

  return (
    <div id="vote">
      {!makeVote &&
      <>
        {temp === 'list' &&
        <>
          <section className="voteTab">
            <Tabmenu data={tabMenu} tab={tabType} setTab={setTabType} />
          </section>
          <section className="contentWrap">
            {tabType === tabMenu[0] ?
              <DalbitScroll width={338}>
                <>
                  {
                    voteRdx.voteList && voteRdx.voteList.list.length > 0 &&
                    voteRdx.voteList.list.map((item, index)=><VotingList {...item} setTemp={setTemp} key={index}/>)
                  }
                </>
              </DalbitScroll>
              :
              <DalbitScroll width={338}>
                <VoteClosed />
              </DalbitScroll>
            }
          </section>
          {roomOwner && <SubmitBtn text='투표 만들기' onClick={()=>{setMakeVote(true)}}/> }
        </>
        }
        {temp !== 'list' &&
        <>
          <DalbitScroll width={338}>
            <VoteContent />
          </DalbitScroll>
          <section className="timeCheckWrap">
            <div className="timeCheck">
              <span className="icon"/>
              <span>56</span>분 뒤 마감
            </div>
          </section>
          <SubmitBtn text='투표하기'/>
        </>
        }
      </>
      }
      { makeVote &&
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
