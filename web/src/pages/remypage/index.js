import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Reheader from '../../components/ui/header/Reheader'

import './style.scss'

const Remypage = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context

  //useState
  const [profileInfo, setProfileInfo] = useState()

  // 조회 API
  const fetchProfileInfo = (memNo) => {
    Api.profile({params: {memNo: memNo}}).then((res) => {
      if (res.result === 'success') {
        setProfileInfo(res.data)
      }
    })
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
      {data && 
        <div id="remypage">
            <Reheader title={'MY'} />
            <section className="myInfo">
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
                <button>충전하기</button>
              </div>
            </section>
        </div>
      }
    </React.Fragment>
  )
}

export default Remypage
