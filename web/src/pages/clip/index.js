import React, {useEffect, useState, useContext} from 'react'
import {Context} from "context";

import Api from 'context/api'
import Swiper from 'react-id-swiper'
import {convertDateFormat} from 'components/lib/dalbit_moment'
import moment from 'moment';

import Header from 'components/ui/new_header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import ListRow from 'components/ui/listRow/ListRow'
import ListColumn from 'components/ui/listColumn/ListColumn'
import ClipSubTitle from './components/clipSubTitle'
import HotClipList from './components/hotClipList'
import ClipList from './components/clipList'


import './dallaClip.scss'

const ClipPage = () => {
  const context = useContext(Context);

  const [clipList, setCliipList] = useState([])
  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }

  const fetchClipList = () => {
    Api.getMyClipData({}).then((res) => {
      if (res.result === 'success') {
        setCliipList(res.data)
      }
    })
  }

  const fetchClipRankList = () => {
    Api.getClipRankingList({
      rankType: 1,
      rankingDate: convertDateFormat(new Date(), 'YYYY-MM-DD'),
      page: 1,
      records: 20
    }).then((res) => {
      if (res.result === 'success') {
        setCliipList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchClipList()
    fetchClipRankList()
  },[])

  const likeSubjectLists = [
    {
      icon : '🎤',
      name : '커버/노래'
    },
    {
      icon : '🌱',
      name : '힐링'
    },
    {
      icon : '🎼',
      name : '작사/작곡'
    },
    {
      icon : '🤧',
      name : '고민/사연'
    },
    {
      icon : '💃',
      name : '성우'
    },
    {
      icon : '📺',
      name : '더빙'
    },
  ]
  const hotClipData = [1,2,3]
  const hotClipLists = [
    {
      rank : '1',
      title : '제목1',
      nickNm: '유저닉네임1'
    },
    {
      rank : '2',
      title : '제목2',
      nickNm : '유저닉네임2'
    },
    {
      rank : '3',
      title : '제목3',
      nickNm : '유저닉네임3'
    }
  ]
  const clipLists = [
    {
      title : '클립제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
      nickNm : '유저이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ'
    },
    {
      title : 'Dali Van Pissaco',
      nickNm : '립밥이 필요할 때'
    },
    {
      title : '짝사랑 고민 사연',
      nickNm : '이지금'
    },
    {
      title : '카페에서 편하게ㅡㅡㅡㅡㅡㅡㅡㅡ',
      nickNm : '달디의 편한 갬성'
    },
    {
      title : '안녕하세요',
      nickNm : '달디의 편한 갬성'
    },
  ]
  
  return (
    <div id="clipPage">
      <Header type={'noBack'}>
        <h2 className='header-title'>클립</h2>
        <div className="iconWrap">
          <img src="https://image.dalbitlive.com/clip/dalla/message.png" />
          <img src="https://image.dalbitlive.com/clip/dalla/alarmOff.png" />
        </div>
      </Header>
      <section className='hotClipWrap'>
        <CntTitle title={'지금, 핫한 클립을 한눈에!'} more={'/'} />
        {hotClipData && hotClipData.length > 0 && 
          <Swiper {...swiperParams}>
            {hotClipData.map((data,index) => {
              return (
                <div className="listWrap" key={index}>
                  {hotClipLists && hotClipLists.length > 0 &&
                    <>
                      {hotClipLists.map((list,index) => {
                        return (
                          <ListRow data={hotClipLists} key={index}>
                            <div className='listContent'>
                              <div className="listItem">
                                <img className="rankImg" src="https://image.dalbitlive.com/clip/dalla/hotClipRank1.png" alt="" />
                              </div>
                              <div className="listItem">
                                <span className="subject">커버/노래</span>
                                <span className='title'>제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
                              </div>
                              <div className="listItem">
                                <span className='nick'>이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
                              </div>
                            </div>
                          </ListRow>
                        )
                      })}
                    </>
                  }
                </div>
              )
            })}
          </Swiper>
        }
      </section>
      
      <section className='bannerWrap'>
        <Swiper {...swiperParams}>
          <div className="bannerBox">
            <div className="bannerItem"></div>
          </div>
          <div className="bannerBox">
            <div className="bannerItem"></div>
          </div>
          <div className="bannerBox">
            <div className="bannerItem"></div>
          </div>
        </Swiper>
      </section>
      <section className="clipListWrap">
        <CntTitle title={`${context.profile.nickNm}님의 클립서랍`} />
        <ClipSubTitle title={'최근 들은 클립'} more={'/'} />
        <Swiper {...swiperParams}>
          {clipLists.map((clipList, index)=>{
            return(
              <div key={index}>
                <ListColumn data={clipList}>
                  <div className="title">{clipList.title}</div>
                  <div className="nick">{clipList.nickNm}</div>
                </ListColumn>
              </div>
            )
          })}
        </Swiper>
        <ClipSubTitle title={'좋아요 한 클립'} more={'/'}/>
        <Swiper {...swiperParams}>
          {clipLists.map((clipList, index)=>{
            return(
              <div key={index}>
                <ListColumn data={clipList}>
                  <div className="title">{clipList.title}</div>
                  <div className="nick">{clipList.nickNm}</div>
                </ListColumn>
              </div>
            )
          })}
        </Swiper>
      </section>
      <section className="bannerClipWrap">
        <CntTitle title={'방금 떠오른 클립'} more={'/'} />
        {hotClipData && hotClipData.length > 0 && 
          <Swiper {...swiperParams}>
            {hotClipData.map((data,index) => {
              return (
                <div className="listWrap" key={index}>
                  {hotClipLists && hotClipLists.length > 0 &&
                    <>
                      {hotClipLists.map((list,index) => {
                        return (
                          <ListRow data={hotClipLists} key={index}>
                            <div className='listContent'>
                              <span className='title'>제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
                              <span className='nick'>이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</span>
                            </div>
                          </ListRow>
                        )
                      })}
                    </>
                  }
                </div>
              )
            })}
          </Swiper>
        }
      </section>
      <section className='likeSubWrap'>
        <CntTitle title={'좋아하는 주제를 골라볼까요?'} more={'/'} />
        <Swiper {...swiperParams}>
          {likeSubjectLists.map((list, index)=>{
            return(
              <div className="likeSubWrap" key={index}>
                <div className="likeSub">
                  <p>{list.icon}</p>
                  <p>{list.name}</p>
                </div>
              </div>
            )
          })}
        </Swiper>
      </section>
      <section className="clipListWrap">
        <CntTitle title={'고민 / 사연 은 어떠세요?'} more={'/'} />
        <Swiper {...swiperParams}>
          {clipLists.map((clipList, index)=>{
            return(
              <div key={index}>
                <ListColumn data={clipList}>
                  <div className="title">{clipList.title}</div>
                  <div className="nick">{clipList.nickNm}</div>
                </ListColumn>
              </div>
            )
          })}
        </Swiper>
      </section>
    </div>
  )
}

export default ClipPage