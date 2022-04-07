import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'

import './style.scss'
import Header from "components/ui/header/Header";
import MyInfo from "pages/remypage/components/MyInfo";
import MyMenu from "pages/remypage/components/MyMenu";
import BannerSlide from 'components/ui/bannerSlide/BannerSlide'
import Report from "./contents/report/Report"
import Clip from "./contents/clip/clip"
import Setting from "pages/resetting";
import Customer from "pages/recustomer";
import Team from "pages/team";

import {Hybrid, isHybrid} from "context/hybrid";
import Utility from "components/lib/utility";
import {OS_TYPE} from "context/config";
import PopSlide, {closePopup} from "components/ui/popSlide/PopSlide";
import LevelItems from "components/ui/levelItems/LevelItems";
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";
import Notice from "pages/remypage/contents/notice/Notice";
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";

const Remypage = () => {
  const history = useHistory()
  const params = useParams()
  const settingCategory = params.category;
  //context
  const context = useContext(Context)
  const {splash, token, profile} = context;
  const customHeader = JSON.parse(Api.customHeader)
  const commonPopup = useSelector(state => state.popup);
  const alarmData = useSelector(state => state.newAlarm);
  const dispatch = useDispatch();

  const [noticeNew, setNoticeNew] = useState(false);
  

  const settingProfileInfo = async (memNo) => {
    const {result, data, message, code} = await Api.profile({params: {memNo: memNo}})
    if (result === 'success') {
      context.action.updateProfile(data);
    } else {
      if (code === '-5') {
        context.action.alert({
          callback: () => history.goBack(),
          msg: message
        })
      } else {
        context.action.alert({
          callback: () => history.goBack(),
          msg: '회원정보를 찾을 수 없습니다.'
        })
      }
    }
  }

  const logout = () => {
    Api.member_logout().then(res => {
      if (res.result === 'success') {
        if (isHybrid()) {
          Hybrid('GetLogoutToken', res.data)
        }
        context.action.updateToken(res.data)
        context.action.updateProfile(null)
        // props.history.push('/')
        window.location.href = '/'
      } else if (res.result === 'fail') {
        context.action.alert({
          title: '로그아웃 실패',
          msg: `${res.message}`
        })
      }
    });
  }

  // 프로필 페이지로 이동
  const goProfile = () => history.push('/myProfile');

  // 페이지 셋팅
  useEffect(() => {
    if (!token.isLogin) {
      return history.replace('/login')
    }

    if(profile.memNo) {
      settingProfileInfo(profile.memNo)
    }
  }, [])

  //충전하기 버튼
  const storeAndCharge = () => {
    if (context.customHeader['os'] === OS_TYPE['IOS']) {
      return webkit.messageHandlers.openInApp.postMessage('')
    } else {
      history.push('/store')
    }
  }

  const openLevelPop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setSlidePopupOpen());
  }

  const closeLevelPop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closePopup(dispatch);
  }

  useEffect(() => {
    if(alarmData.notice > 0){
      setNoticeNew(true)
    } else {      
      setNoticeNew(false)
    }
  }, [alarmData.notice]);

  // 페이지 시작
  switch (settingCategory) {
    case 'report' :
      return(<Report />)
    case 'myclip' :
      return(<Clip />)
    case 'setting' :
      return(<Setting />)
    case 'notice' :
      return(<Notice />)
    case 'customer' :
      return(<Customer />)
    case 'team' :
      return(<Team />)
    default :
      return(
        <>
        <div id="remypage">
          <Header title={'MY'} />
          <section className='mypageTop'>
            <div className="myInfo" onClick={goProfile}>
              <MyInfo data={profile} openLevelPop={openLevelPop} />
            </div>
            <div className='mydalDetail'>
              <div className="dalCount">
                <span>달 지갑</span>
                <div>
                  <span>{Utility.addComma(profile?.dalCnt)}</span>개
                </div>
              </div>
              <div className="buttonGroup">
                <button className='charge' onClick={storeAndCharge}>+ 충전하기</button>
              </div>
            </div>
            <div className='myData'>
              <div className='myDataList' onClick={() => history.push('/wallet')}>
                <span className='icon wallet'></span>
                <span className="myDataType">내 지갑</span>
              </div>
              <div className='myDataList' onClick={() => history.push('/report')}>
                <span className='icon report'></span>
                <span className="myDataType">방송리포트</span>
              </div>
              <div className='myDataList' onClick={() => history.push('/myclip')}>
                <span className='icon clip'></span>
                <span className="myDataType">클립 관리</span>
              </div>
              <div className='myDataList' onClick={() => history.push('/setting')}>
                <span className='icon setting'></span>
                <span className="myDataType">서비스 설정</span>
              </div>
              <div className='myDataList' onClick={() => history.push('/notice')}>
                <span className={`icon notice ${!noticeNew ? "new" : ""}`}></span>
                <span className="myDataType">공지사항</span>
              </div>
              <div className='myDataList' onClick={() => history.push('/customer')}>
                <span className='icon customer'></span>
                <span className="myDataType">고객센터</span>
              </div>
            </div>
          </section>
          <section className='bannerWrap'>
            <BannerSlide type={18}/>
          </section>            
          {isHybrid() &&
            <section className="versionInfo">
              <span className="title">버전정보</span>
              <span className="version">현재 버전 {customHeader.appVer}</span>
            </section>
          }
          <button className='logout' onClick={logout}>로그아웃</button>

          {commonPopup.commonPopup &&
            <PopSlide title="내 레벨">
              <section className="myLevelInfo">
                <div className="infoItem">
                  <LevelItems data={profile?.level} />
                  <span>{profile?.grade}</span>
                  <p>{profile?.expRate}%</p>
                </div>
                <div className="levelGauge">
                  <span className="gaugeBar" style={{width:`${profile?.expRate}%`}}></span>
                </div>
                <div className="exp">다음 레벨까지 {profile?.expNext} EXP 남음</div>
                <SubmitBtn text="확인" onClick={closeLevelPop} />
              </section>
            </PopSlide>
          }
        </div>
      </>
      )
  }
}

export default Remypage
