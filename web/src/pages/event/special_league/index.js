import React, {useCallback, useLayoutEffect, useState} from 'react'

import Api from 'context/api'
import {useHistory} from 'react-router-dom'

import RoundHandler from './component/round_handler'
import RoundList from './component/round_list'
import MyRank from './component/my_rank'
import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function SpecialLeague() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const [tabState, setTabState] = useState('league') //league, benefit
  const [myData, setMyData] = useState({
    isSpecial: false,
    myRank: 0,
    myTotalPoint: 0,
    myListenerPoint: 0,
    myGiftPoint: 0,
    myGoodPoint: 0,
    myFanPoint: 0
  })
  const [nowRoundNo, setNowRoundNo] = useState(1)
  const [rankList, setRankList] = useState([])

  async function feachSpecialLeague() {
    const res = await Api.getSpecialLeague({
      roundNo: nowRoundNo
    })

    const {result, data, message} = res
    if (result === 'success') {
      setNowRoundNo(data.nowRoundNo)
      setMyData(data)
      setRankList(data.list)
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message,
        callback: () => {
          history.goBack()
        }
      }))
    }
  }

  const MakeListHandler = useCallback(() => {
    if (tabState === 'league') {
      return (
        <div className="tab_content league">
          <RoundHandler nowRoundNo={nowRoundNo} />

          {globalState.token.isLogin && myData.isSpecial && <MyRank myData={myData}/>}
          <RoundList rankList={rankList} />
        </div>
      )
    } else {
      return <></>
    }
  }, [tabState, nowRoundNo, rankList])

  //-------------------------------

  useLayoutEffect(() => {
    feachSpecialLeague()
  }, [nowRoundNo])

  return (
    <div id="special_league_page">
      <button className="btnBack" onClick={() => history.goBack()}>
        <img src="https://image.dallalive.com/svg/close_w_l.svg" alt="close" />
      </button>
      <img
        src="https://image.dallalive.com/event/special_league/210601/common_top_img.jpg"
        className="top_image"
        alt="매월 오직 스페셜DJ만의 스페셜 리그가 진행됩니다."
      />

      <div className="tab_box">
        <button onClick={() => setTabState('league')}>
          <img
            src={`https://image.dallalive.com/event/special_league/210222/tab_league${tabState === 'league' ? '_on' : ''}.png`}
            alt="리그 순위"
          />
        </button>
        <button onClick={() => setTabState('benefit')}>
          <img
            src={`https://image.dallalive.com/event/special_league/210222/tab_benefit${tabState === 'benefit' ? '_on' : ''}.png`}
            alt="안내 및 혜택"
          />
        </button>
      </div>

      <MakeListHandler />

      {tabState === 'benefit' && (
        <div className="tab_content benefit">
          <img src="https://image.dallalive.com/event/special_league/210601/benefit_img_01.png" />
          <img src="https://image.dallalive.com/event/special_league/210222/benefit_img_02.png" />
          <img src="https://image.dallalive.com/event/special_league/210222/benefit_img_03.png" />
        </div>
      )}
    </div>
  )
}
