import React, {useContext, useState, useEffect, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import _ from 'lodash'

import Api from 'context/api'
import {IMG_SERVER} from 'context/config'

import hitIcon from '../static/ico_hit_g.svg'

import './recommendDj.scss'
import NoResult from "components/ui/noResult/NoResult";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const RecommendDj = () => {
  const history = useHistory()

  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  const [fetchedList, setFetchedList] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [memList, setMemList] = useState([])

  const selectedAgeArr = [1, 2, 3, 4]
  const selectedGenderArr = ['m', 'f']
  const fetchRecommendedDJList = useCallback(async () => {
    const ageList = joinChar(selectedAgeArr)
    const gender = joinChar(selectedGenderArr)

    const {result, data, message} = await Api.getRecommendedDJ({ageList, gender})
    if (result === 'success') {
      let memNoList = []
      memNoList = data.list.slice(0, 6).map((e) => e.memNo)
      setFetchedList(data.list.slice(0, 6))
      setMemList(memNoList)
    } else {
      dispatch(setGlobalCtxMessage({
        type:"alert",
        msg: message
      }))
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
    const movePage = () => {
      history.push({
        pathname: '/',
        state: {
          state: '/'
        }
      })
    }
    console.log(result)
    if (result === 'success') {
      movePage()
    } else {
      console.log(message)
      movePage()
    }
  }, [memList])

  const toggleSelect = (e, idx) => {
    let memNoList = memList
    if (e.currentTarget.className === 'fanBoxWrap') {
      e.currentTarget.className += ' active'
      memNoList.push(fetchedList[idx].memNo)
    } else {
      e.currentTarget.classList.remove('active')
      memNoList.splice(memNoList.indexOf(fetchedList[idx].memNo), 1)
    }

    setMemList(memNoList)
  }

  const joinChar = (state) => state.join('|')

  const onRefresh = () => {
    fetchRecommendedDJList()
    setRefresh(true)
  }

  useEffect(() => {
    const {token, profile} = globalState

    if (!token.isLogin) {
      history.push({
        pathname: '/login',
        state: {
          state: 'signup/recommendDj'
        }
      })
    }
  }, [globalState.profile, globalState.token.isLogin])

  useEffect(() => {
    fetchRecommendedDJList()
  }, [])

  return (
    <div id="recommendDj2">
      <div className="subContent">
        <div className="topImg">
          <img
            src={`${IMG_SERVER}/event/recommend_dj2/renewal/topImg-renewal.png`}
            alt="꿀잼보장! 추천DJ를 소개합니다. 팬이 되면 DJ가 방송할 때 알려드려요."
          />
          <button onClick={() => history.push('/')}>
            <img src={`${IMG_SERVER}/event/recommend_dj2/ico_nextTime.png`} alt="다음에" />
          </button>
        </div>
        <div className='wrap'>
          <ul className="listBox">
            {/* {fetchedList.length === 0 && <NoResult text="추천DJ가 없습니다.<br />다른 조건으로 검색해주세요." />} */}
            {fetchedList.length > 0 ? (
              fetchedList.map((list, idx) => (
                <li className="userItem" key={`${list.memNo}-${idx}`}>
                  <div className={`fanBoxWrap active`} onClick={(e) => toggleSelect(e, idx)}>
                    <div className={`thumbnail`}>
                      <img src={list.profImg['thumb120x120']} className="photo" alt={list.nickNm} />
                      <em className="icoCheck"></em>
                    </div>
                    <div className="userText">
                      <div className={`nickName ${list.gender === 'm' ? 'man' : 'woman'}`}>{list.nickNm}</div>
                      <p className="subject">
                        {list.dj_keyword.split('\n').map((line, index) => {
                          if (list.dj_keyword.match('\n')) {
                            return (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            )
                          } else {
                            return <React.Fragment key={index}>{list.dj_keyword}</React.Fragment>
                          }
                        })}
                      </p>
                      <div className="value">
                        <i className="user">
                          <img src={hitIcon} alt="" />
                        </i>
                        <span>{list.tot_clip_play_cnt + list.tot_listener_cnt}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <NoResult text="추천DJ가 없습니다.<br />다른 조건으로 검색해주세요." />
            )}
          </ul>
          <div className="combo">
            <button className="refreshBtn" onClick={onRefresh}>
              <img src={`${IMG_SERVER}/event/recommend_dj2/renewal/ico_refresh-renewal.png`} className={`refresh-img${refresh}`} alt="새로고침" />
            </button>
            <button className="startBtn" onClick={addFanHandler}>
              시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendDj
