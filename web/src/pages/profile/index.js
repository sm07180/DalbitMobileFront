import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'
import './index.scss'
import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import TopSwiper from './components/TopSwiper'
import ProfileCard from './components/ProfileCard'
import TotalInfo from './components/TotalInfo'
import Tabmenu from './components/Tabmenu'
import FanStarLike from './components/popSlide/FanStarLike'
import BlockReport from './components/popSlide/BlockReport'
import ShowSwiper from "components/ui/showSwiper/showSwiper";
// contents
import FeedSection from './contents/profile/feedSection'
import FanboardSection from './contents/profile/fanboardSection'
import ClipSection from './contents/profile/clipSection'
// redux
import {useDispatch, useSelector} from "react-redux";
import {setProfileClipData, setProfileData, setProfileFanBoardData, setProfileFeedData} from "redux/actions/profile";
import {profileClipDefaultState, profileFanBoardDefaultState, profileFeedDefaultState} from "redux/types/profileType";

const socialTabmenu = ['피드','팬보드','클립']

const ProfilePage = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const tabMenuRef = useRef();
  const myprofileRef = useRef();
  const params = useParams();

  const [showSlide, setShowSlide] = useState(false);
  const [imgList, setImgList] = useState([]);
  const [socialType, setSocialType] = useState(socialTabmenu[0])
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [popSlide, setPopSlide] = useState(false);
  const [popFanStarLike, setPopFanStarLike] = useState(false);
  const [openFanStarLikeType, setOpenFanStarLikeType] = useState('');
  const [popBlockReport, setPopBlockReport] = useState(false);

  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);
  const feedData = useSelector(state => state.feed);
  const fanBoardData = useSelector(state => state.fanBoard);
  const clipData = useSelector(state => state.profileClip);

  /* 프로필 데이터 호출 */
  const getProfileData = () => {
    let targetMemNo = params.memNo ? params.memNo : context.profile.memNo;

    Api.profile({params: {memNo: targetMemNo }}).then(res => {
      if(res.code === '0') {
        dispatch(setProfileData(res.data))
      }else {
        context.action.alert({
          callback: () => history.goBack(),
          msg: res.message
        })
      }
    })
  };

  /* 피드 데이터 호출 */
  const getFeedData = () => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
      pageNo: 1,
      pagePerCnt: 9999,
      topFix: 0,
    }
    Api.mypage_notice_sel(apiParams).then(res => {
      if (res.result === 'success') {
        const data = res.data;
        dispatch(setProfileFeedData({
          feedList: data.list, // 피드(고정 피드 제외)
          fixedFeedList: data.fixList, // 고정 피드
          fixCnt: data.fixList.length, // 고정 피드 개수
          paging: data.paging, // 호출한 페이지 정보
          scrollPaging: { // 스크롤 페이징 정보
            ...feedData.scrollPaging,
            pageNo: 1,
            currentCnt: data.list.length,
          }
        }));
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    })
  }

  /* 팬보드 데이터 */
  const getFanBoardData = () => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
      page: 1,
      records: 9999
    }
    Api.mypage_fanboard_list({params: apiParams}).then(res => {
      if (res.result === 'success') {
        const data= res.data;
        dispatch(setProfileFanBoardData({...fanBoardData, list: data.list, paging: data.paging}));
      }
    })
  }

  /* 클립 데이터 */
  const getClipData = () => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
      page: 1,
      records: 10
    }
    Api.getUploadList(apiParams).then(res => {
      if (res.result === 'success') {
        dispatch(setProfileClipData(res.data));
      } else {
        context.action.alert({msg: message})
      }
    })
  }

  /* 프로필 이동 */
  const goProfile = memNo => {
    if(memNo) {
      if(isMyProfile) {
        if(context.profile.memNo !== memNo) {
          history.push(`/profile/${memNo}`)
        }
      }else {
        if(params.memNo !== memNo) {
          history.push(`/profile/${memNo}`)
        }
      }
    }
  }

  /* 헤더 더보기 버튼 클릭 */
  const openMoreList = () => {
    setPopSlide(true)
  }

  /* 프로필 사진 확대 */
  const openShowSlide = (data, isList = "y") => {
    const getImgList = data => data.map(item => item.profImg)
    let list = [];
    isList === 'y' ? list = getImgList(data) : list.push(data);

    setImgList(list);
    setShowSlide(true);
  }

  /* 팬,스타,좋아요 슬라이드 팝업 열기/닫기 */
  const openPopFanStarLike = (e) => {
    const {targetType} = e.currentTarget.dataset
    setOpenFanStarLikeType(targetType)
    setPopFanStarLike(true)
  }

  /* 프로필 데이터 초기화 (피드, 팬보드, 클립) */
  const resetProfileData = () => {
    dispatch(setProfileFeedData(profileFeedDefaultState));
    dispatch(setProfileFanBoardData(profileFanBoardDefaultState));
    dispatch(setProfileClipData(profileClipDefaultState));
  }

  /* 프로필 상단 데이터 */
  useEffect(() => {
    getProfileData();
  }, [history.location.pathname]);

  /* 피드 데이터 */
  useEffect(() => {
    if(socialType === socialTabmenu[0]) {
      getFeedData();
    }
  }, [socialType])

  /* 팬보드 */
  useEffect(() => {
    if(socialType === socialTabmenu[1]) {
      getFanBoardData();
    }
  }, [socialType]);

  /* 클립 */
  useEffect(() => {
    if(socialType === socialTabmenu[2]) {
      getClipData();
    }
  }, [socialType]);

  useEffect(() => {
    setIsMyProfile(!params.memNo);
    return () => {
      resetProfileData();
    }
  }, []);

  // 임시 변수
  let isIos = true

  // 페이지 시작
  return (
    <div id="myprofile" ref={myprofileRef}>
      <Header title={`${profileData.nickNm}`} type={'back'}>
        {isMyProfile ?
          <div className="buttonGroup">
            <button className='editBtn'>수정</button>
          </div>
          :
          <div className="buttonGroup">
            <button className='moreBtn' onClick={openMoreList}>더보기</button>
          </div>
        }
      </Header>
      <section className='topSwiper'>
        <TopSwiper data={profileData} openShowSlide={openShowSlide} />
      </section>
      <section className="profileCard">
        <ProfileCard data={profileData} isMyProfile={isMyProfile} openShowSlide={openShowSlide} openPopFanStarLike={openPopFanStarLike} />
      </section>
      <section className='totalInfo'>
        <TotalInfo data={profileData} goProfile={goProfile} />
      </section>
      <section className="socialWrap">
        <div className="tabmenuWrap">
          <Tabmenu data={socialTabmenu} tab={socialType} setTab={setSocialType} />  
          {isMyProfile && <button>등록</button>}
        </div>
        
        {/* 피드 */}
        {socialType === socialTabmenu[0] &&
          <FeedSection profileData={profileData} openShowSlide={openShowSlide} feedData={feedData} isMyProfile={isMyProfile} />
        }

        {/* 팬보드 */}
        {socialType === socialTabmenu[1] &&
          <FanboardSection profileData={profileData} fanBoardData={fanBoardData} isMyProfile={isMyProfile} />
        }

        {/* 클립 */}
        {socialType === socialTabmenu[2] &&
          <ClipSection profileData={profileData} clipData={clipData} isMyProfile={isMyProfile} />
        }

        {/* 프로필 사진 확대 */}
        {showSlide && <ShowSwiper imageList={imgList} popClose={setShowSlide} />}
      </section>
      {popSlide &&
        <PopSlide setPopSlide={setPopSlide}>
          <section className='profileMore'>
            <div className="moreList">메세지</div>
            <div className="moreList">방송 알림 OFF</div>
            {isIos && <div className="moreList">팬 취소하기</div>}
            <div className="moreList">차단/신고</div>
          </section>
        </PopSlide>
      }
      {popFanStarLike &&
        <PopSlide setPopSlide={setPopFanStarLike}>
          <FanStarLike type={openFanStarLikeType} isMyProfile={isMyProfile} />
        </PopSlide>
      }
      {popBlockReport &&
        <PopSlide setPopSlide={setPopBlockReport}>
          <BlockReport />
        </PopSlide>
      }
    </div>
  )
}

export default ProfilePage
