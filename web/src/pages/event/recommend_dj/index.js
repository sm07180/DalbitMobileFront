import React, {useContext, useState, useEffect, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import _ from 'lodash'

import {GENDER_TYPE, AGE_TYPE} from './constant'

import NoResult from 'components/ui/noResult/NoResult'
import Header from 'components/ui/header/Header'

import {RoomJoin} from 'context/room'
import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import {IMG_SERVER} from 'context/config'

import './recommend_dj.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

const genderList = [
  {
    text: '남성',
    name: 'male',
    value: GENDER_TYPE.male
  },
  {
    text: '여성',
    name: 'female',
    value: GENDER_TYPE.female
  }
]
const ageList = [
  {
    text: '10대',
    name: 'ageTen',
    value: AGE_TYPE.ten
  },
  {
    text: '20대',
    name: 'ageTwenty',
    value: AGE_TYPE.twenty
  },
  {
    text: '30대',
    name: 'ageThirty',
    value: AGE_TYPE.thirty
  },
  {
    text: '40대이상',
    name: 'ageForty',
    value: AGE_TYPE.forty
  }
]

export default function RecommendDj() {
  const history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const customHeader = JSON.parse(Api.customHeader)

  const [selectedGenderArr, setSelectedGenderArr] = useState([])
  const [fetchedList, setFetchedList] = useState([])
  // const [fetched, setFetched] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const selectedAgeArr = ['1', '2', '3', '4']

  const fetchRecommendedDJList = useCallback(async () => {
    const ageList = joinChar(selectedAgeArr)
    const gender = joinChar(selectedGenderArr)

    const {result, data, message} = await Api.getRecommendedDJ({ageList, gender})
    if (result === 'success') {
      setFetchedList(data.list)
      // if (fetched) {
      //   if (data.list.length >= 20) {
      //     setFetched(false)
      //   } else if (!_.isEqual(selectedAgeArr, [AGE_TYPE.ten, AGE_TYPE.twenty, AGE_TYPE.thirty, AGE_TYPE.forty])) {
      //     setSelectedAgeArr([AGE_TYPE.ten, AGE_TYPE.twenty, AGE_TYPE.thirty, AGE_TYPE.forty])
      //     setFetched(false)
      //   }
      // }
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message
      }))
    }

    setTimeout(() => {
      setRefresh(false)
    }, 360)
  }, [selectedGenderArr])

  const addFanImageHandler = useCallback(
    async (memNo, nickNm, listIdx) => {
      if (fetchedList[listIdx].isFan) {
        history.push(`/profile/${memNo}`)
      } else {
        const {result, message} = await Api.fan_change({data: {memNo, type: 1}})
        if (result === 'success') {
          toggleFan(listIdx)
          dispatch(setGlobalCtxMessage({type: "alert_no_close",
            msg: `${nickNm} 님의 팬이 되셨습니다.`,
            callback: () => history.push(`/profile/${memNo}`)
          }))
        } else {
          dispatch(setGlobalCtxMessage({type: "alert",
            msg: message
          }))
        }
      }
    },
    [fetchedList]
  )

  const addFanHandler = useCallback(
    async (memNo, nickNm, listIdx) => {
      const {result, message} = await Api.fan_change({data: {memNo, type: 1}})
      if (result === 'success') {
        dispatch(setGlobalCtxMessage({type: "toast",
          msg: `${nickNm} 님의 팬이 되셨습니다.`
        }))
        toggleFan(listIdx)
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: message
        }))
      }
    },
    [fetchedList]
  )

  const cancelFanHandler = useCallback(
    async (memNo, listIdx) => {
      const {result, message} = await Api.mypage_fan_cancel({data: {memNo}})
      if (result === 'success') {
        dispatch(setGlobalCtxMessage({type: "toast",
          msg: '팬을 취소하였습니다'
        }))
        toggleFan(listIdx)
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: message
        }))
      }
    },
    [fetchedList]
  )

  const confirmCancelFan = (memNo, nickNm, listIdx) => {
    dispatch(setGlobalCtxMessage({type: "confirm",
      msg: `${nickNm} 님의 팬을 취소하시겠습니까?`,
      callback: () => cancelFanHandler(memNo, listIdx)
    }))
  }

  const joinChar = (state) => state.join('|')

  const toggleFan = (listIdx) => {
    const deepClonedList = _.cloneDeep(fetchedList)
    deepClonedList[listIdx].isFan = !deepClonedList[listIdx].isFan
    setFetchedList(deepClonedList)
  }

  const toggleTabButton = (e, stateArr, setStateArr) => {
    const {value} = e.target

    if (stateArr.includes(value)) {
      if (stateArr.length > 1) {
        setStateArr(stateArr.filter((val) => val !== value))
      }
    } else {
      setStateArr(stateArr.concat([value]))
    }
  }

  const onRefresh = () => {
    fetchRecommendedDJList()
    setRefresh(true)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const {token, profile} = globalState

    if (!token.isLogin) {
      history.push({
        pathname: '/login',
        state: {
          state: 'event/recommend_dj'
        }
      })
    } else {
      if (profile !== null) {
        const getGender =
          profile.gender === 'n'
            ? [GENDER_TYPE.male, GENDER_TYPE.female]
            : profile.gender === 'm'
            ? [GENDER_TYPE.female]
            : [GENDER_TYPE.male]
        setSelectedGenderArr(getGender)

        // const getAge =
        //   profile.age === 0 ? [AGE_TYPE.ten, AGE_TYPE.twenty, AGE_TYPE.thirty, AGE_TYPE.forty] : [(profile.age / 10).toString()]
        // setSelectedAgeArr(getAge)
      }
    }
  }, [globalState.profile, globalState.token.isLogin])

  useEffect(() => {
    if (selectedGenderArr.length) {
      fetchRecommendedDJList()
    }
  }, [selectedGenderArr])

  return (
    <div id="recommendDj">
      <Header title="달라 대표 DJ를 추천합니다" type="back">
        <div className="buttonGroup">
          <button className="btn__refresh" onClick={onRefresh}>
            <img
              src={`${IMG_SERVER}/main/200714/ico-refresh-gray.png`}
              alt="새로고침"
              className={`refresh-img${refresh ? ' active' : ''}`}
            />
          </button>
        </div>
      </Header>
      <div className="subContent gray">
        <div className="btnBox">
          <div className="btnBox__genderBtn">
            {genderList.map((eachGender, idx) => (
              <button
                key={`${eachGender.value}-${idx}`}
                className={selectedGenderArr.includes(eachGender.value) ? 'active' : ''}
                onClick={(event) => toggleTabButton(event, selectedGenderArr, setSelectedGenderArr)}
                name={eachGender.name}
                value={eachGender.value}
                type="button">
                {eachGender.text}
              </button>
            ))}
          </div>

          {/* <div className="btnBox__ageBtn">
            {ageList.map((eachAge, idx) => (
              <button
                key={`${eachAge.value}-${idx}`}
                className={selectedAgeArr.includes(eachAge.value) ? 'active' : ''}
                onClick={(event) => toggleTabButton(event, selectedAgeArr, setSelectedAgeArr)}
                name={eachAge.name}
                value={eachAge.value}
                type="button">
                {eachAge.text}
              </button>
            ))}
          </div> */}
        </div>

        <div className="notice">
          <img
            src={`${IMG_SERVER}/banner/2101/26/banner_recommend_dj-2x.png`}
            alt="실력과 재미가 보장된 DJ를 추천합니다! 팬이 되면 DJ가 방송 시작 시 메시지로 알려드립니다"
          />
        </div>
        {fetchedList.length === 0 && <NoResult text="추천DJ가 없습니다.<br />다른 조건으로 검색해주세요." />}

        <ul className="listBox">
          {fetchedList.map((list, idx) => (
            <li className="userItem" key={`${list.memNo}-${idx}`}>
              <div className="fanBoxWrap">
                <div className="fanBox">
                  <div className="fanBox__thumbnail" onClick={() => addFanImageHandler(list.memNo, list.nickNm, idx)}>
                    <img src={list.profImg['thumb120x120']} alt={list.nickNm} />
                  </div>

                  {list.isFan && (
                    <button className="fanPlus" type="button" onClick={() => confirmCancelFan(list.memNo, list.nickNm, idx)}>
                      팬
                    </button>
                  )}
                  {!list.isFan && (
                    <button className="fanPlus active" type="button" onClick={() => addFanHandler(list.memNo, list.nickNm, idx)}>
                      +팬등록
                    </button>
                  )}
                </div>

                <div className="userText">
                  <span className="userText__genderBox">
                    {list.gender === 'f' && <img src="https://image.dallalive.com/svg/gender_w_w.svg" alt="여성" />}
                    {list.gender === 'm' && <img src="https://image.dallalive.com/svg/gender_m_w.svg" alt="남성" />}
                    <span className="userText__nickName">{list.nickNm}</span>
                  </span>
                  <span className="userText__liveTime">{list.title}</span>
                  <p className="userText__subject">{list.desc}</p>
                </div>
                {list.roomNo && (
                  <button
                    className="liveLink"
                    onClick={() => {
                      if (customHeader['os'] === OS_TYPE['Desktop']) {
                        dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 1]}));
                      } else {
                        RoomJoin({roomNo: list.roomNo, nickNm: list.nickNm})
                      }
                    }}></button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
