import React, {useEffect, useState, useContext} from 'react'
import {Context} from "context";

import Swiper from 'react-id-swiper'
import Header from 'components/ui/new_header'
import CntTitle from '../../../components/ui/cntTitle/CntTitle';
import HotClipList from './components/hotClipList'
import ClipList from './components/clipList'

import './dallaClip.scss'

const ClipPage = () => {
  const context = useContext(Context);
  // 스와이퍼 params
  const swiperParams = {
    slidesPerView: 'auto',
  }

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
  const hotClipLists = [
    {
      rank : '1',
      title : '제목1',
      name : '유저닉네임1'
    },
    {
      rank : '2',
      title : '제목2',
      name : '유저닉네임2'
    },
    {
      rank : '3',
      title : '제목3',
      name : '유저닉네임3'
    }
  ]
  const clipLists = [
    {
      title : '클립제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ',
      name : '유저이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ'
    },
    {
      title : 'Dali Van Pissaco',
      name : '립밥이 필요할 때'
    },
    {
      title : '짝사랑 고민 사연',
      name : '이지금'
    },
    {
      title : '카페에서 편하게ㅡㅡㅡㅡㅡㅡㅡㅡ',
      name : '달디의 편한 갬성'
    },
    {
      title : '안녕하세요',
      name : '달디의 편한 갬성'
    },
  ]
  
  return (
    <div id="clipPage">
      <Header title="클립"></Header>
      <section className='hotClipWrap'>
        <CntTitle title={'지금, 핫한 클립을 한눈에!'} more={'/'} />
        <Swiper {...swiperParams}>
          <div className="hotClipBox">
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <img className="hotClipRank" src="https://image.dalbitlive.com/clip/dalla/hotClipRank1.png" alt="" />
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
          </div>
          <div className="hotClipBox">
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
          </div>
          <div className="hotClipBox">
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">커버/노래</span>
                  제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
                <div className="hotClipSubTit">
                  이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                </div>
              </div>
            </div>
          </div>
          {/* <div className="hotClipBox">
            {hotClipLists.map((hotClipList, index)=>{
              return(
                <div key={index}>
                  <HotClipList hotClipList={hotClipList} />
                </div>
              )
            })}
          </div> */}
        </Swiper>
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
        <div className="subTitle">
          최근 들은 클립
          <div className="titleMore">더보기</div>
        </div>
        <Swiper {...swiperParams}>
          {clipLists.map((clipList, index)=>{
            return(
              <div key={index}>
                <ClipList clipList={clipList} />
              </div>
            )
          })}
        </Swiper>
        <div className="subTitle" style={{marginTop:'16px'}}>
          좋아요 한 클립
          <div className="titleMore">더보기</div>
        </div>
        <Swiper {...swiperParams}>
          {clipLists.map((clipList, index)=>{
            return(
              <div key={index}>
                <ClipList clipList={clipList} />
              </div>
            )
          })}
        </Swiper>
      </section>
      <section className="bannerClipWrap">
        <div className="title">
          방금 떠오른 클립
          <div className="titleMore">더보기</div>
        </div>
        <Swiper {...swiperParams}>
          <div className="bannerClipBox">
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
                <div className="bannerClipName">이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목</div>
                <div className="bannerClipName">이름</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목</div>
                <div className="bannerClipName">이름</div>
              </div>
            </div>
          </div>
          <div className="bannerClipBox">
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
                <div className="bannerClipName">이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목</div>
                <div className="bannerClipName">이름</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목</div>
                <div className="bannerClipName">이름</div>
              </div>
            </div>
          </div>
          <div className="bannerClipBox">
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
                <div className="bannerClipName">이름ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목</div>
                <div className="bannerClipName">이름</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">제목</div>
                <div className="bannerClipName">이름</div>
              </div>
            </div>
          </div>
        </Swiper>
      </section>
      <section className='likeSubWrap'>
        <div className="title">
          좋아하는 주제를 골라볼까요?
          <div className="titleMore">더보기</div>
        </div>
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
        <div className="title">
          고민 / 사연은 어떠세요?
          <div className="titleMore">새로고침</div>
        </div>
        <Swiper {...swiperParams}>
          {clipLists.map((clipList, index)=>{
            return(
              <div key={index}>
                <ClipList clipList={clipList}></ClipList>
              </div>
            )
          })}
        </Swiper>
      </section>
    </div>
  )
}

export default ClipPage