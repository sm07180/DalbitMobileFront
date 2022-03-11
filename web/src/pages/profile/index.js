import React, {useEffect, useState, useRef, useContext, useCallback, useMemo} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'
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
  setProfileFeedData, setProfileTabData,
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

const ProfilePage = () => {
  const history = useHistory()
  const context = useContext(Context)
  const { mailboxAction } = useContext(MailboxContext);
  const params = useParams();
  const tabmenuRef = useRef();

  const [showSlide, setShowSlide] = useState(false); // 프사 확대 슬라이드
  const [imgList, setImgList] = useState([]); // 프사 확대 슬라이드 이미지 정보
  const [isMyProfile, setIsMyProfile] = useState(false); // 내프로필인지
  const [openFanStarType, setOpenFanStarType] = useState(''); // 팬스타 팝업용 타입
  const [blockReportInfo, setBlockReportInfo] = useState({memNo: '', memNick: ''}); // 차단/신고 팝업 유저 정보
  const [scrollPagingCnt, setScrollPagingCnt] = useState(1); // 스크롤 이벤트 갱신을 위함

  const [webview, setWebview] = useState('');
  const [likePopTabState, setLikePopTabState] = useState({titleTab: 0, subTab: 0, subTabType: ''});
  const [profileReady, setProfileReady] = useState(false); // 페이지 mount 후 ready

  const [morePopHidden, setMorePopHidden] = useState(false); // slidePop이 unmount 될때 꼬여서 임시로 처방

  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);
  const feedData = useSelector(state => state.feed);
  const fanBoardData = useSelector(state => state.fanBoard);
  const clipData = useSelector(state => state.profileClip);
  const popup = useSelector(state => state.popup);
  const profileTab = useSelector(state => state.profileTab);

  /* 상단 스와이퍼에서 사용하는 profileData (대표사진 제외한 프로필 이미지만 넣기) */
  const profileDataNoReader = useMemo(() => {
    if (profileData?.profImgList?.length > 0) {
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
  const getFeedData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
      pageNo: isInit ? 1 : feedData.paging.next,
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
  const getFanBoardData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
      page: isInit ? 1 : fanBoardData.paging.next,
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
  const getClipData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
      page: isInit ? 1 : clipData.paging.next,
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
  }

  /* 스크롤 이벤트 */
  const scrollEvent = useCallback((scrollTarget, callback) => {
    console.log('scroll');
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
    const scrollEventHandler = () => {
      removeScrollEvent();
      document.addEventListener('scroll', profileScrollEvent);
    }

    console.log(item, profileTab.tabList);

    if(item === profileTab.tabList[0]) {
      dispatch(setProfileFeedData({...feedData, paging: profilePagingDefault, isLastPage: false}));
      scrollEventHandler();
    }else if(item === profileTab.tabList[1]) {
      dispatch(setProfileFanBoardData({...fanBoardData, paging: profilePagingDefault, isLastPage: false}));
      scrollEventHandler();
    }else if(item === profileTab.tabList[2]) {
      dispatch(setProfileClipData({...clipData, paging: profileClipPagingDefault, isLastPage: false}));
      scrollEventHandler();
    }
  }

  const setProfileTabName = (param) => {
    dispatch(setProfileTabData({
      ...profileTab,
      tabName: param
    }))
  }

  /* 주소 뒤에 파라미터 처리 (webview? = new / tab? = 0 | 1 | 2 (범위밖: 0)) */
  const parameterManager = () => {
    if(location.search) {
      let tabState = 0; // default
      const searchParams = location.search.split('?')[1];
      searchParams.split('&').forEach(item => {
        const itemSplit = item.split('=');
        const paramType = itemSplit[0].toLowerCase();
        if(paramType === 'webview') {
          setWebview(itemSplit[1]);
        }else if(paramType === 'tab') {
          if(parseInt(itemSplit[1]) >= 0 && parseInt(itemSplit[1]) <= 2) { // 탭이 범위 안에 있을때(0~2)
            tabState = parseInt(itemSplit[1])
          }
        }
      });
      setProfileTabName(profileTab.tabList[tabState]);
    }
  }

  /* 프로필 데이터 초기화 */
  const resetProfileData = () => {
    dispatch(setProfileData(profileDefaultState)); // 프로필 상단
  }

  /* 피드, 팬보드, 클립 초기화 */
  const resetTabData = () => {
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

  const profileTabCheck = (isInit) => {
    if(profileTab.isRefresh) {
      if(profileTab.tabName === profileTab.tabList[0]) {
        getFeedData(isInit);
        setScrollPagingCnt(1);
      }else if(profileTab.tabName === profileTab.tabList[1]) {
        getFanBoardData(isInit);
        setScrollPagingCnt(1);
      }else if(profileTab.tabName === profileTab.tabList[2]) {
        getClipData(isInit);
        setScrollPagingCnt(1);
      }
    }
  }

  /* 스크롤 페이징 이펙트 */
  useEffect(() => {
    if(profileTab.tabName === profileTab.tabList[0] && scrollPagingCnt > 1 && !feedData.isLastPage) {
      getFeedData();
    }else if(profileTab.tabName === profileTab.tabList[1] && scrollPagingCnt > 1 && !fanBoardData.isLastPage) {
      getFanBoardData();
    }else if(profileTab.tabName === profileTab.tabList[2] && scrollPagingCnt > 1 && !clipData.isLastPage) {
      getClipData();
    }
  }, [scrollPagingCnt]);

  /* 피드 마지막 페이지 호출 체크 */
  useEffect(() => {
    if(feedData.isLastPage){
      removeScrollEvent();
    }
  }, [feedData.isLastPage])

  /* 팬보드 마지막 페이지 호출 체크 */
  useEffect(() => {
    if(fanBoardData.isLastPage){
      removeScrollEvent();
    }
  }, [fanBoardData.isLastPage])

  /* 클립 마지막 페이지 호출 체크 */
  useEffect(() => {
    if(clipData.isLastPage){
      removeScrollEvent();
    }
  }, [clipData.isLastPage])

  /* 페이지 이동할때 탭 초기화 상태인지 체크한다 */
  useEffect(() => {
    if(context.token.isLogin && profileReady) {
      document.addEventListener('scroll', profileScrollEvent);


      /*setProfileTabName(profileTab.tabList[0]);
      resetTabData();
      getProfileData(); // 프로필 상단 데이터
      profileTabCheck(); // 프로필 하단 탭 및 데이터
      document.addEventListener('scroll', profileScrollEvent);*/
    }
  }, [location.pathname, profileReady]);

  /* 피드 / 팬보드 / 클립 */
  useEffect(() => {
    if(profileReady) {
      // getProfileData(); // 프로필 상단 데이터
      // profileTabCheck();
    }
  }, [profileTab.tabName])

  useEffect(() => {
    if(!context.token.isLogin) {
      return history.replace('/login');
    }


    console.log(profileTab.isRefresh, profileTab.tabName)
    getProfileData(); // 프로필 상단 데이터


    if(profileTab.isRefresh) { // 프로필 탭 초기화
      setProfileTabName(profileTab.tabList[0]);
      getFeedData(true);
      // setScrollPagingCnt(1);
    }else { // 초기화 안하는 경우
      if(profileTab.tabName === profileTab.tabList[0] && !feedData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }else if(profileTab.tabName === profileTab.tabList[1] && !fanBoardData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }else if(profileTab.tabName === profileTab.tabList[2] && !clipData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }

      dispatch(setProfileTabData({...profileTab, isRefresh: true}));
    }


    /*if(profileTab.isRefresh) {
      setProfileTabName(profileTab.tabList[0]);
      resetTabData();
    }else {
      if(profileTab.tabName === profileTab.tabList[0] && !feedData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }else if(profileTab.tabName === profileTab.tabList[1] && !fanBoardData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }else if(profileTab.tabName === profileTab.tabList[2] && !clipData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }

      dispatch(setProfileTabData({...profileTab, isRefresh: true}));
    }*/

    setIsMyProfile(!params.memNo); // 내 프로필인지 체크
    parameterManager(); // 주소 뒤에 파라미터 체크

    setProfileReady(true);

    return () => {
      // resetProfileData();
      // resetTabData();

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
        <TopSwiper data={profileDataNoReader} openShowSlide={openShowSlide} listenOpen={profileData.listenOpen}
                   webview={webview} type="profile" />
      </section>
      <section className="profileCard">
        <ProfileCard data={profileData} isMyProfile={isMyProfile} openShowSlide={openShowSlide} fanToggle={fanToggle}
                     openPopFanStar={openPopFanStar} openPopLike={openPopLike} popup={popup}
        />
      </section>
      <section className='totalInfo'>
        <TotalInfo data={profileData} goProfile={goProfile} openPopLike={openPopLike} isMyProfile={isMyProfile} />
      </section>
      <section className="socialWrap">
        <div className="tabmenuWrap" ref={tabmenuRef}>
          <Tabmenu data={profileTab.tabList} tab={profileTab.tabName} setTab={setProfileTabName} tabChangeAction={socialTabChangeAction} />
          {(profileTab.tabName === profileTab.tabList[0] && isMyProfile || profileTab.tabName === profileTab.tabList[1])
            && <button onClick={() => {
            profileTab.tabName === profileTab.tabList[0] && goProfileDetailPage({history, action:'write', type:'feed', memNo:profileData.memNo, dispatch, profileTab} );
              profileTab.tabName === profileTab.tabList[1] && goProfileDetailPage({history, action:'write', type:'fanBoard', memNo:profileData.memNo, dispatch, profileTab})
          }}>등록</button>}
        </div>

        {/* 피드 */}
        {profileTab.tabName === profileTab.tabList[0] &&
          <FeedSection profileData={profileData} openShowSlide={openShowSlide} feedData={feedData}
                       isMyProfile={isMyProfile} openBlockReportPop={openBlockReportPop} deleteContents={deleteContents}/>
        }

        {/* 팬보드 */}
        {profileTab.tabName === profileTab.tabList[1] &&
          <FanboardSection profileData={profileData} fanBoardData={fanBoardData} isMyProfile={isMyProfile}
                           deleteContents={deleteContents} openBlockReportPop={openBlockReportPop} />
        }

        {/* 클립 */}
        {profileTab.tabName === profileTab.tabList[2] &&
          <ClipSection profileData={profileData} clipData={clipData} isMyProfile={isMyProfile} webview={webview} />
        }

        {/* 프로필 사진 확대 */}
        {showSlide && <ShowSwiper imageList={imgList} popClose={setShowSlide} />}
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
      {popup.questionMarkPopup && <ProfileNoticePop />}

      {/* 스페셜DJ 약력 팝업 */}
      {popup.historyPopup && <SpecialHistoryList profileData={profileData} />}
    </div>
  )
}

export default ProfilePage
