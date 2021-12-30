import React, {useState, useLayoutEffect, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {Context} from 'context'

import Api from 'context/api'

import Utility, {addComma , isHitBottom} from 'components/lib/utility'

import moment from "moment";
import NoResult from 'components/ui/new_noResult'

import "../style.scss";

export default function GotoMoonRanking(props) {
  const {moonNumber, endDate} = props
  const history = useHistory();
  const globalCtx = useContext(Context)

  const [eventEnding, setEventEnding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [myRank, setMyRank] = useState({});
  const [rankingList, setRankingList] = useState([]);

  const totalPage = useRef(1);
  //let totalPage = 1;
  let pagePerCnt = 10;  
  let todayIs = new Date;
  let todayDate = moment(todayIs).format("YYYY-MM-DD");
  let eventEnd = moment(endDate).format("YYYY-MM-DD");  

  const gotomoonEventMyRank = async () => {
    if(moonNumber !== 0) {
      const { data, message } = await Api.gotomoonMyRank({
        moonNo: moonNumber
      });
      if (message === "SUCCESS") {
        setMyRank(data);
      }
    }    
  };
  
  const gotomoonEventRankingList = async () => {
    if(moonNumber !== 0) {
      const { data, message } = await Api.gotomoonRankingList({
        moonNo: moonNumber,
        pageNo : currentPage,
        pagePerCnt : pagePerCnt,
      });
      if (message === 'SUCCESS') {
        totalPage.current = Math.ceil(data.cnt / pagePerCnt)
  
        if(currentPage === 1){
          setRankingList(data.list)
        }else{
          const datas = rankingList.concat(data.list);
          setRankingList(datas)
        }
      }
    }    
  };

  const scrollEvtHdr = () => {
    if (totalPage.current > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
    }
  }
  useLayoutEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage > 0) gotomoonEventRankingList();
  }, [currentPage])

  useEffect(() => {
    gotomoonEventMyRank();
    gotomoonEventRankingList();

    if(moment(todayDate).isAfter(eventEnd)) {
      setEventEnding(true);
    }
  }, [moonNumber, endDate])


  return (
    <div id="ranking">
      <div className="myData">
        <div className="myRankWrap">
          <div className="myRankList">
            <div className="listFront">
              <span className="listFrontText">내순위</span>
              <span className="badgeMyRank">{myRank.my_rank_no === 0 ? "-" : myRank.my_rank_no}</span>
            </div>
            <div className="thumbWrap">
              <div className="thumbImg" style={{backgroundImage: `url(
              ${myRank.image_profile ?
                `https://photo.dalbitlive.com${myRank.image_profile}?120x120`
                :
                `https://photo.dalbitlive.com/profile_3/profile_m_200327.jpg`
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
        <div className={`aniWrap level${myRank.rank_step}`}>
          <div className="scoreWrap">
            <span className="iconCoin"></span>
            <span className="scoreNow">{Utility.addComma(myRank.rank_pt)}</span>
            <span className="scoreGoal">/ {Utility.addComma(myRank.tot_score)}</span>
          </div>
          <div className="rewardWrap">
            <span className="rewardText">다음보상</span>
            <div className="rewardBox">
              <span className="iconDal"></span>
              <span className="rewardVal">{myRank.next_reward}</span>
              <span className="rewardUnit">달</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rankingData">
        {
          rankingList.length !== 0 ?
            <div className="rankingWrap">
              {
                rankingList.map((item, index) => {
                    const { image_profile, mem_nick, rank_pt, rank_num, mem_sex, mem_no } = item;
                    let eventReward = 0;
                    if(rank_num === 1) {eventReward = 5000;}
                    else if(rank_num === 2) {eventReward = 3000;}
                    else if(rank_num <= 5) {eventReward = 1000;}
                    else if(rank_num <= 10) {eventReward = 500;}
                    else if(rank_num <= 20) {eventReward = 300;}
                    else if(rank_num <= 30) {eventReward = 100;}

                    return (
                      <div className="rankingList" key={index} onClick={() => {history.push(`/mypage/${mem_no}`)}}>
                        <div className="listFront">
                          <span className={`badgeRanking ${rank_num > 30 ? "" : "top30"}`}>{rank_num}</span>
                        </div>
                        <div className="thumbWrap">
                          <div className="thumbImg" style={{backgroundImage: `url(
                            ${image_profile ?
                              `https://photo.dalbitlive.com${image_profile}?120x120`
                              :
                              `https://photo.dalbitlive.com/profile_3/profile_${mem_sex === "m" ? "m" : "f"}_200327.jpg`
                            })`}}/>
                        </div>
                        <div className="listContent">
                          {(rank_num <= 30 && rank_num > 0) &&
                            <div className="listRow">
                              <span className="provide">
                                <strong>{Utility.addComma(eventReward)}달</strong>지급 {eventEnding ? "완료!" : "예정!"}
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
              <NoResult type="default" text="해당 내역이 없습니다." />
            </div>
          }        
      </div>
    </div>
  );
}
