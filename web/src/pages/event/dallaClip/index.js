import React from 'react'

import Swiper from 'react-id-swiper'
import Header from 'components/ui/new_header'
import CntTitle from '../../../components/ui/cntTitle/CntTitle';
import ClipList from './components/clipList'

import './dallaClip.scss'
import {useDispatch, useSelector} from "react-redux";

const ClipPage = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  // μ€μμ΄νΌ params
  const swiperParams = {
    slidesPerView: 'auto',
  }

  const likeSubjectLists = [
    {
      icon: 'π€',
      name: 'μ»€λ²/λΈλ'
    },
    {
      icon : 'π±',
      name : 'νλ§'
    },
    {
      icon : 'πΌ',
      name : 'μμ¬/μκ³‘'
    },
    {
      icon : 'π€§',
      name : 'κ³ λ―Ό/μ¬μ°'
    },
    {
      icon : 'π',
      name : 'μ±μ°'
    },
    {
      icon : 'πΊ',
      name : 'λλΉ'
    },
  ]
  const hotClipLists = [
    {
      rank : '1',
      title : 'μ λͺ©1',
      name : 'μ μ λλ€μ1'
    },
    {
      rank : '2',
      title : 'μ λͺ©2',
      name : 'μ μ λλ€μ2'
    },
    {
      rank : '3',
      title : 'μ λͺ©3',
      name : 'μ μ λλ€μ3'
    }
  ]
  const clipLists = [
    {
      title : 'ν΄λ¦½μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘',
      name : 'μ μ μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘'
    },
    {
      title : 'Dali Van Pissaco',
      name : 'λ¦½λ°₯μ΄ νμν  λ'
    },
    {
      title : 'μ§μ¬λ κ³ λ―Ό μ¬μ°',
      name : 'μ΄μ§κΈ'
    },
    {
      title : 'μΉ΄νμμ νΈνκ²γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘',
      name : 'λ¬λμ νΈν κ°¬μ±'
    },
    {
      title : 'μλνμΈμ',
      name : 'λ¬λμ νΈν κ°¬μ±'
    },
  ]

  return (
    <div id="clipPage">
      <Header title="ν΄λ¦½"></Header>
      <section className='hotClipWrap'>
        <CntTitle title={'μ§κΈ, ν«ν ν΄λ¦½μ νλμ!'} more={'/'} />
        <Swiper {...swiperParams}>
          <div className="hotClipBox">
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <img className="hotClipRank" src="https://image.dalbitlive.com/clip/dalla/hotClipRank1.png" alt="" />
                <div className="hotClipTitle">
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
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
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
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
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
              </div>
            </div>
            <div className="hotClip">
              <div className="hotClipImg"></div>
              <div className="hotClipData">
                <div className="hotClipRank">1</div>
                <div className="hotClipTitle">
                  <span className="hotClipSubject">μ»€λ²/λΈλ</span>
                  μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
                </div>
                <div className="hotClipSubTit">
                  μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘
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
        <CntTitle title={`${globalState.profile.nickNm}λμ ν΄λ¦½μλ`}/>
        <div className="subTitle">
          μ΅κ·Ό λ€μ ν΄λ¦½
          <div className="titleMore">λλ³΄κΈ°</div>
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
          μ’μμ ν ν΄λ¦½
          <div className="titleMore">λλ³΄κΈ°</div>
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
          λ°©κΈ λ μ€λ₯Έ ν΄λ¦½
          <div className="titleMore">λλ³΄κΈ°</div>
        </div>
        <Swiper {...swiperParams}>
          <div className="bannerClipBox">
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘</div>
                <div className="bannerClipName">μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©</div>
                <div className="bannerClipName">μ΄λ¦</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©</div>
                <div className="bannerClipName">μ΄λ¦</div>
              </div>
            </div>
          </div>
          <div className="bannerClipBox">
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘</div>
                <div className="bannerClipName">μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©</div>
                <div className="bannerClipName">μ΄λ¦</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©</div>
                <div className="bannerClipName">μ΄λ¦</div>
              </div>
            </div>
          </div>
          <div className="bannerClipBox">
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘</div>
                <div className="bannerClipName">μ΄λ¦γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘γ‘</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©</div>
                <div className="bannerClipName">μ΄λ¦</div>
              </div>
            </div>
            <div className="bannerClip">
              <div className="bannerClipImg"></div>
              <div className="bannerClipContent">
                <div className="bannerClipTitle">μ λͺ©</div>
                <div className="bannerClipName">μ΄λ¦</div>
              </div>
            </div>
          </div>
        </Swiper>
      </section>
      <section className='likeSubWrap'>
        <div className="title">
          μ’μνλ μ£Όμ λ₯Ό κ³¨λΌλ³ΌκΉμ?
          <div className="titleMore">λλ³΄κΈ°</div>
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
          κ³ λ―Ό / μ¬μ°μ μ΄λ μΈμ?
          <div className="titleMore">μλ‘κ³ μΉ¨</div>
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
