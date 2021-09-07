import React, {useContext, useState, useEffect, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import _ from 'lodash'

import {GENDER_TYPE, AGE_TYPE} from '../recommend_dj/constant'

import NoResult from 'components/ui/noResult'
import Header from 'components/ui/new_header.js'

import {Context} from 'context'
import {RoomJoin} from 'context/room'
import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import {IMG_SERVER} from 'context/config'

import hitIcon from '../../menu/static/ico_hit_g.svg'

import './recommend_dj2.scss'

export default function RecommendDj() {
  const history = useHistory()

  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)

  const [selectedGenderArr, setSelectedGenderArr] = useState([])
  const [selectedAgeArr, setSelectedAgeArr] = useState([])
  const [fetchedList, setFetchedList] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [memList, setMemList] = useState([])
  const [select, setSelect] = useState(false)

  const fetchRecommendedDJList = useCallback(async () => {
    const {result, data, message} = await Api.getRecommendedDJ()
    if (result === 'success') {
      let memNoList = []
      data.list.slice(0, 6).map((e) => memNoList.push(e.memNo))
      setFetchedList(data.list.slice(0, 6))
      setMemList(memNoList)
    } else {
      context.action.alert({
        msg: message
      })
    }

    setTimeout(() => {
      setRefresh(false)
    }, 360)
  })

  const addFanHandler = useCallback(async () => {
    console.log(memList)
    const {result, message} = await Api.fan_multi_change({
      data: {memNoList: memList}
    })
    console.log(result)
    if (result === 'success') {
      toggleFan(listIdx)
      history.push('/')
    } else {
      context.action.alert({
        msg: message
      })
    }
  }, [memList])

  const toggleFan = (listIdx) => {
    const deepClonedList = _.cloneDeep(fetchedList)
    deepClonedList[listIdx].isFan = !deepClonedList[listIdx].isFan
    setFetchedList(deepClonedList)
  }

  const toggleSelect = (e, idx) => {
    // console.log(e.currentTarget.className, memList)
    let memNoList = memList
    if (e.currentTarget.className === 'fanBoxWrap') {
      e.currentTarget.className += ' active'
      memNoList.push(fetchedList[idx].memNo)
    } else {
      e.currentTarget.classList.remove('active')
      memNoList.pop(fetchedList[idx].memNo)
    }

    console.log(e.currentTarget.className, memNoList)

    setMemList(memNoList)
  }

  const onRefresh = () => {
    fetchRecommendedDJList()
    setRefresh(true)
  }

  useEffect(() => {
    const {token, profile} = context

    if (!token.isLogin) {
      history.push({
        pathname: '/login',
        state: {
          state: 'event/recommend_dj2'
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
    fetchRecommendedDJList()
  }, [])

  return (
    <div id="recommendDj2">
      <div className="subContent">
        <div className="topImg">
          <img
            src={`${IMG_SERVER}/event/recommend_dj2/topImg.png`}
            alt="꿀잼보장! 추천DJ를 소개합니다. 팬이 되면 DJ가 방송할 때 알려드려요."
          />
          <button onClick={() => history.push('/')}>
            <img src={`${IMG_SERVER}/event/recommend_dj2/ico_nextTime.png`} alt="다음에" />
          </button>
        </div>

        <ul className="listBox">
          {/* {fetchedList.length === 0 && <NoResult text="추천DJ가 없습니다.<br />다른 조건으로 검색해주세요." />} */}
          {fetchedList.length > 0 ? (
            fetchedList.map((list, idx) => (
              <li className="userItem" key={`${list.memNo}-${idx}`}>
                <button className={`fanBoxWrap active`} onClick={(e) => toggleSelect(e, idx)}>
                  <div className={`thumbnail`}>
                    <img src={list.profImg['thumb120x120']} className="photo" alt={list.nickNm} />
                    <em className="icoCheck"></em>
                  </div>
                  <div className="userText">
                    <div className="nickName">{list.nickNm}</div>
                    <p className="subject">{list.dj_keyword}</p>
                    <div className="value">
                      <i className="user">
                        <img src={hitIcon} alt="" />
                      </i>
                      <span>41234</span>
                    </div>
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
                </button>
              </li>
            ))
          ) : (
            <NoResult text="추천DJ가 없습니다.<br />다른 조건으로 검색해주세요." />
          )}
        </ul>
        {/* <button className="btn__refresh" onClick={onRefresh}>
          <img
            src={`${IMG_SERVER}/event/recommend_dj2/ico_refresh.png`}
            alt="새로고침"
            className={`refresh-img${refresh ? ' active' : ''}`}
          />
        </button> */}
        <button className="refreshBtn" onClick={onRefresh}>
          <img src={`${IMG_SERVER}/event/recommend_dj2/ico_refresh.png`} className={`refresh-img${refresh}`} alt="새로고침" />
          다른 추천DJ 보기
        </button>
        <button className="startBtn" onClick={addFanHandler}>
          시작하기
        </button>
      </div>
    </div>
  )
}
