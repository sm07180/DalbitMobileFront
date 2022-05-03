import React, {useState, useEffect} from 'react'
import Api from 'context/api';
// global components
import Header from "../../components/ui/header/Header";
import BannerSlide from '../../components/ui/bannerSlide/BannerSlide';
// components
import MyInfo from "./components/MyInfo";
import MydalDetail from "./components/MydalDetail";
import MyMenu from "./components/MyMenu";
import MyBottom from "./components/MyBottom";
import SlidepopZip from "./components/popup/SlidepopZip";
import LayerPopup, {closeLayerPopup} from "../../components/ui/layerPopup/LayerPopup2";
import SpecialHistoryPop from "./components/popup/SpecialHistoryPop";
// scss
import './style.scss';

import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {setProfileData} from "redux/actions/profile";
import {setSlidePopupOpen, setCommonPopupOpenData} from "redux/actions/common";
import {setGlobalCtxMessage, setGlobalCtxUpdateProfile} from "redux/actions/globalCtx";

const Remypage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const commonPopup = useSelector(state => state.popup);
  const profileData = useSelector(state => state.profile);
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {token, profile} = globalState;

  const [teamInfo, setTeamInfo] = useState({teamNo: 0, new: 0, bgCode: "", edgeCode: "", medalCode: ""}); // 팀 정보
  const [slidePopInfo, setSlidePopInfo] = useState({
    data: profileData, memNo: profileData.memNo, type: "", fanStarType: "", likeType: 0
  }); // 슬라이드 팝업 정보

  {/* 기본 프로필 Api */}
  const settingProfileInfo = async (memNo) => {
    const {result, data, message, code} = await Api.profile({params: {memNo: memNo}})
    if (result === 'success') {
      dispatch(setProfileData(data));
    } else {
      if (code === '-5') {
        dispatch(setGlobalCtxMessage({type:'alert',
          callback: () => history.goBack(),
          msg: message
        }))
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',
          callback: () => history.goBack(),
          msg: '회원정보를 찾을 수 없습니다.'
        }))
      }
    }
  }

  {/* 팀 체크 Api */}
  const teamCheck = async(memNo)=>{
    const {data, code} = await Api.getTeamMemMySel({memNo: memNo})
    if (code === "00000") {
      setTeamInfo({...teamInfo, teamNo: data.team_no, new: data.req_cnt, bgCode: data.team_bg_code, edgeCode: data.team_edge_code, medalCode: data.team_medal_code})
    }
  }

  {/* 슬라이드 팝업 오픈 */}
  const openSlidePop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {targetType} = e.currentTarget.dataset;
    switch (targetType) {
      case "fan":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "fanStar", fanStarType: targetType});
        break;
      case "star":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "fanStar", fanStarType: targetType});
        break;
      case "like":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "like", fanStarType: ""});
        break;
      case "level":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "level", fanStarType: ""});
        break;
    }
    dispatch(setSlidePopupOpen());
  }

  const openLayerPop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setCommonPopupOpenData({...commonPopup, commonPopup: true}))
  }

  const closePopupAction = () => {
    closeLayerPopup(dispatch)
  }

  /* 프로필 이동 */
  const goProfile = memNo => {
    if(memNo) {
      if(params.memNo !== memNo) {
        history.push(`/profile/${memNo}`)
      }
    }
  }

  // 페이지 셋팅
  useEffect(() => {
    if (!token.isLogin) {
      return history.replace('/login')
    } else {
      if (profile.memNo) {
        settingProfileInfo(profile.memNo)
        teamCheck(profile.memNo)
      }
    }
  }, [profile])

  // 페이지 시작
  return(
    <div id="remypage">
      <Header title="MY" />
      <section className="mypageTop">
        {/* 간략 프로필 */}
        <MyInfo data={profileData} openSlidePop={openSlidePop} openStarDJHistoryPop={openLayerPop}/>

        {/* 달 지갑 정보 */}
        <MydalDetail />

        {/* 메뉴 모음 */}
        <MyMenu data={teamInfo} />
      </section>

      {/* 배너 리스트 */}
      <section className="bannerWrap">
        <BannerSlide type={18}/>
      </section>

      {/* 마이페이지 하단 (버전정보, 로그아웃 버튼) */}
      <MyBottom />

      {/* 슬라이드 팝업 모음 */}
      {commonPopup.slidePopup && <SlidepopZip slideData={slidePopInfo} goProfile={goProfile} />}

      {/* 스페셜DJ 약력 팝업 */}
      {commonPopup.layerPopup &&
        <LayerPopup>
          <SpecialHistoryPop
            profileData={profileData}/>
        </LayerPopup>
      }
    </div>
  )
}

export default Remypage;
