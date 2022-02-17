import React, {useCallback, useState} from 'react'
import Api from 'context/api'

//components
import NoResult from 'components/ui/noResult'
import RankListComponent from './rankList'
import RankListTop from './rankListTop'

// constant
import {DATE_TYPE} from './constant'
import {useDispatch} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

//static

export default (props) => {
  const dispatch = useDispatch();
  const {rankType, dateType, setDateType, rankList, myInfo, selectedDate, handleDate, setMyInfo} = props

  const [dateTitle, setDateTitle] = useState({
    header: '오늘',
    date: ''
  })

  const [btnActive, setBtnActive] = useState({
    prev: false,
    next: false
  })

  const [myProfile, setMyProfile] = useState(false)
  const [rewardPop, setRewardPop] = useState({
    text: '',
    rewardDal: 0
  })
  const [popup, setPopup] = useState(false)

  const createDateButton = useCallback(() => {
    const DATE_TYPE_LIST = Object.keys(DATE_TYPE).map((type) => DATE_TYPE[type])
    return ['오늘', '주간', '월간', '연간'].map((text, idx) => {
      return (
        <button
          key={`date-type-${idx}`}
          className={dateType === DATE_TYPE_LIST[idx] ? 'todayList__btn todayList__btn--active' : 'todayList__btn'}
          onClick={() => setDateType(DATE_TYPE_LIST[idx])}>
          {text}
        </button>
      )
    })
  }, [dateType])

  // const createMyRank = useCallback(() => {
  //   if (token.isLogin) {
  //     const settingProfileInfo = async (memNo) => {
  //       const profileInfo = await Api.profile({
  //         params: {memNo: token.memNo}
  //       })
  //       if (profileInfo.result === 'success') {
  //         setMyProfile(profileInfo.data)
  //       }
  //     }
  //     settingProfileInfo()
  //   } else {
  //     return null
  //   }
  // }, [])

  const createResult = useCallback(() => {
    if (Array.isArray(rankList) === false) {
      return null
    }
    if (rankList.length === 0) {
      return <NoResult />
    }
    return (
      <>
        <RankListTop list={rankList.slice(0, 3)} rankType={rankType} dateType={dateType} myMemNo={myProfile.memNo} />
        <RankListComponent list={rankList.slice(3)} rankType={rankType} dateType={dateType} />
      </>
    )
  }, [rankList, rankType, dateType])

  // const createMyProfile = () => {
  //   const {myUpDown} = myInfo

  //   let myUpDownName,
  //     myUpDownValue = ''
  //   if (myUpDown[0] === '+') {
  //     myUpDownName = `rankingChange__up rankingChange__up--profile`
  //     myUpDownValue = myUpDown.split('+')[1]
  //   } else if (myUpDown[0] === '-' && myUpDown.length > 1) {
  //     myUpDownName = `rankingChange__down rankingChange__down--profile`
  //     myUpDownValue = myUpDown.split('-')[1]
  //   } else if (myUpDown === 'new') {
  //     myUpDownName = `rankingChange__new`
  //     myUpDownValue = 'new'
  //   } else {
  //     myUpDownName = `rankingChange__stop`
  //   }
  //   return <span className={myUpDownName}>{myUpDownValue}</span>
  // }

  const rankingReward = (clickState) => {
    async function feachRankingReward() {
      const {result, data} = await Api.get_ranking_reward({
        params: {
          rankSlct: rankType,
          rankType: dateType
        }
      })

      if (result === 'success') {
        if (clickState === 2) {
          setPopup(true)
        }
        setRewardPop(data)
      } else {
        if (clickState === 2) {
          return dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: `랭킹 보상을 받을 수 있는 \n 기간이 지났습니다.`
          }))
        }
        setMyInfo({...myInfo, isReward: false})
      }
    }
    feachRankingReward()
  }

  return <>{createResult()}</>
}
