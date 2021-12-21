import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import styled, {css} from 'styled-components'
import Api from 'context/api'
import {Context} from 'context'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'

// component
import NoResult from 'components/ui/new_noResult'

// 사랑꾼 선발대회 Content Component
const Lover = (props) => {
  const context = useContext(Context)
  const history = useHistory()
  const [myRankInfo, setMyRankInfo] = useState() // 자신의 랭킹 정보
  const [rankListInfo, setRankListInfo] = useState({cnt: 0, list: []}) // 랭킹 리스트 정보
  const [pageInfo, setPageInfo] = useState({seqNo: 1, pageNo: 1, pagePerCnt: 30})

  const getRankListInfo = () => {
    Api.getLikeTreeRankList(pageInfo)
      .then((res) => {
        if (res.code === '00000') {
          console.log(res.data)
          setRankListInfo(res.data)
        } else {
          console.log(res.code)
        }
      })
      .catch((e) => console.log(e))
  }

  const getRankUserInfo = () => {
    Api.getLikeTreeRankUserInfo({memNo: context.profile.memNo, seqNo: pageInfo.seqNo})
      .then((res) => {
        if (res.code === '00000') {
          setMyRankInfo(res.data)
        } else {
          console.log(res)
        }
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    if (context.token.isLogin) {
      getRankUserInfo()
    }
  }, [pageInfo.seqNo])

  useEffect(() => {
    getRankListInfo()
  }, [pageInfo])

  return (
    <>
      <section>
        <img src={`${IMG_SERVER}/event/tree/treeBg-4.png`} className="bgImg" />
      </section>
      <section className="rankContainer">
        <div className="detailView">
          <button className="prev active">
            <img src={`${IMG_SERVER}/event/tree/arrow.png`} />
            이전
          </button>
          <div className="title">
            <div className="titleWrap">실시간</div>
            <span>(PM 18:52 기준)</span>
          </div>
          <button className="next">
            다음
            <img src={`${IMG_SERVER}/event/tree/arrow.png`} />
          </button>
        </div>
        {myRankInfo && (
          <div className="rankList my">
            <div className="rankNum">
              <span>내순위</span>
              <span className="num">{myRankInfo.rankNo == 0 ? '-' : myRankInfo.rankNo}</span>
            </div>
            <div className="photo">
              <img src={context.profile.profImg.thumb50x50} />
            </div>
            <div className="listBox">
              <span className="level">Lv {context.profile.level}</span>
              <span className="userNick">{context.profile.nickNm}</span>
            </div>
            <div className="listBack">
              <img src="" />
              {Utility.addComma(myRankInfo.totScoreCnt)}
            </div>
          </div>
        )}
        <div className="rankUl">
          {rankListInfo.list.map((row, index) => {
            return (
              <div className="rankList">
                <div className="rankNum">
                  <span className="num">{row.rankNo}</span>
                </div>
                <div className="photo">
                  {row.imageProfile !== '' ? (
                    <img style={{width: '100%'}} src={`${PHOTO_SERVER}${row.imageProfile}?120x120`} alt={row.memNick} />
                  ) : (
                    <img style={{width: '100%'}} src={`${PHOTO_SERVER}/profile_3/profile_m_200327.jpg`} alt={row.memNick} />
                  )}
                </div>
                <div className="listBox">
                  <em className="icon_wrap icon_male">
                    <span className="blind">성별</span>
                  </em>
                  <span className="userNick">{row.memNick}</span>
                </div>
                <div className="listBack">
                  <img src={`${IMG_SERVER}/event/tree/rankPoint.png`} />
                  {Utility.addComma(row.totScoreCnt)}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Lover
