import React, {useEffect, useState, useContext} from 'react'

import Swiper from 'react-id-swiper'

import './dallaClip.scss'

const swiperParams = {
  loop: true,
  spaceBetween: 8,
}

export default function dallaClip() {

  return (
    <div id="dallaClip">
      <div className="header">
        클립
        <div className="headerRight">
          <div className="headerRightIcon">
            1
          </div>
          <div className="headerRightIcon">
            2
          </div>
          <div className="headerRightIcon">
            3
          </div>
        </div>
      </div>
      <section>
        <div className="title" style={{marginTop:'17px'}}>
          지금, 핫한 클립을 한눈에!
          <div className="titleMore">더보기</div>
        </div>
        <div className="content">
            <div className="hotClipBox">
              <div className="hotClip">
                <div className="hotClipImg"></div>
                <div className="hotClipData">
                  <div className="hotClipRank">1</div>
                  <div className="hotClipTitle">
                    <span className="hotClipSubject">커버/노래</span>
                    클립 제목ㅡㅡㅡㅡㅡㅡㅡㅡㅡ
                  </div>
                  <div className="hotClipSubTit">
                    클립내용설명 서브타이틀?
                  </div>
                </div>
              </div>
              <div className="hotClip">
                <div className="hotClipImg"></div>
                <div className="hotClipData">
                  <div className="hotClipRank">2</div>
                  <div className="hotClipTitle">
                    <span className="hotClipSubject">작사/작곡</span>
                    IU - BBIbbi
                  </div>
                  <div className="hotClipSubTit">
                    이 선 넘으면 정색이야
                  </div>
                </div>
              </div>
              <div className="hotClip">
                <div className="hotClipImg"></div>
                <div className="hotClipData">
                  <div className="hotClipRank">3</div>
                  <div className="hotClipTitle">
                    <span className="hotClipSubject">ASMR</span>
                    IU - 조각집 cover.
                  </div>
                  <div className="hotClipSubTit">
                    기운팍팍 목요일
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>
      <section>
        <div className="content">
          <Swiper {...swiperParams}>
           <div className="bestClipBox">
             <div className="bestClipTitle">1월 2주차 베스트 클립</div>
             <div className="bestClipSubTit">올 한해를 돌아보는 클립들</div>
           </div>
           <div className="bestClipBox">
             <div className="bestClipTitle">2월 2주차 베스트 클립</div>
             <div className="bestClipSubTit">올 한해를 돌아보는 클립들</div>
           </div>
          </Swiper>
        </div>
      </section>
      <section>
        <div className="title">
          <span className="userName">징꾸</span>님의 클립서랍
        </div>
        <div className="content">
           <div className="subTitle">
             최근 들은 클립
             <div className="titleMore">더보기</div>
           </div>
           <div className="clipDrawerWrap">
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">클립제목ㅡㅡㅡㅡㅡㅡㅡ</div>
               <div className="clipDrawerUser">유저이름ㅡㅡㅡㅡㅡㅡㅡㅡ</div>
             </div>
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">Dali van Picasso</div>
               <div className="clipDrawerUser">립밤이 필요할 때</div>
             </div>
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">Weekend</div>
               <div className="clipDrawerUser">오늘도 라이브</div>
             </div>
           </div>
           <div className="subTitle">
             좋아요 한 클립
             <div className="titleMore">더보기</div>
           </div>
           <div className="clipDrawerWrap">
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">클립제목ㅡㅡㅡㅡㅡㅡㅡ</div>
               <div className="clipDrawerUser">유저이름ㅡㅡㅡㅡㅡㅡㅡㅡ</div>
             </div>
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">Dali van Picasso</div>
               <div className="clipDrawerUser">립밤이 필요할 때</div>
             </div>
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">Weekend</div>
               <div className="clipDrawerUser">오늘도 라이브</div>
             </div>
           </div>
        </div>
      </section>
      <section>
        <div className="title">
          방금 떠오른 클립
          <div className="titleMore">더보기</div>
        </div>
        <div className="content">
           
        </div>
      </section>
      <section>
        <div className="title">
          좋아하는 주제를 골라볼까요?
          <div className="titleMore">더보기</div>
        </div>
        <div className="content">
           <div className="likeSubWrap">
             <div className="likeSub">
               <p>🎤</p>
               <p>커버/노래</p>
             </div>
             <div className="likeSub">
               <p>💃</p>
               <p>성우</p>
             </div>
             <div className="likeSub">
               <p>🌱</p>
               <p>힐링</p>
             </div>
             <div className="likeSub">
               <p>🎼</p>
               <p>작사/작곡</p>
             </div>
             <div className="likeSub">
               <p>🤧</p>
               <p>고민/사연</p>
             </div>
           </div>
        </div>
      </section>
      <section>
        <div className="title">
          고민 / 사연은 어떠세요?
          <div className="titleMore">새로고침</div>
        </div>
        <div className="content">
        <div className="clipDrawerWrap">
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">클립제목ㅡㅡㅡㅡㅡㅡㅡ</div>
               <div className="clipDrawerUser">유저이름ㅡㅡㅡㅡㅡㅡㅡㅡ</div>
             </div>
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">Dali van Picasso</div>
               <div className="clipDrawerUser">립밤이 필요할 때</div>
             </div>
             <div className="clipDrawer">
               <div className="clipDrawerPhoto"></div>
               <div className="clipDrawerTitle">Weekend</div>
               <div className="clipDrawerUser">오늘도 라이브</div>
             </div>
           </div>
        </div>
      </section>
    </div>
  )
}


