import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';

import Api from 'context/api';
import {useHistory, useParams} from 'react-router-dom';
import './style.scss';
// global components
import Header from '../../components/ui/header/Header';
import LayerPopup, {closeLayerPopup} from '../../components/ui/layerPopup/LayerPopup2';
// components
import ProfileSwiper from './components/ProfileSwiper';
import ProfileCard from './components/profileCard';
import TotalInfo from './components/totalInfo';
import Tabmenu from './components/Tabmenu';
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import FloatBtn from './components/FloatBtn';
import SlidepopZip from './components/popup/SlidepopZip';
import SpecialHistoryList from '../remypage/components/popup/SpecialHistoryPop';
// contents
import FeedSection from './contents/profileDetail/FeedSection';
import FanboardSection from './contents/profileDetail/FanboardSection';
import ClipSection from './contents/profileDetail/ClipSection';
// redux
import {useDispatch, useSelector} from "react-redux";
import {
  setProfileClipData,
  setProfileData,
  setProfileFanBoardData,
  setProfileNoticeData, setProfileFeedNewData, setProfileNoticeFixData, setProfileTabData,
} from "redux/actions/profile";
import {
  profileClipPagingDefault,
  profileClipDefaultState,
  profileDefaultState,
  profileFanBoardDefaultState,
  profileNoticeDefaultState, profilePagingDefault, profileFeedDefaultState, profileNoticeFixDefaultState
} from "redux/types/profileType";
import {Hybrid, isHybrid} from "context/hybrid";
import ProfileNoticePop from "pages/profile/components/popup/ProfileNoticePop";
import {setSlidePopupOpen, setIsWebView} from "redux/actions/common";
import noticeFix from "redux/reducers/profile/noticeFix";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const ProfilePage = () => {
  const history = useHistory();
  const params = useParams();
  const socialRef = useRef();

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const profileData = useSelector(state => state.profile);
  const noticeData = useSelector(state => state.brdcst);
  const fanBoardData = useSelector(state => state.fanBoard);
  const clipData = useSelector(state => state.profileClip);
  const popup = useSelector(state => state.popup);
  const profileTab = useSelector(state => state.profileTab);
  const feedData = useSelector(state => state.feed);
  const noticeFixData = useSelector(state => state.noticeFix);
  const member = useSelector(state => state.member);

  const [showSlide, setShowSlide] = useState({visible: false, imgList: [], initialSlide: 0}); // 프사 확대 슬라이드
  const [isMyProfile, setIsMyProfile] = useState(false); // 내프로필인지
  const [scrollPagingCall, setScrollPagingCall] = useState(1); // 스크롤 이벤트 갱신을 위함

  const [webview, setWebview] = useState('');
  const [profileReady, setProfileReady] = useState(false); // 페이지 mount 후 ready

  const [feedShowSlide, setFeedShowSlide] = useState({visible: false, imgList: [], initialSlide: 0});
  
  const [slidePopInfo, setSlidePopInfo] = useState({
    data: profileData, memNo: profileData.memNo, nickNm: profileData.nickNm, type: "", fanStarType: "", likeType: {titleTab: 0, subTab: 0, subTabType: ''},
  }); // 슬라이드 팝업 정보

  const profileDefaultTab = profileTab.tabList[1]; // 프로필 디폴트 탭 - 피드

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

  /* 방송공지 데이터 호출 */
  const getNoticeData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : member.memNo !== "" ? member.memNo : globalState.profile.memNo,
      pageNo: isInit ? 1 : noticeData.paging.next,
      pageCnt: isInit? 20: noticeData.paging.records,
      topFix: 0,
    }
    Api.mypage_notice_sel(apiParams).then(res => {
      if (res.result === 'success') {
        const data = res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.list.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileNoticeData({
          ...noticeData,
          feedList: data.paging?.page > 1 ? noticeData.feedList.concat(data.list) : data.list, // 피드(일반)
          paging: data.paging ? data.paging : profilePagingDefault, // 호출한 페이지 정보
          isLastPage,
        }));
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',
          msg: res.message
        }))
      }
    })
  }

  /* 방송공지(고정) 데이터 호출 */
  const getNoticeFixData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : member.memNo !== "" ? member.memNo : globalState.profile.memNo,
      pageNo: isInit ? 1 : noticeFixData.paging.next,
      pageCnt: isInit? 20: noticeFixData.paging.records,
    }
    Api.myPageNoticeFixList(apiParams).then((res) => {
      if(res.result === "success") {
        const data = res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.fixList.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileNoticeFixData({
          ...noticeFixData,
          fixedFeedList: data.paging?.page > 1 ? noticeFixData.fixedFeedList.concat(data.fixList) : data.fixList,
          paging: data.paging ? data.paging : profilePagingDefault,
          isLastPage
        }));
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',msg: res.message}));
      }
    }).catch((e) => console.log(e));
  };

  /* 피드 데이터 */
  const getFeedData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : member.memNo !== "" ? member.memNo : globalState.profile.memNo,
      pageNo: isInit ? 1 : feedData.paging.next,
      pageCnt: isInit? 20: feedData.paging.records,
    }
    Api.myPageFeedSel(apiParams).then((res) => {
      if(res.result === "success") {
        const data = res.data;
        const callPageNo = data.paging?.page;
        const isLastPage = data.list.length > 0 ? data.paging.totalPage === callPageNo : true;
        dispatch(setProfileFeedNewData({
          ...feedData,
          feedList: data.paging?.page > 1 ? feedData.feedList.concat(data.list) : data.list,
          paging: data.paging ? data.paging : profilePagingDefault,
          isLastPage
        }));
        if(isLastPage) {
          removeScrollEvent();
        }
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',msg: res.message}));
      }
    }).catch((e) => console.log(e));
  };

  /* 팬보드 데이터 */
  const getFanBoardData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : member.memNo !== "" ? member.memNo : globalState.profile.memNo,
      page: isInit ? 1 : fanBoardData.paging.next,
      records: isInit? 20: fanBoardData.paging.records
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
        if(isLastPage) {
          removeScrollEvent();
        }
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',
          msg: res.message
        }))
      }
    })
  }

  /* 클립 데이터 */
  const getClipData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : member.memNo !== "" ? member.memNo : globalState.profile.memNo,
      page: isInit ? 1 : clipData.paging.next,
      records: isInit? 10: clipData.paging.records
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
        if(isLastPage) {
          removeScrollEvent();
        }
      } else {
        dispatch(setGlobalCtxMessage({type:'alert', msg: res.message }))
      }
    })
  }

  {/* 슬라이드 팝업 오픈 */}
  const openSlidePop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {targetType} = e.currentTarget.dataset;
    switch (targetType) {
      case "header":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, type: "header"});
        break;
      case "block":
        setSlidePopInfo({...slidePopInfo, data: profileData, memNo: profileData.memNo, nickNm: profileData.nickNm, type: "block"});
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
  }

  /* 프로필 이동 */
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
  }

  /* 방송공지 좋아요 */
  const fetchHandleLike = async (regNo, mMemNo, like, likeType, index) => {
    const params = {
      regNo: regNo,
      mMemNo: mMemNo,
      vMemNo: globalState.profile.memNo
    };
    if(like === "n") {
      await Api.profileFeedLike(params).then((res) => {
        if(res.result === "success") {
          if(likeType === "fix") {
            let tempIndex = noticeFixData.fixedFeedList.findIndex(value => value.noticeIdx === parseInt(index));
            let temp = noticeFixData.fixedFeedList.concat([]);
            temp[tempIndex].like_yn = "y";
            temp[tempIndex].rcv_like_cnt++;
            dispatch(setProfileNoticeFixData({...noticeFixData, fixedFeedList: temp}))
          } else {
            let tempIndex = noticeData.feedList.findIndex(value => value.noticeIdx === parseInt(index));
            let temp = noticeData.feedList.concat([]);
            temp[tempIndex].like_yn = "y";
            temp[tempIndex].rcv_like_cnt++;
            dispatch(setProfileNoticeData({...noticeData, feedList: temp}))
          }
        }
      }).catch((e) => console.log(e));
    } else if(like === "y") {
      await Api.profileFeedLikeCancel(params).then((res) => {
        if(res.result === "success") {
          if(likeType === "fix") {
            let tempIndex = noticeFixData.fixedFeedList.findIndex(value => value.noticeIdx === parseInt(index));
            let temp = noticeFixData.fixedFeedList.concat([]);
            temp[tempIndex].like_yn = "n";
            temp[tempIndex].rcv_like_cnt--;
            dispatch(setProfileNoticeFixData({...noticeFixData, fixedFeedList: temp}))
          } else {
            let tempIndex = noticeData.feedList.findIndex(value => value.noticeIdx === parseInt(index));
            let temp = noticeData.feedList.concat([]);
            temp[tempIndex].like_yn = "n";
            temp[tempIndex].rcv_like_cnt--;
            dispatch(setProfileNoticeData({...noticeData, feedList: temp}))
          }
        }
      }).catch((e) => console.log(e));
    }
  };

  /* 피드 좋아요 */
  const fetchFeedHandleLike = async (feedNo, mMemNo, like, likeType, index) => {
    const params = {
      feedNo: feedNo,
      mMemNo: mMemNo,
      vMemNo: globalState.profile.memNo
    };
    if(like === "n") {
      await Api.myPageFeedLike(params).then((res) => {
        if(res.result === "success") {
          let tempIndex = feedData.feedList.findIndex(value => value.reg_no === parseInt(index));
          let temp = feedData.feedList.concat([]);
          temp[tempIndex].like_yn = "y";
          temp[tempIndex].rcv_like_cnt++;
          dispatch(setProfileFeedNewData({...feedData, feedList: temp}))
        }
      }).catch((e) => console.log(e));
    } else if(like === "y") {
      await Api.myPageFeedLikeCancel(params).then((res) => {
        if(res.result === "success") {
          let tempIndex = feedData.feedList.findIndex(value => value.reg_no === parseInt(index));
          let temp = feedData.feedList.concat([]);
          temp[tempIndex].like_yn = "n";
          temp[tempIndex].rcv_like_cnt--;
          dispatch(setProfileFeedNewData({...feedData, feedList: temp}))
        }
      }).catch((e) => console.log(e));
    }
  };

  /* 프로필 사진 확대 */
  const openShowSlide = (data, isList = "y", keyName='profImg', initialSlide= 0) => {
    const getImgList = data => data.map(item => item[keyName])
    let list = [];
    isList === 'y' ? list = getImgList(data) : list.push(data);

    setShowSlide({visible: true, imgList: list, initialSlide});
  };

  const closeShowSlide = useCallback(() => {
    setShowSlide({visible: false, imgList: [], initialSlide: 0});
  },[]);

  /* 피드 사진(여러장) 확대 */
  const showImagePopUp = (data = null, type='', initialSlide = 0)=> {
    if(!data) return;
    let resultMap = [];
    if (type === 'feedList') { // 피드 이미지 리스트
      data.map((v, idx) => {
        if (v?.imgObj) {
          resultMap.push({photo_no: v.photo_no, ...v.imgObj});
        }
      });
    }
    setFeedShowSlide({visible:true, imgList: resultMap, initialSlide });
  };

  /* 피드 사진 닫기 */
  const showSlideClear = useCallback(() => {
    setFeedShowSlide({visible: false, imgList: [], initialSlide: 0});
  }, []);


  /* 스크롤 이벤트 */
  const scrollEvent = useCallback((scrollTarget, callback) => {
    const popHeight = scrollTarget.scrollHeight;
    const targetHeight = scrollTarget.clientHeight;
    const scrollTop = scrollTarget.scrollTop;
    if(popHeight - 1 < targetHeight + scrollTop) {
      callback()
    }
  }, []);

  /* 스크롤 이벤트 remove */
  const removeScrollEvent = useCallback(() => {
    document.removeEventListener('scroll', profileScrollEvent);
  }, []);

  /* 피드, 팬보드, 클립 페이징 */
  const profileScrollEvent = useCallback(() => {
    const callback = () => {
      setScrollPagingCall(scrollPagingCall => scrollPagingCall + 1);
    }
    scrollEvent(document.documentElement, callback);
  }, []);

  // 피드 / 팬보드 / 클립 탭 변경시 액션
  const socialTabChangeAction = (item) => {
    const scrollEventHandler = () => {
      removeScrollEvent();
      document.addEventListener('scroll', profileScrollEvent);
    }

    if(item === profileTab.tabList[0]) {
      getFeedData(true);
      scrollEventHandler();
    }else if(item === profileTab.tabList[1]) {
      getFanBoardData(true);
      scrollEventHandler();
    }else if(item === profileTab.tabList[2]) {
      getClipData(true);
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
    let hasTabParam = false;
    let isWebViewState = false;
    let tabState = 0; // default
    const searchParams = location.search.split('?')[1];
    searchParams.split('&').forEach(item => {
      const itemSplit = item.split('=');
      const paramType = itemSplit[0].toLowerCase();
      if(paramType === 'webview') {
        setWebview(itemSplit[1]);
        isWebViewState = true;
        dispatch(setIsWebView('new'));
      }else if(paramType === 'tab') {
        if(parseInt(itemSplit[1]) >= 0 && parseInt(itemSplit[1]) <= 2) { // 탭이 범위 안에 있을때(0~2)
          tabState = parseInt(itemSplit[1]);
        }
        hasTabParam = true;
      }
    });

    if(hasTabParam) {
      socialTabChangeAction(profileTab.tabList[tabState]);
      setProfileTabName(profileTab.tabList[tabState]);
    }else {
      tabHandler();
    }

    if(isWebViewState) {
      window.history.replaceState('', null, !params.memNo ? '/myProfile' : `/profile/${params.memNo}?webview=new`) // url 변경
    }else {
      window.history.replaceState('', null, !params.memNo ? '/myProfile' : `/profile/${params.memNo}`) // url 변경
    }
  }

  /* 프로필 데이터 초기화 */
  const resetProfileData = () => {
    dispatch(setProfileData(profileDefaultState)); // 프로필 상단
  }

  /* 피드, 팬보드, 클립 초기화 */
  const resetTabData = () => {
    dispatch(setProfileFeedNewData(profileFeedDefaultState)); // 피드
    dispatch(setProfileFanBoardData(profileFanBoardDefaultState)); // 팬보드
    dispatch(setProfileClipData(profileClipDefaultState)); // 클립
  }

  /* 피드글, 팬보드 삭제후 데이터 비우기 */
  const deleteContents = (type, index, memNo) => {
    const callback = async () => {
      if (type === 'notice') {
        const {result, data, message} = await Api.mypage_notice_delete({
          data: {
            delChrgrName: profileData?.nickNm,
            noticeIdx: index,
          }
        })
        if (result === 'success') {
          const noticeList = noticeData.feedList.concat([]).filter((notice, _index) => notice.noticeIdx !== index);
          dispatch(setProfileNoticeData({...noticeData, noticeList}));
        } else {
          dispatch(setGlobalCtxMessage({type:'toast',msg: message}));
        }
      } else if (type === 'fanBoard') { //팬보드 글 삭제 (댓글과 같은 프로시져)
        const list = fanBoardData.list.concat([]).filter((board, _index) => board.replyIdx !== index);

        const {data, result, message} = await Api.mypage_fanboard_delete({data: {memNo, replyIdx: index}});
        if (result === 'success') {
          dispatch(setProfileFanBoardData({...fanBoardData, list}));
        } else {
          dispatch(setGlobalCtxMessage({type:'toast',msg: message}));
        }
      } else if (type === "feed") {
        const feedList = feedData.feedList.concat([]).filter((feedNew, _index) => feedNew.reg_no !== index);
        await Api.myPageFeedDel({
          data: {
            feedNo: index,
            delChrgrName: profileData?.nickNm
          }
        }).then((res) => {
          if(res.result === "success") {
            dispatch(setProfileFeedNewData({...feedData, feedList}));
            getFeedData(true);
          } else {
            dispatch(setGlobalCtxMessage({type:'toast',msg: res.message}));
          }
        }).catch((e) => console.log(e));
      }
    }
    dispatch(setGlobalCtxMessage({type:'confirm',
      msg: '정말 삭제 하시겠습니까?',
      callback
    }));
  }

  const headerBackEvent = () => {
    if(webview === 'new' && isHybrid()) {
      if(location.key) {
        history.goBack();
      }else {
        Hybrid('CloseLayerPopup');
      }
    }else {
      history.goBack();
    }
  }

  const openNoticePop = () => {
    dispatch(setCommonPopupOpenData());
  }

  /* 하단 현재 탭 데이터 초기화 */
  const profileTabDataCall = () => {
    if(profileTab.tabName === profileTab.tabList[0]) {
      document.addEventListener('scroll', profileScrollEvent);
      getFeedData(true);
    }else if(profileTab.tabName === profileTab.tabList[1]) {
      document.addEventListener('scroll', profileScrollEvent);
      getFanBoardData(true);
    }else if(profileTab.tabName === profileTab.tabList[2]) {
      document.addEventListener('scroll', profileScrollEvent);
    }
    // 탭 유지, 데이터 가져오기
    getNoticeData(true); // 방송공지
    getNoticeFixData(true); // 방송공지(고정)
    getFeedData(true); // 피드
    getFanBoardData(true);
    getClipData(true);

    dispatch(setProfileTabData({...profileTab, isRefresh: true, isReset: true})); // 하단 탭
  }

  /* 하단 탭 기본값으로 초기화 */
  const profileTabInit = () => {
    dispatch(setProfileTabData({
      ...profileTab,
      tabName: profileDefaultTab,
      isReset: true
    }))
    dispatch(setProfileNoticeData(profileNoticeDefaultState)); // 방송공지
    dispatch(setProfileNoticeFixData(profileNoticeFixDefaultState)); // 방송공지(고정)
    dispatch(setProfileFeedNewData(profileFeedDefaultState)); // 피드
    dispatch(setProfileFanBoardData(profileFanBoardDefaultState)); // 팬보드
    dispatch(setProfileClipData(profileClipDefaultState)); // 클립
    document.addEventListener('scroll', profileScrollEvent);
    setScrollPagingCall(1);
  }

  /* 하단 탭 핸들러(componentDidMount 시점) */
  const tabHandler = () => {
    if(profileTab.isReset) { // 탭, 데이터 초기화
      profileTabInit();
    }else if(profileTab.isRefresh) { // 탭 유지, 데이터 초기화
      profileTabDataCall();
    }else { // 초기화 안하는 경우 (글 상세, 글 쓰기)
      if(profileTab.tabName === profileTab.tabList[0] && !feedData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }else if(profileTab.tabName === profileTab.tabList[1] && !fanBoardData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }else if(profileTab.tabName === profileTab.tabList[2] && !clipData.isLastPage) {
        document.addEventListener('scroll', profileScrollEvent);
      }

      dispatch(setProfileTabData({...profileTab, isRefresh: true, isReset: true})); // 하단 탭
    }
  }

  /* 스크롤 페이징 이펙트 */
  useEffect(() => {
    if(profileTab.tabName === profileTab.tabList[0] && scrollPagingCall > 1 && !feedData.isLastPage) {
      getFeedData();
    }else if(profileTab.tabName === profileTab.tabList[1] && scrollPagingCall > 1 && !fanBoardData.isLastPage) {
      getFanBoardData();
    }else if(profileTab.tabName === profileTab.tabList[2] && scrollPagingCall > 1 && !clipData.isLastPage) {
      getClipData();
    }
  }, [scrollPagingCall]);

  /* 페이지 이동 */
  useEffect(() => {
    if(globalState.token.isLogin) {
      if(profileReady) {
        getProfileData(); // 프로필 상단 데이터
        profileTabInit();
        if(location.search) {
          parameterManager(); // 주소 뒤에 파라미터 체크
        }

        // 주소가 바뀐 경우 데이터 불러오기
        getNoticeData(true);
        getNoticeFixData(true);
        getFeedData(true);
        getFanBoardData(true);
        getClipData(true);
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
    getNoticeData(true);
    getNoticeFixData(true);
    getFeedData(true);
    getFanBoardData(true);
    getClipData(true);
    /* 프로필 하단 탭 데이터 */
    if(location.search) {
      parameterManager(); // 주소 뒤에 파라미터 체크
    }else {
      tabHandler();
    }

    setIsMyProfile(!params.memNo); // 내 프로필인지 체크
    setProfileReady(true);

    // 스크롤 위치를 기억하는 경우가 있어서 0으로 초기화 해준다.
    window.scrollTo(0, 0);
    return () => {
      resetProfileData();
      removeScrollEvent();
    }
  }, []);

  // 페이지 시작
  return (
    <div id="myprofile">
      <Header title={`${profileData.nickNm}`} type={'back'} backEvent={headerBackEvent}>
        {isMyProfile ?
          <div className="buttonGroup">
            <button className="editBtn" onClick={() => history.push('/myProfile/edit')}>편집</button>
          </div>
          :
          <div className="buttonGroup">
            <button className="moreBtn" data-target-type="header" onClick={openSlidePop}>더보기</button>
          </div>
        }
      </Header>

      {/* 프로필 슬라이더 */}
      <ProfileSwiper
        data={profileDataNoReader}
        openShowSlide={openShowSlide}
        listenOpen={profileData.listenOpen}
        webview={webview}
        type="profile"/>

      {/* 프로필 메인 정보 카드 */}
      <ProfileCard
        data={profileData}
        isMyProfile={isMyProfile}
        openShowSlide={openShowSlide}
        openSlidePop={openSlidePop}/>

      {/* 프로필 서브 정보 */}
      <TotalInfo
        data={profileData}
        goProfile={goProfile}
        openSlidePop={openSlidePop}
        isMyProfile={isMyProfile}
        noticeData={noticeData}
        noticeFixData={noticeFixData}
        getNoticeData={getNoticeData}
        getNoticeFixData={getNoticeFixData}
        fetchHandleLike={fetchHandleLike} />
      
      {/* 소셜 영역 */}
      <section className="socialWrap" ref={socialRef}>
        <Tabmenu
            data={profileTab.tabList}
            tab={profileTab.tabName}
            setTab={setProfileTabName}
            tabChangeAction={socialTabChangeAction}
            count={[`(${feedData?.paging?.total || 0})`,`(${fanBoardData?.paging?.total || 0})`,`(${clipData?.paging?.total || 0})`]}/>

        {/* 피드 */}
        {profileTab.tabName === profileTab.tabList[0] &&
          <FeedSection
            profileData={profileData}
            openShowSlide={openShowSlide}
            feedData={feedData}
            fetchHandleLike={fetchFeedHandleLike}
            showImagePopUp={showImagePopUp}
            isMyProfile={isMyProfile}
            openSlidePop={openSlidePop}
            deleteContents={deleteContents}/>
        }

        {/* 팬보드 */}
        {profileTab.tabName === profileTab.tabList[1] &&
          <FanboardSection
            profileData={profileData}
            fanBoardData={fanBoardData}
            isMyProfile={isMyProfile}
            getFanBoardData={getFanBoardData}
            params={params}
            deleteContents={deleteContents}
            openSlidePop={openSlidePop} />
        }

        {/* 클립 */}
        {profileTab.tabName === profileTab.tabList[2] &&
          <ClipSection
            profileData={profileData}
            clipData={clipData}
            isMyProfile={isMyProfile}
            webview={webview} />
        }

        {/* 프로필 사진 확대 */}
        {showSlide?.visible &&
          <ShowSwiper
            imageList={showSlide?.imgList}
            popClose={closeShowSlide}
            swiperParam={{initialSlide: showSlide?.initialSlide}}/>
        }

        {/* 피드 사진 확대 */}
        {feedShowSlide?.visible && <ShowSwiper imageList={feedShowSlide?.imgList || []} popClose={showSlideClear} swiperParam={{initialSlide: feedShowSlide?.initialSlide}}/>}

        {/* 글쓰기 플로팅 버튼 */}
        {isMyProfile && profileTab.tabName === profileTab.tabList[0] &&
          <FloatBtn profileData={profileData} />
        }
      </section>

      {/* 슬라이드 팝업 모음 */}
      {popup.slidePopup && <SlidepopZip slideData={slidePopInfo} goProfile={goProfile} openSlidePop={openSlidePop} isMyProfile={isMyProfile} />}

      {/* 좋아요 -> ? 아이콘 */}
      {popup.layerPopup && 
        <LayerPopup title="랭킹 기준">
          <ProfileNoticePop />
        </LayerPopup>
      }

      {/* 스페셜DJ 약력 팝업 */}
      {popup.historyPopup && <SpecialHistoryList profileData={profileData} />}
    </div>
  )
}

export default ProfilePage;
