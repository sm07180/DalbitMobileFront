import React, {useEffect, useState, useContext, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'
// components
import TopSwiper from './components/TopSwiper'
import ProfileCard from './components/ProfileCard'
import TotalInfo from './components/TotalInfo'
// contents
import FeedSection from './contents/profile/feedSection'
import FanboardSection from './contents/profile/fanboardSection'
import ClipSection from './contents/profile/clipSection'

import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setProfileData, setProfileFeedData} from "redux/actions/profile";
import ShowSwiper from "components/ui/showSwiper/showSwiper";

const socialTabmenu = ['피드','팬보드','클립']

const Profile = () => {
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

  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);
  const feedData = useSelector(state => state.feed);

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
          feedList: data.list,
          fixCnt: data.fixCnt,
          paging: data.paging,
          scrollPaging: {
            ...feedData.scrollPaging,
            pageNo: 1,
            currentCnt: data.list.length,
          }
        }));
      } else {
        context.action.alert({
          msg: message
        })
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

  /* 프로필 사진 확대 */
  const openShowSlide = () => {
    setShowSlide({...showSlide, open:true})
  }

  /* 프로필 상단 데이터 */
  useEffect(() => {
    getProfileData();
  }, [history.location.pathname]);

  /* 피드 데이터 */
  useEffect(() => {
    getFeedData();
  }, [])

  useEffect(() => {
    setIsMyProfile(!params.memNo);
  }, []);

  // 페이지 시작
  return (
    <div id="myprofile" ref={myprofileRef}>
      <Header title={`${profileData.nickNm}`} type={'back'}>
        {isMyProfile &&
          <div className="buttonGroup">
            <button className='editBtn'>수정</button>
          </div>
        }
      </Header>
      <section className='topSwiper'>
        <TopSwiper data={profileData} openShowSlide={openShowSlide} />
      </section>
      <section className="profileCard">
        <ProfileCard data={profileData} isMyProfile={isMyProfile} openShowSlide={openShowSlide} />
      </section>
      <section className='totalInfo'>
        <TotalInfo data={profileData} goProfile={goProfile} />
      </section>
      <section className="socialWrap">
        <ul className="tabmenu" ref={tabMenuRef}>
          {socialTabmenu.map((data,index) => {
            const param = {
              item: data,
              tab: socialType,
              setTab: setSocialType,
              // setPage: setPage
            }
            return (
              <TabBtn param={param} key={index} />
            )
          })}
          {isMyProfile && <button>등록</button>}
        </ul>
        {socialType === socialTabmenu[0] && <FeedSection profileData={profileData} feedData={feedData} />}
        {socialType === socialTabmenu[1] && <FanboardSection data={profileData} />}
        {socialType === socialTabmenu[2] && <ClipSection data={profileData} />}

        {showSlide.open === true && <ShowSwiper data={profileData} popClose={setShowSlide} />}
      </section>
    </div>
  )
}

export default Profile
