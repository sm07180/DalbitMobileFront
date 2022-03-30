import React, {useEffect, useState, useRef, useContext, useCallback, useMemo} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'
import './style.scss'
import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide'
// components
import TopSwiper from './components/topSwiper'
import ProfileCard from './components/profileCard'
import TotalInfo from './components/totalInfo'
import Tabmenu from './components/Tabmenu'
import FanStarLike from './components/popSlide/FanStarPopup'
import BlockReport from './components/popSlide/BlockReport'
import Present from './components/popSlide/Present'
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import SpecialHistoryList from './components/SpecialHistoryPop';
// contents
import FeedSection from './contents/profileDetail/FeedSection'
import FanboardSection from './contents/profileDetail/FanboardSection'
import ClipSection from './contents/profileDetail/ClipSection'
// redux
import {useDispatch, useSelector} from "react-redux";
import {
  setProfileClipData,
  setProfileData,
  setProfileFanBoardData,
  setProfileFeedData,
} from "redux/actions/profile";
import {
  profileClipPagingDefault,
  profileClipDefaultState,
  profileDefaultState,
  profileFanBoardDefaultState,
  profileFeedDefaultState, profilePagingDefault
} from "redux/types/profileType";
import {goMail} from "common/mailbox/mail_func";
import {MailboxContext} from "context/mailbox_ctx";
import LikePopup from "pages/profile/components/popSlide/LikePopup";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {Hybrid, isHybrid} from "context/hybrid";
import ProfileNoticePop from "pages/profile/components/ProfileNoticePop";
import {setCommonPopupOpenData} from "redux/actions/common";

const socialTabmenu = ['피드','팬보드','클립']
const socialDefault = socialTabmenu[0];

const ProfilePage = () => {
  const history = useHistory()
  const context = useContext(Context)
  const { mailboxAction } = useContext(MailboxContext);
  const params = useParams();
  const tabmenuRef = useRef();
  const socialRef = useRef();
  const floatingRef = useRef();

  const [showSlide, setShowSlide] = useState(false); // 프사 확대 슬라이드
  const [imgList, setImgList] = useState([]); // 프사 확대 슬라이드 이미지 정보
  const [socialType, setSocialType] = useState() // 피드 | 팬보드 | 클립
  const [isMyProfile, setIsMyProfile] = useState(false); // 내프로필인지
  const [openFanStarType, setOpenFanStarType] = useState(''); // 팬스타 팝업용 타입
  const [popPresent, setPopPresent] = useState(false); // 선물 팝업
  const [blockReportInfo, setBlockReportInfo] = useState({memNo: '', memNick: ''}); // 차단/신고 팝업 유저 정보
  const [scrollPagingCnt, setScrollPagingCnt] = useState(1); // 스크롤 이벤트 갱신을 위함
  const [popHistory, setPopHistory] = useState(false); // 스페셜DJ 약력 팝업 생성

  const [noticePop, setNoticePop] = useState(false); // 좋아요 랭킹기준 안내팝업

  const [webview, setWebview] = useState('');
  const [likePopTabState, setLikePopTabState] = useState({titleTab: 0, subTab: 0, subTabType: ''});
  const [callProfileData, setCallProfileData] = useState(false); // 프로필 이동시 데이터 콜할건지
  const [profileReady, setProfileReady] = useState(false); // 프로필 mount 후 ready

  const [morePopHidden, setMorePopHidden] = useState(false); // slidePop이 unmount 될때 꼬여서 임시로 처방

  const [floatBtnHidden, setFloatBtnHidden] = useState(false); // 플로팅 버튼 온 오프
  const [floatScrollAction, setFloatScrollAction] = useState(false); // 플로팅 버튼 스크롤 이벤트
  
  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);
  const feedData = useSelector(state => state.feed);
  const fanBoardData = useSelector(state => state.fanBoard);
  const clipData = useSelector(state => state.profileClip);
  const popup = useSelector(state => state.popup);

  /* 상단 스와이퍼에서 사용하는 profileData (대표사진 제외한 프로필 이미지만 넣기) */
  const profileDataNoReader = useMemo(() => {
    if (profileData?.profImgList?.length > 1) {
      return {...profileData, profImgList: profileData?.profImgList.concat([]).filter((data, index)=> !data.isLeader)};
    } else {
      return profileData;
    }
  },[profileData]);

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
      pageNo: feedData.paging.next,
      pagePerCnt: feedData.paging.records,
      topFix: 0,
    }
    Api.mypage_notice_sel(apiParams).then(res => {
      if (res.result === 'success') {
        const data = res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.list.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileFeedData({
          ...feedData,
          feedList: data.paging?.page > 1 ? feedData.feedList.concat(data.list) : data.list, // 피드(고정 + 일반)
          // fixedFeedList: data.fixList, // 고정 피드
          // fixCnt: data.fixList.length, // 고정 피드 개수
          paging: data.paging ? data.paging : profilePagingDefault, // 호출한 페이지 정보
          isLastPage,
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
      page: fanBoardData.paging.next,
      records: fanBoardData.paging.records
    }
    Api.mypage_fanboard_list({params: apiParams}).then(res => {
      if (res.result === 'success') {
        const data= res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.list.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileFanBoardData({
          ...fanBoardData,
          list: data.paging?.page > 1 ? fanBoardData.list.concat(data.list) : data.list,
          listCnt: data.length > 0 ? data.paging : 0,
          paging: data.paging ? data.paging : profilePagingDefault,
          isLastPage,
        }));
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    })
  }

  /* 클립 데이터 */
  const getClipData = () => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
      page: clipData.paging.next,
      records: clipData.paging.records
    }
    Api.getUploadList(apiParams).then(res => {
      if (res.result === 'success') {
        const data= res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.list.length > 0 ? data.paging?.totalPage === callPageNo : true;
        dispatch(setProfileClipData({
          ...clipData,
          list: data.paging?.page > 1 ? clipData.list.concat(data.list) : data.list,
          paging: data.paging ? data.paging : profileClipPagingDefault,
          isLastPage,
        }));
      } else {
        context.action.alert({ msg: res.message })
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
    // setPopSlide(false);
    closePopupAction();
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

  /* 팝업 닫기 공통 */
  const closePopupAction = () => {
    closePopup(dispatch);
  }

  /* 헤더 더보기 버튼 클릭 */
  const openMoreList = () => {
    setMorePopHidden(false);
    dispatch(setCommonPopupOpenData({...popup, headerPopup: true}))
  }

  /* 차단/신고 팝업 열기 (param: {memNo: '', memNick: ''}) */
  const openBlockReportPop = (blockReportInfo) => {
    dispatch(setCommonPopupOpenData({...popup, blockReportPopup: true}))
    setBlockReportInfo(blockReportInfo);
  }

  /* 차단/신고 팝업 닫기 */
  const closeBlockReportPop = () => {
    setBlockReportInfo({memNo: '', memNick: ''});
    closePopupAction();
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
    dispatch(setCommonPopupOpenData({...popup, fanStarPopup: true}));
  }

  /* 좋아요 슬라이드 팝업 열기/닫기 (tabState는 열고싶은 탭 있을때 파라미터를 넘긴다 탭 순서대로 0부터) */
  const openPopLike = (e, tabState) => {
    e.preventDefault();
    e.stopPropagation();
    setLikePopTabState(tabState)
    dispatch(setCommonPopupOpenData({...popup, likePopup: true}));
  }

  /* 메시지 이동 */
  const goMailAction = () => {
    const goMailParams = {
      context,
      mailboxAction,
      targetMemNo: profileData.memNo,
      history,
      targetMemLevel: profileData.level
    }
    goMail(goMailParams);
    closePopupAction();
    // setPopSlide(false);
  }

  /* 스크롤 이벤트 */
  const scrollEvent = useCallback((scrollTarget, callback) => {
    const popHeight = scrollTarget.scrollHeight;
    const targetHeight = scrollTarget.clientHeight;
    const scrollTop = scrollTarget.scrollTop;
    if(popHeight - 1 < targetHeight + scrollTop) {
      callback()
    }
  }, []);

  /* 피드, 팬보드, 클립 페이징 */
  const profileScrollEvent = useCallback(() => {
    const callback = () => {
      setScrollPagingCnt(scrollPagingCnt => scrollPagingCnt + 1);
    }
    scrollEvent(document.documentElement, callback);
  }, []);

  /* 스크롤 이벤트 remove */
  const removeScrollEvent = useCallback(() => {
    document.removeEventListener('scroll', profileScrollEvent);
  }, []);

  // 피드 / 팬보드 / 클립 탭 변경시 액션
  const socialTabChangeAction = (item) => {
    if(item === socialTabmenu[0]) {
      dispatch(setProfileFeedData({...feedData, paging: profilePagingDefault, isLastPage: false}));
      removeScrollEvent();
      document.addEventListener('scroll', profileScrollEvent);
    }else if(item === socialTabmenu[1]) {
      dispatch(setProfileFanBoardData({...fanBoardData, paging: profilePagingDefault, isLastPage: false}));
      removeScrollEvent();
      document.addEventListener('scroll', profileScrollEvent);
    }else if(item === socialTabmenu[2]) {
      dispatch(setProfileClipData({...clipData, paging: profileClipPagingDefault, isLastPage: false}));
      removeScrollEvent();
      document.addEventListener('scroll', profileScrollEvent);
    }
  }

  /* 주소 뒤에 파라미터 처리 (webview? = new / tab? = 0 | 1 | 2 (범위밖: 0)) */
  const parameterManager = () => {
    if(location.search) {
      let tabDefault = '';
      const searchParams = location.search.split('?')[1];
      searchParams.split('&').forEach(item => {
        const itemSplit = item.split('=');
        const paramType = itemSplit[0].toLowerCase();
        if(paramType === 'webview') {
          setWebview(itemSplit[1]);
        }else if(paramType === 'tab') {
          if(parseInt(itemSplit[1]) >= 0 && parseInt(itemSplit[1]) <= 2) {
            tabDefault = parseInt(itemSplit[1])
            setSocialType(socialTabmenu[itemSplit[1]]);
          }else {
            tabDefault = socialDefault;
            setSocialType(socialDefault); // default
          }
        }
      });
      if(tabDefault === '') {
        setSocialType(socialDefault); // default
      }
    }else {
      setSocialType(socialDefault); // default
    }
  }

  /* 프로필 데이터 초기화 */
  const resetProfileData = () => {
    dispatch(setProfileData(profileDefaultState)); // 프로필 상단
    dispatch(setProfileFeedData(profileFeedDefaultState)); // 피드
    dispatch(setProfileFanBoardData(profileFanBoardDefaultState)); // 팬보드
    dispatch(setProfileClipData(profileClipDefaultState)); // 클립
  }

  /* 피드글, 팬보드 삭제후 데이터 비우기 */
  const deleteContents = (type, index, memNo) => {
    const callback = async () => {
      if (type === 'feed') {
        const {result, data, message} = await Api.mypage_notice_delete({
          data: {
            delChrgrName: profileData?.nickNm,
            noticeIdx: index,
          }
        })
        if (result === 'success') {
          const feedList = feedData.feedList.concat([]).filter((feed, _index) => feed.noticeIdx !== index);
          dispatch(setProfileFeedData({...feedData, feedList}));
        } else {
          context.action.toast({msg: message});
        }
      } else if (type === 'fanBoard') { //팬보드 글 삭제 (댓글과 같은 프로시져)
        const list = fanBoardData.list.concat([]).filter((board, _index) => board.replyIdx !== index);

        const {data, result, message} = await Api.mypage_fanboard_delete({data: {memNo, replyIdx: index}});
        if (result === 'success') {
          dispatch(setProfileFanBoardData({...fanBoardData, list}));
        } else {
          context.action.toast({msg: message});
        }
      }
    }
    context.action.confirm({
      msg: '정말 삭제 하시겠습니까?',
      callback
    });
  }

  const headerBackEvent = () => {
    if(webview === 'new' && isHybrid()) {
      Hybrid('CloseLayerPopup');
    }else {
      history.goBack();
    }
  }

  const profileTabCheck = () => {
    if(socialType === socialTabmenu[0]) {
      getFeedData();
      setScrollPagingCnt(1);
    }else if(socialType === socialTabmenu[1]) {
      getFanBoardData();
      setScrollPagingCnt(1);
    }else if(socialType === socialTabmenu[2]) {
      getClipData();
      setScrollPagingCnt(1);
    }
  }

  /* 플루팅 버튼 이벤트 */
  const floatScrollEvent = useCallback(() => {
    const floatNode = floatingRef.current;
    const scrollBottom = floatNode.offsetTop;

    if (scrollBottom > 150) {
      setFloatScrollAction(true);
    } else {
      setFloatScrollAction(false);
    }
  }, []);
  const floatingOpen = () => {
    setFloatBtnHidden(!floatBtnHidden)
  }
  const floatingButton1 = (e) => {
    e.stopPropagation;
    goProfileDetailPage({history, action:'write', type:'notice', memNo:profileData.memNo});
  }
  const floatingButton2 = (e) => {
    e.stopPropagation;
    goProfileDetailPage({history, action:'write', type:'feed', memNo:profileData.memNo});
  }

  useEffect(() => {
    document.addEventListener('scroll', floatScrollEvent);
    return () => {
      document.removeEventListener('scroll', floatScrollEvent);
    }
  },[])

  /* 스크롤 페이징 이펙트 */
  useEffect(() => {
    if(socialType === socialTabmenu[0] && scrollPagingCnt > 1 && !feedData.isLastPage) {
      getFeedData();
    }else if(socialType === socialTabmenu[1] && scrollPagingCnt > 1 && !fanBoardData.isLastPage) {
      getFanBoardData();
    }else if(socialType === socialTabmenu[2] && scrollPagingCnt > 1 && !clipData.isLastPage) {
      getClipData();
    }
  }, [scrollPagingCnt]);

  /* 피드 마지막 페이지 호출 이펙트 */
  useEffect(() => {
    if(feedData.isLastPage){
      removeScrollEvent();
    }
  }, [feedData.isLastPage])

  /* 팬보드 마지막 페이지 호출 이펙트 */
  useEffect(() => {
    if(fanBoardData.isLastPage){
      removeScrollEvent();
    }
  }, [fanBoardData.isLastPage])

  /* 클립 마지막 페이지 호출 이펙트 */
  useEffect(() => {
    if(clipData.isLastPage){
      removeScrollEvent();
    }
  }, [clipData.isLastPage])

  /* 프로필 상단 데이터 */
  useEffect(() => {
    if(context.token.isLogin) {
      resetProfileData();
      setCallProfileData(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if(callProfileData) {
      getProfileData();
      profileTabCheck();
      setCallProfileData(false);
      setProfileReady(true);
      document.addEventListener('scroll', profileScrollEvent);
    }
  }, [callProfileData]);

  /* 피드 / 팬보드 / 클립 */
  useEffect(() => {
    if(profileReady) {
      profileTabCheck();
    }
  }, [socialType])

  // 플로팅 버튼 오픈시 스크롤 막기
  useEffect(() => {
    if (floatBtnHidden === true) {
      document.body.classList.add('overflowHidden')
    } else {
      document.body.classList.remove('overflowHidden')
    }
  }, [floatBtnHidden])

  useEffect(() => {
    if(!context.token.isLogin) {
      return history.replace('/login');
    }
    setIsMyProfile(!params.memNo); // 내 프로필인지 체크
    parameterManager(); // 주소 뒤에 파라미터 체크
    return () => {
      // resetProfileData();
      removeScrollEvent();
    }
  }, []);

  // 페이지 시작
  return (
    <div id="myprofile">
      <Header title={`${profileData.nickNm}`} type={'back'} backEvent={headerBackEvent}>
        {isMyProfile ?
          <div className="buttonGroup">
            <button className="editBtn" onClick={()=>history.replace('/myProfile/edit')}>편집</button>
          </div>
          :
          <div className="buttonGroup">
            <button className="moreBtn" onClick={openMoreList}>더보기</button>
          </div>
        }
      </Header>
      <section className='profileTopSwiper'>
        <TopSwiper data={profileDataNoReader} openShowSlide={openShowSlide} listenOpen={profileData.listenOpen} webview={webview} isMyProfile={isMyProfile}
                   setPopHistory={setPopHistory} type="profile" />
      </section>
      <section className="profileCard">
        <ProfileCard data={profileData} isMyProfile={isMyProfile} openShowSlide={openShowSlide} fanToggle={fanToggle}
                     openPopFanStar={openPopFanStar} openPopLike={openPopLike} popup={popup}
        />
      </section>
      <section className='totalInfo'>
        <TotalInfo data={profileData} goProfile={goProfile} openPopLike={openPopLike} isMyProfile={isMyProfile} />
      </section>
      <section className="socialWrap" ref={socialRef}>
        <div className="tabmenuWrap" ref={tabmenuRef}>
          <Tabmenu data={socialTabmenu} tab={socialType} setTab={setSocialType} tabChangeAction={socialTabChangeAction} />
        </div>

        {/* 피드 */}
        {socialType === socialTabmenu[0] &&
          <FeedSection profileData={profileData} openShowSlide={openShowSlide} feedData={feedData}
                       isMyProfile={isMyProfile} openBlockReportPop={openBlockReportPop} deleteContents={deleteContents}/>
        }

        {/* 팬보드 */}
        {socialType === socialTabmenu[1] &&
          <FanboardSection profileData={profileData} fanBoardData={fanBoardData} isMyProfile={isMyProfile}
                          deleteContents={deleteContents} openBlockReportPop={openBlockReportPop} />
        }

        {/* 클립 */}
        {socialType === socialTabmenu[2] &&
          <ClipSection profileData={profileData} clipData={clipData} isMyProfile={isMyProfile} webview={webview} />
        }

        {/* 프로필 사진 확대 */}
        {showSlide && <ShowSwiper imageList={imgList} popClose={setShowSlide} />}

        {/* 글쓰기 플로팅 버튼 */}
        {/* {(socialType === socialTabmenu[0] && isMyProfile || socialType === socialTabmenu[1])
          && <button className="floatBtn" onClick={() => {
          socialType === socialTabmenu[0] && goProfileDetailPage({history, action:'write', type:'feed', memNo:profileData.memNo} );
            socialType === socialTabmenu[1] && goProfileDetailPage({history, action:'write', type:'fanBoard', memNo:profileData.memNo})
        }}>등록</button>} */}
        <button className={`floatBtn ${floatBtnHidden === true ? 'on' : ''}`} onClick={floatingOpen} ref={floatingRef}>
          <div className="blackCurtain"></div>
          <div className={`floatWrap ${floatScrollAction === true ? 'action' : 'disAction'}`}>
            <ul>
              <li onClick={floatingButton1}>
                방송공지 쓰기
                <img src={`${IMG_SERVER}/profile/floating-btn-2.png`} alt="아이콘" />
              </li>
              <li onClick={floatingButton2}>
                피드 쓰기
                <img src={`${IMG_SERVER}/profile/floating-btn-1.png`} alt="아이콘" />
              </li>
            </ul>
          </div>
        </button>
      </section>

      {/* 더보기 */}
      {popup.headerPopup &&
        <PopSlide popHidden={morePopHidden}>
          <section className='profileMore'>
            <div className="moreList" onClick={goMailAction}>메세지</div>
            {!profileData.isFan && <div className="moreList" onClick={editAlarm}>방송 알림 {profileData.isReceive ? 'OFF' : 'ON'}</div>}
            <div className="moreList"
                 onClick={() => {
                   setMorePopHidden(true);
                   openBlockReportPop({memNo: profileData.memNo, memNick: profileData.nickNm});
                 }}>차단/신고</div>
          </section>
        </PopSlide>
      }

      {/* 팬 / 스타 */}
      {popup.fanStarPopup &&
        <PopSlide>
          <FanStarLike type={openFanStarType} isMyProfile={isMyProfile} fanToggle={fanToggle} profileData={profileData}
                       goProfile={goProfile} myMemNo={context.profile.memNo}
                       closePopupAction={closePopupAction}
          />
        </PopSlide>
      }

      {/* 좋아요 */}
      {popup.likePopup &&
        <PopSlide>
          <LikePopup isMyProfile={isMyProfile} fanToggle={fanToggle} profileData={profileData} goProfile={goProfile}
                     myMemNo={context.profile.memNo} likePopTabState={likePopTabState} closePopupAction={closePopupAction}
          />
        </PopSlide>
      }

      {/* 차단 */}
      {popup.blockReportPopup &&
        <PopSlide>
          <BlockReport blockReportInfo={blockReportInfo} closeBlockReportPop={closeBlockReportPop} />
        </PopSlide>
      }

      {/* 선물하기 */}
      {popup.presentPopup &&
        <PopSlide>
          <Present profileData={profileData} closePopupAction={closePopupAction} />
        </PopSlide>
      }

      {/* 좋아요 -> ? 아이콘 */}
      {popup.commonPopup && <ProfileNoticePop />}

      {/* 스페셜DJ 약력 팝업 */}
      {popHistory && <SpecialHistoryList profileData={profileData} setPopHistory={setPopHistory} />}
    </div>
  )
}

export default ProfilePage
