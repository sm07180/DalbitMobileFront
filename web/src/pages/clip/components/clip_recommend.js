import React, {useState, useEffect, useContext, useRef} from 'react'
import {Context} from 'context'
import Api from 'context/api'
import Header from 'components/ui/new_header.js'
import Layout from 'pages/common/layout'
import '../clip.scss'
import { useHistory } from "react-router-dom";
import { convertDateFormat, calcDate } from 'pages/common/rank/rank_fn'

import RankPopup from "./clip_recommend_rank_list";
import {OS_TYPE} from "context/config";
import {clipJoin} from "pages/common/clipPlayer/clip_func";
import NoResult from 'components/ui/new_noResult'

export default function clipRecommend(props) {
  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)
  const history = useHistory();
  const dateState = history.location.state

  const [textView, setTextView] = useState(false)
  const [marketingClipObj, setMarketingClipObj] = useState([]);
  const [marketingClipList, setMarketingClipList] = useState([]);
  const [recDate, setRecDate] = useState(dateState);
  const [topRankList, setTopRankList] = useState([]);
  const [popupState, setPopupState] = useState(false);
  const [clip, setClip] = useState("");

  const viewToggle = () => {
    if (textView === false) {
      setTextView(true)
    } else {
      setTextView(false)
    }
  }
  const fetchMarketingClipList = async () => {
    const { result, data, message } = await Api.getMarketingClipList({
      recDate: recDate
      , isLogin: context.token.isLogin
      , isClick: true
    });
    if (result === "success") {
      setMarketingClipObj(data.recommendInfo)
      setMarketingClipList(data.list);
      setClip(data.recommendInfo.clipNo);

      fetchRankTop(data.recommendInfo.clipNo);
    } else {
      context.action.alert({msg: message})
    }
  };

  const AddFan = (memNo) => {
    async function AddFanFunc(memNo) {
      const { result, data, message } = await Api.fan_change({
        data : {
          memNo: memNo
        },
      });
      if (result === "success") {
        context.action.alert({msg: message})
        fetchMarketingClipList();
      } else {
        context.action.alert({msg: message})
      }
    }
    AddFanFunc(memNo);
  };

  const DeleteFan = (memNo) => {
    async function DeleteFanFunc() {
      const { result, data, message } = await Api.mypage_fan_cancel({
        data : {
          memNo: memNo,
        },
      });
      if (result === "success") {
        context.action.alert({msg: message})
        fetchMarketingClipList();
      } else {
        context.action.alert({msg: message})
      }
    }
    DeleteFanFunc(memNo);
  };

  const fetchRankTop = async(clipNo) => {
    async function getGiftRankTopFunc() {
      const { result, data, message } = await Api.getGiftRankTop({
        clipNo: clipNo,
      });
      if (result === "success") {
        setTopRankList(data.list);
      }
      else {
        setTopRankList([]);
      }
    }
    getGiftRankTopFunc();
  }

  const fetchDataPlay = async (clipNum, type) => {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      if(type === 'dal') {
        localStorage.removeItem('clipPlayListInfo')
      }
      clipJoin(data, context)
    } else {
      if (code === '-99') {
        context.action.alert({
          msg: message,
          callback: () => {
            history.push('/login')
          }
        })
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
  }

  useEffect(() => {
    fetchMarketingClipList();
  },[recDate]);

  useEffect(() => {
    if (context.token.isLogin === false) {
      history.push("/");
    }
  }, [context.token.isLogin]);


  return (
    <Layout status="no_gnb">
      <Header title="달대리 추천 클립" />
      <div id="clipRecommend" className="subContent gray">
        {marketingClipObj && (
          <>
            <div className="topBox">
              <button
                className={`prev ${marketingClipObj.isPrev === false ? " noHover" : "on"}`}
                disabled={marketingClipObj.isPrev === false}
                onClick={() => {
                  const date = calcDate(new Date(recDate), -7);
                  setRecDate(convertDateFormat(date, ""));
                }}>이전</button>
              <strong className="day">{marketingClipObj.month}월 {marketingClipObj.weekNo}주차</strong>
              <button
                className={`next ${marketingClipObj.isNext === false ? " noHover" : "on"}`}
                disabled={marketingClipObj.isNext === false}
                onClick={() => {
                  const date = calcDate(new Date(recDate), 7);
                  setRecDate(convertDateFormat(date, ""));
                }}
              >다음</button>
            </div>
            <div className="play">
              <div className="titleMsgBox">
                {marketingClipObj.titleMsg}
              </div>

              <div className="video">
                {marketingClipObj.videoUrl ? (
                  <object
                    type="text/html"
                    width="360"
                    height="208"
                    data={`https://www.youtube.com/embed/${marketingClipObj.videoUrl}`}></object>
                ):<></>}
              </div>

              <div className="fanBox">
                {marketingClipObj.isFan === true && <button className="fanButton isActive" onClick={() => DeleteFan(marketingClipObj.memNo)}>팬</button>}
                {marketingClipObj.isFan === false && <button className="fanButton" onClick={() => AddFan(marketingClipObj.memNo)}> + 팬등록</button>}
                <button
                  className="fanButton file"
                  onClick={() => history.push(`/mypage/${marketingClipObj.clipMemNo}?tab=2`)}>{marketingClipObj.regCnt}</button>
                <ul className="userProfile">
                  {(topRankList && topRankList.length > 0) &&
                  topRankList.map((v, index) => {
                    return (
                      <li
                        className="userProfile__list"
                        key={index}
                        onClick={() => history.push(`/mypage/${v.memNo}`)}>
                        <img
                          src={v.profImg.thumb62x62}/>
                      </li>
                    )
                  })
                  }
                </ul>
                {topRankList.length > 0 &&
                <button
                  className="fanMore"
                  onClick={() => setPopupState(popupState ? false : true)}>
                  <span className="blind">팬랭킹 더보기</span>
                </button>
                }
              </div>

              <div className="titleBox">
                <span className="category">{marketingClipObj.subjectName}</span>
                <i className="line">구분선</i>
                <span className="playName">{marketingClipObj.title}</span>
              </div>

              <p className="nickName">{marketingClipObj.nickNm}</p>

              <div className="text">
                <div className={`playInfo ${textView ? `isActive` : ``}`}>
                  <div className="text">
                    {marketingClipObj.descMsg}
                  </div>
                  <button className={`more ${textView && "on"}`} onClick={() => viewToggle()}>
                    더보기
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <h3 className="listTitle">
        추천 클립 목록
        {/*<button className="allPlay">전체듣기</button>*/}
        </h3>
        {marketingClipList.length > 0 ? (
          <ul className="itemBox">
            {marketingClipList.map((v, i) => {
              return (
                <li
                  key={`list-${i}`}
                  className="item"
                  onClick={() => {
                    if (customHeader['os'] === OS_TYPE['Desktop']) {
                      if (context.token.isLogin === false) {
                        context.action.alert({
                          msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                          callback: () => {
                            history.push('/login')
                          }
                        })
                      } else {
                        context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
                      }
                    } else {
                      fetchDataPlay(v.clipNo, 'dal')
                    }
                  }}>
                  <div className="item__thumb">
                    <img src={v.bgImg.thumb62x62} alt="이미지"/>
                    <span className="item__thumb__playTime">{v.filePlay}</span>
                  </div>
                  <div className="textBox">
                    <p className="textBox__subject">
                      <span className="subject">{v.subjectName}</span>
                      <i className="line"></i>
                      <span className="title">{v.title}</span>
                    </p>
                    <p className="textBox__nickName">
                      {v.gender === "f" &&
                      <img src="https://image.dalbitlive.com/svg/gender_w_w.svg" className="femaleIcon"/>}
                      {v.gender === "m" &&
                      <img src="https://image.dalbitlive.com/svg/gender_m_w.svg" className="maleIcon"/>}
                      {v.nickNm}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <NoResult text="등록된 클립이 없습니다."/>
        )
        }
      </div>
      {popupState && <RankPopup setPopupState={setPopupState} clip={clip}/>}
    </Layout>
  );
}