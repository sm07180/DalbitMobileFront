import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";

import Api from 'context/api'

import Utility from 'components/lib/utility'
import {PHOTO_SERVER} from 'context/config'

import moment from "moment";
import ListNone from 'components/ui/listNone/ListNone'

import "../style.scss";
import {useSelector} from "react-redux";

export default function GotoMoonRanking(props) {
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {moonNumber, endDate} = props
  const history = useHistory();

  const [eventEnding, setEventEnding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [myRank, setMyRank] = useState({});
  const [rankingList, setRankingList] = useState([]);

  const totalPage = useRef(1);
  const myMemNo = useRef(0);
  const pagePerCnt = useRef(30);
  const listLength = useRef(0);
  const goMyRankFlag = useRef({do:false, link: ""});

  let todayIs = new Date;
  let todayDate = moment(todayIs).format("YYYY-MM-DD");
  let eventEnd = moment(endDate).format("YYYY-MM-DD");

  const gotomoonEventMyRank = async () => {
    if(moonNumber !== 0) {
      const { data, message } = await Api.getMoonLandMyRank({
        moonNo: moonNumber
      });
      if (message === "SUCCESS") {
        setMyRank(data);
        myMemNo.current = data.mem_no;
      }
    }
  };

  const gotomoonEventRankingList = async () => {
    if(moonNumber !== 0) {
      const { data, message } = await Api.getMoonLandRankList({
        moonNo: moonNumber,
        pageNo : goMyRankFlag.current.do? 1: currentPage,
        pagePerCnt : 5000,
      });
      if (message === 'SUCCESS') {
        totalPage.current = Math.ceil(data.cnt / pagePerCnt.current)
        listLength.current = data.cnt;
        setRankingList(data.list);
      }
    }
  };

  let totalRankingList = rankingList.slice(0, (currentPage * 10));

  const scrollEvtHdr = () => {
    if (Utility.isHitBottom()) {
      if(currentPage <= listLength.current/10) {
        setCurrentPage(currentPage + 1);
        totalRankingList = rankingList.slice(0, (currentPage * 10));
      }
    }
  }
  useLayoutEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  useEffect(() => {
    gotomoonEventMyRank();
    gotomoonEventRankingList();

    if(moment(todayDate).isAfter(eventEnd)) {
      setEventEnding(true);
    }
  }, [moonNumber, endDate])

  const goMyRankList = (event) => {
    const link = event.target.dataset.link;
    if(myRank.my_rank_no !== 0){
      setCurrentPage(Math.ceil(myRank.my_rank_no / 10));
    } else {
      setCurrentPage(1);
    }
    totalRankingList = rankingList.slice(0, (currentPage * 10));
    setTimeout(() => {
      const scrollTo = document.getElementById(link);
      if(scrollTo) {
        scrollTo.scrollIntoView({ behavior: "smooth", block: "center"});
      } else {
        totalRankingList = rankingList.slice(0, 1);
      }
    })
  }

  return (
    <div id="ranking">
      <div className="myData">
        <div className="myRankWrap">
          <div className="myRankList" data-link={myMemNo.current} onClick={goMyRankList}>
            <div className="listFront">
              <span className="listFrontText">?????????</span>
              <span className="badgeMyRank">{myRank.my_rank_no === 0 ? "-" : myRank.my_rank_no}</span>
            </div>
            <div className="thumbWrap">
              <div className="thumbImg" style={{backgroundImage: `url(
              ${myRank.image_profile ?
                `${PHOTO_SERVER}${myRank.image_profile}?120x120`
                :
                  `${PHOTO_SERVER}/profile_3/profile_${globalState.profile.gender === "m" ? "m" : "f"}_200327.jpg`
              })`
              }}/>
            </div>
            <div className="listContent">
              <div className="listRow">
                <div className="badgeGroup">
                  <span className="badgeMyLevel">Lv{myRank.mem_level}</span>
                </div>
                <span className="nickName">{myRank.mem_nick}</span>
              </div>
            </div>
            <div className="listBack">
              <span className="iconCoin"></span>
              <span className="coinScore">{Utility.addComma(myRank.rank_pt)}</span>
            </div>
          </div>
        </div>
        <div className={`aniWrap level${myRank.rank_step === 0 ? "6" : myRank.rank_step}`}>
          <div className="scoreWrap">
            <span className="iconCoin"></span>
            <span className="scoreNow">{Utility.addComma(myRank.rank_pt)}</span>
            <span className="scoreGoal">/ {Utility.addComma(myRank.tot_score)}</span>
          </div>
          {
            myRank.rank_step !== 0 ?
              <div className="rewardWrap">
                <span className="rewardText">????????????</span>
                <div className="rewardBox">
                  <span className="iconDal"></span>
                  <span className="rewardVal">{myRank.next_reward}</span>
                  <span className="rewardUnit">???</span>
                </div>
              </div>
              :
              <></>
          }
        </div>
      </div>

      <div className="rankingData">
        {
          totalRankingList.length !== 0 ?
            <div className="rankingWrap">
              {
                totalRankingList.map((item, index) => {
                    const { image_profile, mem_nick, rank_pt, rank_num, mem_sex, mem_no } = item;
                    let eventReward = 0;
                    if(rank_num === 1) {eventReward = 2000;}
                    else if(rank_num === 2) {eventReward = 1000;}
                    else if(rank_num <= 5) {eventReward = 500;}
                    else if(rank_num <= 10) {eventReward = 300;}
                    else if(rank_num <= 20) {eventReward = 200;}
                    else if(rank_num <= 30) {eventReward = 100;}

                    return (
                      <div className={`rankingList`} key={index} id={mem_no} onClick={() => {history.push(`/profile/${mem_no}`)}}>
                        <div className="listFront">
                          <span className={`badgeRanking ${rank_num > 30 ? "" : "top30"}`}>{rank_num}</span>
                        </div>
                        <div className="thumbWrap">
                          <div className="thumbImg" style={{backgroundImage: `url(
                            ${image_profile ?
                              `${PHOTO_SERVER}${image_profile}?120x120`
                              :
                              `${PHOTO_SERVER}/profile_3/profile_${mem_sex === "m" ? "m" : "f"}_200327.jpg`
                            })`}}/>
                        </div>
                        <div className="listContent">
                          {(rank_num <= 30 && rank_num > 0) &&
                            <div className="listRow">
                              <span className="provide">
                                <strong>{Utility.addComma(eventReward)}???</strong>?????? {eventEnding ? "??????!" : "??????!"}
                              </span>
                            </div>
                          }
                          <div className="listRow">
                            <div className="badgeGroup">
                              <span className={`${mem_sex === "m" ? "badgeMale" : "badgeFemale"}`}></span>
                            </div>
                            <span className="nickName">{mem_nick}</span>
                          </div>
                        </div>
                        <div className="listBack">
                          <span className="iconCoin"></span>
                          <span className="coinScore">{Utility.addComma(rank_pt)}</span>
                        </div>
                      </div>
                    );
                })
              }
            </div>
            :
            <div className="rankingWrap">
              <ListNone/>
            </div>
          }
      </div>
    </div>
  );
}
