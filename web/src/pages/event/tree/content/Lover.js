import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import Api from 'context/api'
import {Context} from 'context'
import {IMG_SERVER, PHOTO_SERVER} from 'context/config'
import BadgeList from 'common/badge_list'
import moment from 'moment'

// 사랑꾼 선발대회 Content Component
const Lover = (props) => {
  const context = useContext(Context)
  const history = useHistory()
  const [myRankInfo, setMyRankInfo] = useState() // 자신의 랭킹 정보
  const [rankListInfo, setRankListInfo] = useState({
    cnt: 0,
    list: [],
    breakNo: 30,
    title: '실시간',
    subTitle: `(${moment().format('A HH:mm')} 기준)`
  }) // 랭킹 리스트 정보
  const [pageInfo, setPageInfo] = useState({seqNo: props.seqNo, pageNo: 1, pagePerCnt: 500})

  // 사랑꾼 랭킹 리스트 가져오기
  const getRankListInfo = () => {
    Api.getLikeTreeRankList(pageInfo)
      .then((res) => {
        if (res.code === '00000') {
          const current = moment()
          let title = '실시간'
          let subTitle = `(${current.format('A HH:mm')} 기준)`

          if (current.isBefore('2022-01-07') && current.isAfter('2021-12-30')) {
            if (pageInfo.seqNo === 1) {
              title = '1회차'
              subTitle = ''
            }
          }

          setRankListInfo({...rankListInfo, ...res.data, title, subTitle})
        } else {
          console.log(res.code)
        }
      })
      .catch((e) => console.log(e))
  }

  // 사랑꾼 내 랭킹 정보 가져오기
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

  // 랭킹 스크롤 이벤트
  const scrollAddList = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset

    if (rankListInfo.list.length > rankListInfo.breakNo && windowBottom >= docHeight - 300) {
      setRankListInfo({...rankListInfo, breakNo: rankListInfo.breakNo + 1})
      window.removeEventListener('scroll', scrollAddList)
    } else if (rankListInfo.breakNo >= rankListInfo.list.length) {
      window.removeEventListener('scroll', scrollAddList)
    }
  }

  // 다음 실기간 랭킹
  const nextEvent = () => {
    const current = moment()
    if (pageInfo.seqNo !== 2) {
      // && current.isAfter('2021-12-30')
      setPageInfo({...pageInfo, seqNo: 2})
    }
  }

  // 이전 실시간 랭킹
  const prevEvent = () => {
    if (pageInfo.seqNo !== 1) {
      setPageInfo({...pageInfo, seqNo: 1})
    }
  }

  // 프로필 이동 이벤트
  const goProfile = (e) => {
    const {targetMemNo} = e.currentTarget.dataset

    if (targetMemNo !== undefined && targetMemNo > 0) {
      history.push(`/mypage/${targetMemNo}`)
    }
  }

  useEffect(() => {
    if (context.token.isLogin) {
      getRankUserInfo()
    }
  }, [pageInfo.seqNo])

  useEffect(() => {
    window.addEventListener('scroll', scrollAddList)

    return () => {
      window.removeEventListener('scroll', scrollAddList)
    }
  }, [rankListInfo])

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
          <button className={`prev ${pageInfo.seqNo !== 1 ? 'active' : 'noActive'}`} onClick={prevEvent}>
            <img src={`${IMG_SERVER}/event/tree/arrow.png`} />
            이전
          </button>
          <div className="title">
            <div className="titleWrap">{rankListInfo.title}</div>
            <span>{rankListInfo.subTitle}</span>
          </div>
          <button
            className={`next ${pageInfo.seqNo !== 2 && moment().isAfter('2021-12-30') ? 'active' : 'noActive'}`}
            onClick={nextEvent}>
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
              <img src={`${IMG_SERVER}/event/tree/rankPoint.png`} />
              {Utility.addComma(myRankInfo.totScoreCnt)}
            </div>
          </div>
        )}
        <div className="rankUl">
          {rankListInfo.list.map((row, index) => {
            if (rankListInfo.breakNo <= index) return

            return (
              <div className="rankList" key={index}>
                <div className="rankNum">
                  <span className="num">{row.rankNo}</span>
                </div>
                <div className="photo" data-target-mem-no={row.memNo} onClick={goProfile}>
                  {row.imageProfile !== '' ? (
                    <img style={{width: '100%'}} src={`${PHOTO_SERVER}${row.imageProfile}?120x120`} alt={row.memNick} />
                  ) : (
                    <img style={{width: '100%'}} src={`${PHOTO_SERVER}/profile_3/profile_m_200327.jpg`} alt={row.memNick} />
                  )}
                </div>
                <div className="listBox">
                  <em className={`icon_wrap ${row.memSex === 'm' ? 'icon_male' : 'icon_female'}`}>
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

Lover.defaultProps = {
  seqNo: 1
}

export default Lover