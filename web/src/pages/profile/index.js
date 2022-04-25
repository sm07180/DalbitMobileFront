import React, {useEffect, useState, useRef, useContext, useCallback, useMemo} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
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
  setProfileNoticeData, setProfileFeedNewData, setProfileNoticeFixData, setProfileTabData,
} from "redux/actions/profile";
import {
  profileClipPagingDefault,
  profileClipDefaultState,
  profileDefaultState,
  profileFanBoardDefaultState,
  profileNoticeDefaultState, profilePagingDefault, profileFeedDefaultState, profileNoticeFixDefaultState
} from "redux/types/profileType";
import {goMail} from "common/mailbox/mail_func";
import {MailboxContext} from "context/mailbox_ctx";
import LikePopup from "pages/profile/components/popSlide/LikePopup";
import {goProfileDetailPage} from "pages/profile/contents/profileDetail/profileDetail";
import {Hybrid, isHybrid} from "context/hybrid";
import ProfileNoticePop from "pages/profile/components/ProfileNoticePop";
import {setSlidePopupOpen, setSlidePopupClose, setIsWebView, setSlideClose} from "redux/actions/common";
import noticeFix from "redux/reducers/profile/noticeFix";
import {IMG_SERVER} from "context/config";

const ProfilePage = () => {
  const history = useHistory()
  // const location = useLocation(); => get parameter 이슈
  const context = useContext(Context)
  const { mailboxAction } = useContext(MailboxContext);
  const params = useParams();
  const tabmenuRef = useRef();
  const socialRef = useRef();
  const floatingRef = useRef();

  const [showSlide, setShowSlide] = useState({visible: false, imgList: [], initialSlide: 0}); // 프사 확대 슬라이드
  const [isMyProfile, setIsMyProfile] = useState(false); // 내프로필인지
  const [openFanStarType, setOpenFanStarType] = useState(''); // 팬스타 팝업용 타입
  const [blockReportInfo, setBlockReportInfo] = useState({memNo: '', memNick: ''}); // 차단/신고 팝업 유저 정보
  const [scrollPagingCall, setScrollPagingCall] = useState(1); // 스크롤 이벤트 갱신을 위함

  const [webview, setWebview] = useState('');
  const [likePopTabState, setLikePopTabState] = useState({titleTab: 0, subTab: 0, subTabType: ''});
  const [profileReady, setProfileReady] = useState(false); // 페이지 mount 후 ready

  const [morePopHidden, setMorePopHidden] = useState(false); // slidePop이 unmount 될때 꼬여서 임시로 처방

  const [floatBtnHidden, setFloatBtnHidden] = useState(false); // 플로팅 버튼 온 오프
  const [floatScrollAction, setFloatScrollAction] = useState(false); // 플로팅 버튼 스크롤 이벤트
  const [feedShowSlide, setFeedShowSlide] = useState({visible: false, imgList: [], initialSlide: 0});

  const [slidePopNo, setSlidePopNo] = useState(""); // 슬라이드 팝업 종류

  const dispatch = useDispatch();
  const profileData = useSelector(state => state.profile);
  const noticeData = useSelector(state => state.brdcst);
  const fanBoardData = useSelector(state => state.fanBoard);
  const clipData = useSelector(state => state.profileClip);
  const popup = useSelector(state => state.popup);
  const profileTab = useSelector(state => state.profileTab);
  const feedData = useSelector(state => state.feed);
  const noticeFixData = useSelector(state => state.noticeFix);

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

  /* 방송공지 데이터 호출 */
  const getNoticeData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
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
        context.action.alert({
          msg: res.message
        })
      }
    })
  }

  /* 방송공지(고정) 데이터 호출 */
  const getNoticeFixData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
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
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  };

  /* 피드 데이터 */
  const getFeedData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
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
        context.action.alert({msg: res.message});
      }
    }).catch((e) => console.log(e));
  };

  /* 팬보드 데이터 */
  const getFanBoardData = (isInit) => {
    const apiParams = {
      memNo: params.memNo ? params.memNo : context.profile.memNo,
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

  /* 방송공지 좋아요 */
  const fetchHandleLike = async (regNo, mMemNo, like, likeType, index) => {
    const params = {
      regNo: regNo,
      mMemNo: mMemNo,
      vMemNo: context.profile.memNo
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
      vMemNo: context.profile.memNo
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

  /* 팝업 닫기 공통 */
  const closePopupAction = () => {
    closePopup(dispatch);
  }

  /* 헤더 더보기 버튼 클릭 */
  const openMoreList = () => {
    setMorePopHidden(false);
    dispatch(setSlidePopupOpen())
    setSlidePopNo("header");
  }

  /* 차단/신고 팝업 열기 (param: {memNo: '', memNick: ''}) */
  const openBlockReportPop = (blockReportInfo) => {
    dispatch(setSlidePopupOpen())
    setSlidePopNo("block");
    setBlockReportInfo(blockReportInfo);
  }

  /* 차단/신고 팝업 닫기 */
  const closeBlockReportPop = () => {
    setBlockReportInfo({memNo: '', memNick: ''});
    closePopupAction();
  }

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

  /* 팬,스타 슬라이드 팝업 열기/닫기 */
  const openPopFanStar = (e) => {
    const {targetType} = e.currentTarget.dataset
    setOpenFanStarType(targetType)
    setSlidePopNo("fanStar")
    dispatch(setSlidePopupOpen());
  }

  /* 좋아요 슬라이드 팝업 열기/닫기 (tabState는 열고싶은 탭 있을때 파라미터를 넘긴다 탭 순서대로 0부터) */
  const openPopLike = (e, tabState) => {
    e.preventDefault();
    e.stopPropagation();
    setLikePopTabState(tabState)
    setSlidePopNo("like")
    dispatch(setSlidePopupOpen());
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
      setScrollPagingCall(scrollPagingCall => scrollPagingCall + 1);
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
          tabState = parseInt(itemSplit[1])
        }
        hasTabParam = true;
      }
    });

    if(hasTabParam) {
      socialTabChangeAction(profileTab.tabList[tabState])
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
            context.action.toast({msg: res.message});
          }
        }).catch((e) => console.log(e));
      }
    }
    context.action.confirm({
      msg: '정말 삭제 하시겠습니까?',
      callback
    });
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

  /* 플루팅 버튼 이벤트 */
  const floatScrollEvent = useCallback(() => {
    const floatNode = floatingRef.current;
    const scrollBottom = floatNode?.offsetTop;

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
    if(context.token.isLogin) {
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

  // 플로팅 버튼 오픈시 스크롤 막기
  useEffect(() => {
    if (floatBtnHidden === true) {
      document.body.classList.add('overflowHidden')
    } else {
      document.body.classList.remove('overflowHidden')
    }
  }, [floatBtnHidden])

  useEffect(() => {
    document.addEventListener('scroll', floatScrollEvent);
    return () => {
      document.removeEventListener('scroll', floatScrollEvent);
    }
  },[])

  useEffect(() => {
    if(!context.token.isLogin) {
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
            <button className="moreBtn" onClick={openMoreList}>더보기</button>
          </div>
        }
      </Header>
      <section className='profileTopSwiper'>
        <TopSwiper data={profileDataNoReader} openShowSlide={openShowSlide} listenOpen={profileData.listenOpen}
                   webview={webview} type="profile"/>
      </section>
      <section className="profileCard">
        <ProfileCard data={profileData} isMyProfile={isMyProfile} openShowSlide={openShowSlide} fanToggle={fanToggle} setSlidePopNo={setSlidePopNo}
                     openPopFanStar={openPopFanStar} openPopLike={openPopLike} popup={popup}
        />
      </section>
      <section className='totalInfo'>
        <TotalInfo data={profileData} goProfile={goProfile} openPopLike={openPopLike} isMyProfile={isMyProfile} noticeData={noticeData} noticeFixData={noticeFixData}
                   getNoticeData={getNoticeData} getNoticeFixData={getNoticeFixData} fetchHandleLike={fetchHandleLike} />
      </section>
      <section className="socialWrap" ref={socialRef}>
        <div className="tabmenuWrap" ref={tabmenuRef}>
          <Tabmenu data={profileTab.tabList} tab={profileTab.tabName} setTab={setProfileTabName} tabChangeAction={socialTabChangeAction}
                   subTextList={[`(${feedData?.paging?.total || 0})`,`(${fanBoardData?.paging?.total || 0})`,`(${clipData?.paging?.total || 0})`]}/>
        </div>

        {/* 피드 */}
        {profileTab.tabName === profileTab.tabList[0] &&
          <FeedSection profileData={profileData} openShowSlide={openShowSlide} feedData={feedData} fetchHandleLike={fetchFeedHandleLike} showImagePopUp={showImagePopUp}
                       isMyProfile={isMyProfile} openBlockReportPop={openBlockReportPop} deleteContents={deleteContents}/>
        }

        {/* 팬보드 */}
        {profileTab.tabName === profileTab.tabList[1] &&
          <FanboardSection profileData={profileData} fanBoardData={fanBoardData} isMyProfile={isMyProfile} getFanBoardData={getFanBoardData} params={params}
                           deleteContents={deleteContents} openBlockReportPop={openBlockReportPop} />
        }

        {/* 클립 */}
        {profileTab.tabName === profileTab.tabList[2] &&
          <ClipSection profileData={profileData} clipData={clipData} isMyProfile={isMyProfile} webview={webview} />
        }

        {/* 프로필 사진 확대 */}
        {showSlide?.visible &&
          <ShowSwiper imageList={showSlide?.imgList} popClose={closeShowSlide} swiperParam={{initialSlide: showSlide?.initialSlide}}/>
        }

        {/* 피드 사진 확대 */}
        {feedShowSlide?.visible && <ShowSwiper imageList={feedShowSlide?.imgList || []} popClose={showSlideClear} swiperParam={{initialSlide: feedShowSlide?.initialSlide}}/>}

        {/* 글쓰기 플로팅 버튼 */}
        {isMyProfile && profileTab.tabName === profileTab.tabList[0] &&
        <button className={`floatBtn ${floatBtnHidden === true ? 'on' : ''}`} onClick={floatingOpen} ref={floatingRef}>
          <div className="blackCurtain"/>
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
        }
      </section>

      {/* 슬라이드 팝업 */}
      {popup.slidePopup &&
        <PopSlide>
          {slidePopNo === "header" ?
          <section className='profileMore'>
            <div className="moreList" onClick={goMailAction}>메세지</div>
            {!profileData.isFan && <div className="moreList" onClick={editAlarm}>방송 알림 {profileData.isReceive ? 'OFF' : 'ON'}</div>}
            <div className="moreList"
                onClick={() => {
                  openBlockReportPop({memNo: profileData.memNo, memNick: profileData.nickNm});
                }}>차단/신고</div>
          </section>
          : slidePopNo === "fanStar" ?
          <FanStarLike type={openFanStarType} isMyProfile={isMyProfile} fanToggle={fanToggle} profileData={profileData}
                       goProfile={goProfile} myMemNo={context.profile.memNo}
                       closePopupAction={closePopupAction}
          />
          : slidePopNo === "like" ?
          <LikePopup isMyProfile={isMyProfile} fanToggle={fanToggle} profileData={profileData} goProfile={goProfile}
                     myMemNo={context.profile.memNo} likePopTabState={likePopTabState} closePopupAction={closePopupAction}
          />
          : slidePopNo === "block" ?
          <BlockReport blockReportInfo={blockReportInfo} closeBlockReportPop={closeBlockReportPop} />
          : slidePopNo === "present" &&
          <Present profileData={profileData} closePopupAction={closePopupAction} />
          }
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
