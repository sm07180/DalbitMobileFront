import React, {useContext, useState, useEffect, useCallback} from 'react'
import {useHistory, Link} from 'react-router-dom'
import _ from 'lodash'

import {Context} from 'context'
import {RoomJoin} from 'context/room'
import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import {GENDER_TYPE, AGE_TYPE} from './constant'
import NoResult from 'components/ui/noResult'
import Header from 'components/ui/new_header.js'

import './recommend_dj.scss'

export default function RecommendDj() {
  const history = useHistory()

  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)

  const [selectedGenderArr, setSelectedGenderArr] = useState([])
  const [selectedAgeArr, setSelectedAgeArr] = useState([])
  const [fetchedList, setFetchedList] = useState([])
  const [fetched, setFetched] = useState(true)

  const fetchRecommendedDJList = useCallback(async () => {
    const ageList = joinChar(selectedAgeArr)
    const gender = joinChar(selectedGenderArr)

    const {result, data, message} = await Api.getRecommendedDJ({ageList, gender})
    if (result === 'success') {
      setFetchedList(data.list)
      if (fetched) {
        if (data.list.length >= 20) {
          setFetched(false)
        } else if (!_.isEqual(selectedAgeArr, [AGE_TYPE.ten, AGE_TYPE.twenty, AGE_TYPE.thirty, AGE_TYPE.forty])) {
          setSelectedAgeArr([AGE_TYPE.ten, AGE_TYPE.twenty, AGE_TYPE.thirty, AGE_TYPE.forty])
          setFetched(false)
        }
      }
    } else {
      context.action.alert({
        msg: message
      })
    }
  }, [selectedGenderArr, selectedAgeArr])

  const addFanHandler = useCallback(
    async (memNo, nickNm) => {
      const {result, message} = await Api.fan_change({data: {memNo, type: 1}})
      if (result === 'success') {
        context.action.toast({
          msg: `${nickNm} 님의 팬이 되셨습니다.`
        })
        fetchRecommendedDJList()
      } else {
        context.action.alert({
          msg: message
        })
      }
    },
    [fetchedList]
  )

  const joinChar = (state) => state.join('|')

  const toggleButtonHandler = (e, stateArr, setStateArr) => {
    const {value} = e.target
    if (stateArr.includes(value)) {
      if (stateArr.length > 1) {
        setStateArr(stateArr.filter((val) => val !== value))
      }
    } else {
      setStateArr(stateArr.concat([value]))
    }
  }

  useEffect(() => {
    const {token, profile} = context

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

        const getAge =
          profile.age === 0 ? [AGE_TYPE.ten, AGE_TYPE.twenty, AGE_TYPE.thirty, AGE_TYPE.forty] : [(profile.age / 10).toString()]

        setSelectedAgeArr(getAge)
      }
    }
  }, [context.profile, context.token.isLogin])

  useEffect(() => {
    if (selectedGenderArr.length && selectedAgeArr.length) {
      fetchRecommendedDJList()
    }
  }, [selectedGenderArr, selectedAgeArr])

  return (
    <div id="recommendDj">
      <Header title="DJ를 추천합니다" goBack={() => history.push('/')} />
      <div className="subContent gray">
        <div className="btnBox">
          <div className="btnBox__genderBtn">
            <button
              className={selectedGenderArr.includes(GENDER_TYPE.male) ? 'active' : ''}
              onClick={(event) => toggleButtonHandler(event, selectedGenderArr, setSelectedGenderArr)}
              name="male"
              value={GENDER_TYPE.male}
              type="button">
              남성
            </button>
            <button
              className={selectedGenderArr.includes(GENDER_TYPE.female) ? 'active' : ''}
              onClick={(event) => toggleButtonHandler(event, selectedGenderArr, setSelectedGenderArr)}
              name="female"
              value={GENDER_TYPE.female}
              type="button">
              여성
            </button>
          </div>
          <div className="btnBox__ageBtn">
            <button
              className={selectedAgeArr.includes(AGE_TYPE.ten) ? 'active' : ''}
              onClick={(event) => toggleButtonHandler(event, selectedAgeArr, setSelectedAgeArr)}
              name="ageTen"
              value={AGE_TYPE.ten}
              type="button">
              10대
            </button>
            <button
              className={selectedAgeArr.includes(AGE_TYPE.twenty) ? 'active' : ''}
              onClick={(event) => toggleButtonHandler(event, selectedAgeArr, setSelectedAgeArr)}
              name="ageTwenty"
              value={AGE_TYPE.twenty}
              type="button">
              20대
            </button>
            <button
              className={selectedAgeArr.includes(AGE_TYPE.thirty) ? 'active' : ''}
              onClick={(event) => toggleButtonHandler(event, selectedAgeArr, setSelectedAgeArr)}
              name="ageThirty"
              value={AGE_TYPE.thirty}
              type="button">
              30대
            </button>
            <button
              className={selectedAgeArr.includes(AGE_TYPE.forty) ? 'active' : ''}
              onClick={(event) => toggleButtonHandler(event, selectedAgeArr, setSelectedAgeArr)}
              name="ageForty"
              value={AGE_TYPE.forty}
              type="button">
              40대
            </button>
          </div>
        </div>
        <div className="notice">
          실력과 재미가 보장된 DJ를 추천합니다!
          <br />
          팬이 되면 DJ가 방송 시작 시 메시지로 알려드립니다.
        </div>
        {fetchedList.length === 0 && <NoResult text="추천DJ가 없습니다.<br />다른 조건으로 검색해주세요." />}

        <ul className="listBox">
          {fetchedList.map((list, idx) => (
            <li className="userItem" key={`${list.memNo}-${idx}`}>
              <div className="fanBox">
                <div className="fanBox__thumbnail">
                  <Link to={`/mypage/${list.memNo}`}>
                    <img src={list.profImg['thumb120x120']} alt={list.nickNm} />
                  </Link>
                </div>
                {list.isFan && (
                  <button className="fanPlus" type="button">
                    팬
                  </button>
                )}
                {!list.isFan && (
                  <button className="fanPlus active" type="button" onClick={() => addFanHandler(list.memNo, list.nickNm)}>
                    +팬등록
                  </button>
                )}
              </div>
              <div className="userText">
                <div className="userText__nickName">{list.nickNm}</div>
                <span className="userText__genderBox">
                  {list.gender === 'f' && <img src="https://image.dalbitlive.com/svg/gender_w_w.svg" alt="여성" />}
                  {list.gender === 'm' && <img src="https://image.dalbitlive.com/svg/gender_m_w.svg" alt="남성" />}
                  {list.ageDesc}
                </span>
                <span className="userText__liveTime">{list.title}</span>
                <p className="userText__subject">{list.desc}</p>
              </div>
              {list.roomNo && (
                <button
                  className="liveLink"
                  onClick={() => {
                    if (customHeader['os'] === OS_TYPE['Desktop']) {
                      console.log('hello')
                      context.action.updatePopup('APPDOWN', 'appDownAlrt', 1)
                    } else {
                      RoomJoin({roomNo: list.roomNo, nickNm: list.nickNm})
                    }
                  }}></button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
