import React, {useEffect, useState, useContext} from 'react'
import {useHistory, Switch, Route, useParams} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Header from '../../components/ui/header/Header'

import Myprofile from './contents/Myprofile'

import './style.scss'

const Remypage = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context

  //useState
  const [profileInfo, setProfileInfo] = useState()
  const [myProfile, setMyProfile] = useState(true)

  // 조회 API
  const fetchProfileInfo = (memNo) => {
    Api.profile({params: {memNo: memNo}}).then((res) => {
      if (res.result === 'success') {
        setProfileInfo(res.data)
      }
    })
  }

  const openMyprofile = () => {
    setMyProfile(true)
  }

  // 페이지 셋팅
  useEffect(() => {
    if (!token.isLogin) {
      history.push('/login')
    } else {
      fetchProfileInfo(token.memNo)
    }
  }, [token.memNo])

  const data = profileInfo

  // 페이지 시작
  return (
    <React.Fragment>
      {myProfile === false && data && 
        <div id="remypage">
          <Header title={'MY'} />
          <section className="myInfo" onClick={openMyprofile}>
            <div className="textWrap">
              <p className='text'><strong>{data.nickNm}</strong>님<br/>
              오늘 즐거운 방송해볼까요?</p>
              <div className="count">
                <i>팬</i>
                <span>{data.fanCnt}</span>
                <i>스타</i>
                <span>{data.starCnt}</span>
                <i>좋아요</i>
                <span>{data.likeTotCnt}</span>
              </div>
            </div>
            <div className="photo">
              <img src={data.profImg && data.profImg.thumb150x150} alt="" />
            </div>
          </section>
          <section className='mydalDetail'>
            <div className="detail">
              <div className="title">달상세내역</div>
              <div className="dalCount">100달</div>
            </div>
            <div className="buttonWrap">
              <button>내 지갑</button>
              <button className='charge'>충전하기</button>
            </div>
          </section>
          <section className="myMenu">
            <div className="btnGroup">
              <button>클립</button>
              <button>리포트</button>
              <button>이벤트</button>
            </div>
            <div className="btnList">
              <button>설정</button>
              <button>공지사항</button>
              <button>FAQ</button>
              <button>운영정책</button>
              <button>고객센터</button>
            </div>
          </section>
          <button className='logout'>로그아웃</button>
        </div>
      }
      {myProfile === true && <Myprofile />}
    </React.Fragment>
  )
}

export default Remypage
