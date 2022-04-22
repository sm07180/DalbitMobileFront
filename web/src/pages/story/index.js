import React, {useState, useContext, useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {Context} from 'context'

import moment from "moment";

import Header from 'components/ui/header/Header'

import Sent from './component/sent'
import Received from './component/received'
import Detail from './component/detail'

import './style.scss'

export default () => {
  const history = useHistory()
  const globalCtx = useContext(Context)

  const temporaryData = [
    {
      contents: `BJ님! 일반 라디오방송 DJ보다 훨씬 잘하십니다.
이번에 저 방탄소년단 콘서트에 가는데요!
저 곡하나 신청해도 될까요?
ㅎㅎ 방탄소년단 최신곡으로 하나 부탁드려요! `,
      nickNm: "일이삼사오육칠팔꾸십",
      profImg: "https://photo.dalbitlive.com/profile_0/20754115200/20200804125251259035.jpeg",
      writeDt : 20210310172024,
      memNo: 11624955839105,
    },
    {
      contents: `일반 라디오방송 DJ보다 훨씬 잘하시는 것 같아요! 이번에 저 아이유 콘서트에 가는데요! 저 곡하나 신청해도 될까요? ㅎㅎ 아이유 블루밍 최신곡으로 하나 부탁드려요! 매번 좋은노래 틀어주셔서 감사합니다 :) 아이유 짱! 아이유 짱! 아이유 짱!  BJ 라디오 짱!`,
      nickNm: "달라둥이👑",
      profImg: "https://photo.dalbitlive.com/profile_0/20754115200/20200804125251259035.jpeg",
      writeDt : 20210310172024,
      memNo: 41630553415690,
    },
    {
      contents: `안녕하세요! 방송 항상 잘 듣고 있어요 ㅎㅎ `,
      nickNm: "💸맹치",
      profImg: "https://photo.dalbitlive.com/profile_0/20754115200/20200804125251259035.jpeg",
      writeDt : 20210310172024,
      memNo: 11625441574527,
    },
  ]

  const goLink = (memNo) => {    
    history.push(`/profile/${memNo}`)
  }

  useEffect(() => {
    if (!globalCtx.token.isLogin) {
      history.push('/login')
    }
  }, [globalCtx.token.isLogin])

  return (
    <div id="storyPage">
      <Header position={'sticky'} title="사연 보관함" type={'back'}/>
      <div className='content'>
        {
          temporaryData.length > 0 ?
            <>
              <p className='reference'>※ 최근 3개월 내역만 볼 수 있습니다.</p>
              <div className='storyWrap'>
                {
                  temporaryData.map((data, index) => {
                    return (
                      <div className='storyList' key={index}>
                        <div className='thumbnail' onClick={() => {goLink(`${data.memNo}`)}}>
                          <img src={data.profImg} alt=""/>
                        </div>
                        <div className='listContent'>
                          <div className='dataInfo'>
                            <div className='infoWrap'>
                              <div className='userNick' onClick={() => {goLink(`${data.memNo}`)}}>{data.nickNm}</div>
                              <div className='writeTime'>{moment(data.writeDt).format('YYYY.MM.DD hh:mm')}</div>
                            </div>
                            <div className='delBtnWrap'>
                              <span className='delBtn'>삭제</span>
                            </div>
                          </div>
                          <div className='messageWrap'>
                            {data.contents}
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>              
            </>
           :
            <></>
        }
      </div>
    </div>
  )
}
