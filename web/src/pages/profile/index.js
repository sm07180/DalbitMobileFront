import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'

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
import ShowSwiper from "components/ui/showSwiper/showSwiper";
// contents
import FeedSection from './contents/profileDetail/feedSection'
import FanboardSection from './contents/profileDetail/fanboardSection'
import ClipSection from './contents/profileDetail/clipSection'
//css
import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setProfileData} from "redux/actions/profile";

const socialTabmenu = ['피드','팬보드','클립']

const ProfilePage = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context
  const tabMenuRef = useRef();
  const myprofileRef = useRef();
  const params = useParams();

  const [showSlide, setShowSlide] = useState({open: false});
  const [socialType, setSocialType] = useState(socialTabmenu[0])
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [popSlide, setPopSlide] = useState(false);
  const [popFanStarLike, setPopFanStarLike] = useState(false);
  const [openRelationType, setOpenRelationType] = useState('');

  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);

  /* 프로필 데이터 호출 */
  const getProfileData = () => {
    let targetMemNo = params.memNo ? params.memNo : context.profile.memNo;

    Api.profile({params: {memNo: targetMemNo }}).then(res => {
      console.log('res', res);
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
  const openShowSlide = () => {
    setShowSlide({...showSlide, open:true})
  }

  /* 팬,스타,좋아요 슬라이드 팝업 열기/닫기 */
  const openPopRelation = (e) => {
    const {targetType} = e.currentTarget.dataset
    setOpenRelationType(targetType)
    setPopFanStarLike(true)
  }

  useEffect(() => {
    getProfileData();
  }, [history.location.pathname]);

  useEffect(() => {
    setIsMyProfile(!params.memNo);
  }, []);

  // 임시 변수
  let isIos = true

  // 페이지 시작
  return (
    <div id="myprofile" ref={myprofileRef}>
      <Header title={`${profileData.nickNm}`} type={'back'}>
        {isMyProfile &&
          <div className="buttonGroup">
            <button className='editBtn'>수정</button>
          </div>
        }
        {!isMyProfile &&
          <div className="buttonGroup">
            <button className='moreBtn' onClick={openMoreList}>더보기</button>
          </div>
        }
      </Header>
      <section className='topSwiper'>
        <TopSwiper data={profileData} openShowSlide={openShowSlide} />
      </section>
      <section className="profileCard">
        <ProfileCard data={profileData} isMyProfile={isMyProfile} openShowSlide={openShowSlide} openPopRelation={openPopRelation} />
      </section>
      <section className='totalInfo'>
        <TotalInfo data={profileData} goProfile={goProfile} />
      </section>
      <section className="socialWrap">
        <div className="tabmenuWrap">
          <Tabmenu data={socialTabmenu} tab={socialType} setTab={setSocialType} />  
          <button>등록</button>
        </div>
        {socialType === socialTabmenu[0] && <FeedSection data={profileData} />}
        {socialType === socialTabmenu[1] && <FanboardSection data={profileData} />}
        {socialType === socialTabmenu[2] && <ClipSection data={profileData} />}

        {showSlide.open === true && <ShowSwiper data={profileData} popClose={setShowSlide} />}
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
          <FanStarLike type={openRelationType} isMyProfile={isMyProfile} />
        </PopSlide>
      }
    </div>
  )
}

export default ProfilePage
