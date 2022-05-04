import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';

import Api from 'context/api';
import {useHistory, useParams} from 'react-router-dom';
// global components
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
// components
import Tabmenu from './Tabmenu';
import FloatBtn from './FloatBtn';
// contents
import FeedSection from '../contents/profileDetail/FeedSection';
import FanboardSection from '../contents/profileDetail/FanboardSection';
import ClipSection from '../contents/profileDetail/ClipSection';
// redux
import {useDispatch, useSelector} from "react-redux";
import {
  setProfileTabData,
  setProfileFeedNewData, setProfileFanBoardData, setProfileClipData,
  setProfileNoticeData, setProfileNoticeFixData
} from "redux/actions/profile";
import {
  profilePagingDefault,
  profileFeedDefaultState,
  profileFanBoardDefaultState,
  profileClipDefaultState, profileClipPagingDefault,
  profileNoticeDefaultState, profileNoticeFixDefaultState
} from "redux/types/profileType";
import {setIsWebView} from "redux/actions/common";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const SocialContents = (props) => {
  const {profileData, profileReady, isMyProfile, webview, setWebview} = props;
  const params = useParams();
  const socialRef = useRef();

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const profileTab = useSelector(state => state.profileTab);
  const feedData = useSelector(state => state.feed);
  const fanBoardData = useSelector(state => state.fanBoard);
  const clipData = useSelector(state => state.profileClip);
  const member = useSelector(state => state.member);

  const [scrollPagingCall, setScrollPagingCall] = useState(1); // 스크롤 이벤트 갱신을 위함

  const [feedShowSlide, setFeedShowSlide] = useState({visible: false, imgList: [], initialSlide: 0});

  const profileDefaultTab = profileTab.tabList[1]; // 프로필 디폴트 탭 - 피드

  {/* 피드 데이터 Api */}
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

  {/* 팬보드 데이터 Api */}
  const getFanBoardData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : member.memNo !== "" ? member.memNo : globalState.profile.memNo,
      page: isInit ? 1 : fanBoardData.paging.next,
      records: isInit? 10: fanBoardData.paging.records
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

  {/* 클립 데이터 Api */}
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
    console.log('scrollEvent');
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
    console.log('scroll-profileScroll');
  }, []);

  // 피드 / 팬보드 / 클립 탭 변경시 액션
  const socialTabChangeAction = (item) => {
    console.log('scrollTest');
    const scrollEventHandler = () => {
      console.log('scrollTest');
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

  /* 하단 현재 탭 데이터 초기화 */
  const profileTabDataCall = () => {
    if(profileTab.tabName === profileTab.tabList[0]) {
      document.addEventListener('scroll', profileScrollEvent);
      getFeedData(true);
    }else if(profileTab.tabName === profileTab.tabList[1]) {
      document.addEventListener('scroll', profileScrollEvent);
      console.log('scrollDataCall');
      getFanBoardData(true);
    }else if(profileTab.tabName === profileTab.tabList[2]) {
      document.addEventListener('scroll', profileScrollEvent);
    }
    // 탭 유지, 데이터 가져오기
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
      console.log('scroll=222');
      getFanBoardData();
    }else if(profileTab.tabName === profileTab.tabList[2] && scrollPagingCall > 1 && !clipData.isLastPage) {
      getClipData();
    }
  }, [scrollPagingCall]);

  /* 페이지 이동 */
  useEffect(() => {
    if(profileReady) {
      profileTabInit();
      console.log('666');
      if(location.search) {
        parameterManager(); // 주소 뒤에 파라미터 체크
      }

      // 주소가 바뀐 경우 데이터 불러오기
      getFeedData(true);
      getFanBoardData(true);
      getClipData(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    getFeedData(true);
    getFanBoardData(true);
    getClipData(true);
    /* 프로필 하단 탭 데이터 */
    if(location.search) {
      parameterManager(); // 주소 뒤에 파라미터 체크
    }else {
      tabHandler();
    }

    // 스크롤 위치를 기억하는 경우가 있어서 0으로 초기화 해준다.
    window.scrollTo(0, 0);
    return () => {
      removeScrollEvent();
    }
  }, []);

  // 페이지 시작
  return (
    <section className="socialWrap" ref={socialRef}>
      {/* 탭 메뉴 */}
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
          feedData={feedData}
          fetchHandleLike={fetchFeedHandleLike}
          showImagePopUp={showImagePopUp}
          isMyProfile={isMyProfile}
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
          deleteContents={deleteContents}/>
      }

      {/* 클립 */}
      {profileTab.tabName === profileTab.tabList[2] &&
        <ClipSection
          profileData={profileData}
          clipData={clipData}
          isMyProfile={isMyProfile}
          webview={webview} />
      }
      
      {/* 피드 사진 확대 */}
      {feedShowSlide?.visible &&
        <ShowSwiper imageList={feedShowSlide?.imgList || []} popClose={showSlideClear} swiperParam={{initialSlide: feedShowSlide?.initialSlide}}/>
      }
      
      {/* 글쓰기 플로팅 버튼 */}
      {isMyProfile && profileTab.tabName === profileTab.tabList[0] &&
        <FloatBtn profileData={profileData} />
      }
    </section>
  )
}

export default SocialContents;
