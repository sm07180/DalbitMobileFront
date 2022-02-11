import React, {useEffect, useState, useContext, useCallback} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context, GlobalContext} from 'context'
import './style.scss'
import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import TopSwiper from './components/TopSwiper'
import ProfileCard from './components/ProfileCard'
import TotalInfo from './components/TotalInfo'
import Tabmenu from './components/Tabmenu'
import FanStarLike from './components/popSlide/FanStarPopup'
import BlockReport from './components/popSlide/BlockReport'
import Present from './components/popSlide/Present'
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
// contents
import FeedSection from './contents/profileDetail/FeedSection'
import FanboardSection from './contents/profileDetail/FanboardSection'
import ClipSection from './contents/profileDetail/ClipSection'
// redux
import {useDispatch, useSelector} from "react-redux";
import {setProfileClipData, setProfileData, setProfileFanBoardData, setProfileFeedData} from "redux/actions/profile";
import {
  profileClipDefaultState,
  profileDefaultState,
  profileFanBoardDefaultState,
  profileFeedDefaultState
} from "redux/types/profileType";
import {goMail} from "common/mailbox/mail_func";
import {MailboxContext} from "context/mailbox_ctx";
import LikePopup from "pages/profile/components/popSlide/LikePopup";

const socialTabmenu = ['피드','팬보드','클립']

const ProfilePage = () => {
  const history = useHistory()
  const context = useContext(Context)
  const { globalState, globalAction } = useContext(GlobalContext);
  const { mailboxAction } = useContext(MailboxContext);
  const params = useParams();

  const [showSlide, setShowSlide] = useState(false);
  const [imgList, setImgList] = useState([]);
  const [socialType, setSocialType] = useState(socialTabmenu[0])
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [popSlide, setPopSlide] = useState(false);
  const [popFanStar, setPopFanStar] = useState(false);
  const [popLike, setPopLike] = useState(false);
  const [openFanStarType, setOpenFanStarType] = useState('');
  const [popBlockReport, setPopBlockReport] = useState(false);
  const [popPresent, setPopPresent] = useState(false);
  const [blockReportInfo, setBlockReportInfo] = useState({memNo: '', memNick: ''});

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

  /* 팬 등록 해제 */
  const fanToggle = (memNo, memNick, isFan, callback) => {
    isFan ? deleteFan(memNo, memNick, callback) : addFan(memNo, memNick, callback);
  }

  /* 팬 등록 */
  const addFan = (memNo, memNick, callback) => {
    Api.fan_change({data: {memNo}}).then(res => {
      if (res.result === 'success') {
        if(typeof callback === 'function') callback();
        context.action.toast({
          msg: `${memNick ? `${memNick}님의 팬이 되었습니다` : '팬등록에 성공하였습니다'}`
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          msg: res.message
        })
      }
    })
  }

  /* 팬 해제 */
  const deleteFan = (memNo, memNick, callback) => {
    context.action.confirm({
      msg: `${memNick} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        Api.mypage_fan_cancel({data: {memNo}}).then(res => {
          if (res.result === 'success') {
            if(typeof callback === 'function') callback();
            context.action.toast({ msg: res.message })
          } else if (res.result === 'fail') {
            context.action.alert({ msg: res.message })
          }
        });
      }
    })
  }

  /* 방송시작 알림 설정 api */
  const editAlarms = useCallback((title, msg, isReceive) => {
    const editAlarmParams = {
      memNo: profileData.memNo,
      isReceive
    }
    Api.editPushMembers(editAlarmParams).then(res => {
      if (res.result === 'success') {
        dispatch(setProfileData({
          ...profileData,
          isReceive
        }))

        context.action.alert({title, msg})
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    });
  }, [profileData.memNo, profileData.isReceive])

  /* 방송시작 알림 설정 */
  const editAlarm = useCallback(() => {
    const isReceive = profileData.isReceive;
    setPopSlide(false);
    if(isReceive) {
      context.action.confirm({
        msg: `선택한 회원의 방송 알림 설정을<br/>해제 하시겠습니까?`,
        callback: () => {
          editAlarms('', '설정해제가 완료되었습니다.', !isReceive)
        }
      })
    }else {
      context.action.confirm({
        title: '알림받기 설정',
        msg: `팬으로 등록하지 않아도 🔔알림받기를 설정하면 방송시작에 대한 알림 메시지를 받을 수 있습니다.`,
        buttonText: {right: '설정하기'},
        callback: () => {
          editAlarms(
            '방송 알림 설정을 완료하였습니다',
            `마이페이지 > 서비스 설정 ><br/> [알림설정 관리]에서 설정한 회원을<br/> 확인하고 삭제 할 수 있습니다.`,
            !isReceive
          )
        }
      })
    }
  },[profileData.memNo, profileData.isReceive])

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

  /* 차단/신고 팝업 열기 */
  const openBlockReportPop = (blockReportInfo) => {
    if(popSlide) setPopSlide(false);
    setPopBlockReport(true);
    setBlockReportInfo(blockReportInfo);
  }

  /* 차단/신고 팝업 닫기 */
  const closeBlockReportPop = () => {
    setPopBlockReport(false);
    setBlockReportInfo({memNo: '', memNick: ''});
  }

  /* 프로필 사진 확대 */
  const openShowSlide = (data, isList = "y", keyName='profImg') => {
    const getImgList = data => data.map(item => item[keyName])
    let list = [];
    isList === 'y' ? list = getImgList(data) : list.push(data);

    setImgList(list);
    setShowSlide(true);
  }

  /* 팬,스타 슬라이드 팝업 열기/닫기 */
  const openPopFanStar = (e) => {
    const {targetType} = e.currentTarget.dataset
    setOpenFanStarType(targetType)
    setPopFanStar(true)
  }

  /* 좋아요 슬라이드 팝업 열기/닫기 */
  const openPopLike = (e) => {
    const {targetType} = e.currentTarget.dataset
    setPopLike(true)
  }

  /* 우체통 이동 */
  const goMailAction = () => {
    const goMailParams = {
      context,
      mailboxAction,
      targetMemNo: profileData.memNo,
      history
    }
    goMail(goMailParams);
    setPopSlide(false);
  }

  /* 프로필 데이터 초기화 */
  const resetProfileData = () => {
    // dispatch(setProfileData(profileDefaultState)); // 프로필 상단
    dispatch(setProfileFeedData(profileFeedDefaultState)); // 피드
    dispatch(setProfileFanBoardData(profileFanBoardDefaultState)); // 팬보드
    dispatch(setProfileClipData(profileClipDefaultState)); // 클립
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

  // 페이지 시작
  return (
    <div id="myprofile">
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
        <ProfileCard data={profileData} isMyProfile={isMyProfile} openShowSlide={openShowSlide} fanToggle={fanToggle}
                     openPopFanStar={openPopFanStar} openPopLike={openPopLike} setPopPresent={setPopPresent}
        />
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
          <FeedSection profileData={profileData} openShowSlide={openShowSlide} feedData={feedData}
                       isMyProfile={isMyProfile} openBlockReportPop={openBlockReportPop} />
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

      {/* 더보기 */}
      {popSlide &&
        <PopSlide setPopSlide={setPopSlide}>
          <section className='profileMore'>
            <div className="moreList" onClick={goMailAction}>메세지</div>
            {!profileData.isFan && <div className="moreList" onClick={editAlarm}>방송 알림 {profileData.isReceive ? 'OFF' : 'ON'}</div>}
            <div className="moreList"
                 onClick={() => {
                   openBlockReportPop({memNo: profileData.memNo, memNick: profileData.nickNm});
                 }}>차단/신고</div>
          </section>
        </PopSlide>
      }

      {/* 팬 / 스타 */}
      {popFanStar &&
        <PopSlide setPopSlide={setPopFanStar}>
          <FanStarLike type={openFanStarType} isMyProfile={isMyProfile} fanToggle={fanToggle} profileData={profileData}
                       goProfile={goProfile} setPopFanStar={setPopFanStar} myMemNo={context.profile.memNo}
          />
        </PopSlide>
      }

      {/* 좋아요 */}
      {popLike &&
        <PopSlide setPopSlide={setPopLike}>
          <LikePopup isMyProfile={isMyProfile} fanToggle={fanToggle} profileData={profileData} goProfile={goProfile}
                     setPopLike={setPopLike} myMemNo={context.profile.memNo}
          />
        </PopSlide>
      }

      {/* 차단 */}
      {popBlockReport &&
        <PopSlide setPopSlide={setPopBlockReport}>
          <BlockReport blockReportInfo={blockReportInfo} closeBlockReportPop={closeBlockReportPop} />
        </PopSlide>
      }

      {/* 선물하기 */}
      {popPresent &&
        <PopSlide setPopSlide={setPopPresent}>
          <Present profileData={profileData} setPopPresent={setPopPresent} />
        </PopSlide>
      }
    </div>
  )
}

export default ProfilePage
