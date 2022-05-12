import React, {useEffect, useState, useCallback, useMemo} from 'react';

import Api from 'context/api';
import './style.scss';
// global components
import Header from '../../components/ui/header/Header';
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import LayerPopup from '../../components/ui/layerPopup/LayerPopup2';
// components
import ProfileSwiper from './components/ProfileSwiper';
import ProfileCard from './components/profileCard';
import ProfileInfo from './components/ProfileInfo';
import SocialContents from './components/SocialContents';
import SlidepopZip from './components/popup/SlidepopZip';
import ProfileNoticePop from "pages/profile/components/popup/ProfileNoticePop";

import {useHistory, useParams} from 'react-router-dom';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setProfileData} from "redux/actions/profile";
import {profileDefaultState} from "redux/types/profileType";
import {setSlidePopupOpen} from "redux/actions/common";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const ProfilePage = () => {
  const history = useHistory();
  const params = useParams();

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const profileData = useSelector(state => state.profile);
  const popup = useSelector(state => state.popup);
  const member = useSelector(state => state.member);

  const [webview, setWebview] = useState('');
  const [isMyProfile, setIsMyProfile] = useState(false); // 내프로필인지
  const [profileReady, setProfileReady] = useState(false); // 페이지 mount 후 ready
  
  const [showSlide, setShowSlide] = useState({visible: false, imgList: [], initialSlide: 0}); // 프사 확대 슬라이드

  const [slidePopInfo, setSlidePopInfo] = useState({
    data: profileData, memNo: profileData.memNo, nickNm: profileData.nickNm, type: "", fanStarType: "", likeType: {titleTab: 0, subTab: 0, subTabType: ''},
  }); // 슬라이드 팝업 정보

  /* 상단 스와이퍼에서 사용하는 profileData (대표사진 제외한 프로필 이미지만 넣기) */
  const profileDataNoReader = useMemo(() => {
    if (profileData?.profImgList?.length > 1) {
      return {...profileData, profImgList: profileData?.profImgList.concat([]).filter((data, index)=> !data.isLeader)};
    } else {
      return profileData;
    }
  },[profileData]);

  {/* 프로필 데이터 호출 */}
  const getProfileData = () => {
    let targetMemNo = params.memNo ? params.memNo : member.memNo !== "" ? member.memNo : globalState.profile.memNo;
    Api.profile({params: {memNo: targetMemNo }}).then(res => {
      if(res.code === '0') {
        dispatch(setProfileData(res.data))
      }else {
        dispatch(setGlobalCtxMessage({type:'alert',
          callback: () => history.goBack(),
          msg: res.message
        }))
      }
    })
  };

  {/* 프로필 이동 */}
  const goProfile = memNo => {
    if(memNo) {
      if(isMyProfile) {
        if(globalState.profile.memNo !== memNo) {
          history.push(`/profile/${memNo}`)
        }
      }else {
        if(params.memNo !== memNo) {
          history.push(`/profile/${memNo}`)
        }
      }
    }
  };

  {/* 프로필 사진 확대 */}
  const openShowSlide = (data, isList = "y", keyName='profImg', initialSlide= 0) => {
    const getImgList = data => data.map(item => item[keyName])
    let list = [];
    isList === 'y' ? list = getImgList(data) : list.push(data);

    setShowSlide({visible: true, imgList: list, initialSlide});
  };

  {/* 프로필 사진 확대 닫기 */}
  const closeShowSlide = useCallback(() => {
    setShowSlide({visible: false, imgList: [], initialSlide: 0});
  },[]);
  
  {/* 프로필 데이터 초기화 */}
  const resetProfileData = () => {
    dispatch(setProfileData(profileDefaultState)); // 프로필 상단
  }

  {/* 슬라이드 팝업 오픈 */}
  const openSlidePop = (e, targetData = null) => {
    const {targetType} = e.currentTarget.dataset;
    switch (targetType) {
      case "header":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "header"});
        break;
      case "block":
        setSlidePopInfo({...slidePopInfo, data: targetData, memNo: targetData.memNo, nickNm: targetData.nickNm, type: "block"});
        break;
      case "fan":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "fanStar", fanStarType: targetType});
        break;
      case "star":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "fanStar", fanStarType: targetType});
        break;
      // likeType (isMyProfile && titleTab: 0=팬 랭킹, 1=전체 랭킹, subTab: 0={최근, 선물}, 1={누적, 좋아요}, subTabType: "fanRank", "totalRank")
      // likeType (!isMyProfile && titleTab: 0=랭킹, subTab: 0=최근팬, 1=누적팬, 2=좋아요, subTabType: "")
      case "like":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "like", likeType: {titleTab: isMyProfile ? 1 : 0, subTab: isMyProfile ? 1 : 2, subTabType: isMyProfile ? 'totalRank' : ''}});
        break;
      case "top3":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "like", likeType: {titleTab: 0, subTab: 0, subTabType: isMyProfile ? 'fanRank' : ''}});
        break;
      case "cupid":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "like", likeType: {titleTab: isMyProfile ? 1 : 0, subTab: isMyProfile ? 1 : 2, subTabType: isMyProfile ? 'totalRank' : ''}});
        break;
      case "present":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "present"});
        break;
    }
    dispatch(setSlidePopupOpen());
  };

  /* 페이지 이동 */
  useEffect(() => {
    if(globalState.token.isLogin) {
      if(profileReady) {
        getProfileData(); // 프로필 상단 데이터
      }
    }else {
      history.replace('/login');
    }
  }, [location.pathname]);

  useEffect(() => {
    if(!globalState.token.isLogin) {
      return history.replace('/login');
    }
    getProfileData(); // 프로필 상단 데이터
    setIsMyProfile(!params.memNo); // 내 프로필인지 체크
    setProfileReady(true);
    
    window.scrollTo(0, 0); // 스크롤 위치를 기억하는 경우가 있어서 0으로 초기화 해준다.
    return () => {
      resetProfileData();
    }
  }, []);

  // 페이지 시작
  return (
    <div id="myprofile">
      <Header title={`${profileData.nickNm}`} type="back">
        <div className="buttonGroup">
        {isMyProfile ?
          <button className="editBtn" onClick={() => history.push('/myProfile/edit')}>편집</button>
          :
          <button className="moreBtn" data-target-type="header" onClick={openSlidePop}>더보기</button>
        }
        </div>
      </Header>

      {/* 프로필 슬라이더 */}
      <ProfileSwiper
        data={profileDataNoReader}
        listenOpen={profileData.listenOpen}
        webview={webview}
        openShowSlide={openShowSlide}
        type="profile"/>

      {/* 프로필 메인 정보 */}
      <ProfileCard
        data={profileData}
        isMyProfile={isMyProfile}
        openShowSlide={openShowSlide}
        openSlidePop={openSlidePop}/>

      {/* 프로필 서브 정보 */}
      <ProfileInfo
        data={profileData}
        goProfile={goProfile}
        openSlidePop={openSlidePop}
        isMyProfile={isMyProfile} />
      
      {/* 소셜 컨텐츠 */}
      <SocialContents
        webview={webview}
        setWebview={setWebview}
        openSlidePop={openSlidePop}
        profileReady={profileReady}
        isMyProfile={isMyProfile} />

      {/* 프로필 사진 확대 */}
      {showSlide?.visible &&
        <ShowSwiper
          imageList={showSlide?.imgList}
          popClose={closeShowSlide}
          swiperParam={{initialSlide: showSlide?.initialSlide}} />
      }

      {/* 슬라이드 팝업 모음 */}
      {popup.slidePopup &&
        <SlidepopZip
          slideData={slidePopInfo}
          goProfile={goProfile}
          openSlidePop={openSlidePop}
          isMyProfile={isMyProfile} />
      }

      {/* 좋아요 -> ? 아이콘 */}
      {popup.layerPopup &&
        <LayerPopup title="랭킹 기준">
          <ProfileNoticePop />
        </LayerPopup>
      }
    </div>
  )
}

export default ProfilePage;
