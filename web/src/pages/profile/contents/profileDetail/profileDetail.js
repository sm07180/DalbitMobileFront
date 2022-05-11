import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'
import Header from 'components/ui/header/Header'
import './profileDetail.scss'
import ListRowComponent from "pages/profile/components/ListRowComponent";
import ProfileReplyComponent from "pages/profile/components/ProfileReplyComponent";
import Utility from "components/lib/utility";
import Swiper from "react-id-swiper";
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import PopSlide, {closePopup} from "components/ui/popSlide/PopSlide";
import BlockReport from "pages/profile/components/popup/BlockReport";
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupOpenData, setSlidePopupOpen} from "redux/actions/common";
import FeedLike from "pages/profile/components/FeedLike";
import {setProfileDetailData, setProfileTabData} from "redux/actions/profile";
import {setGlobalCtxAlertStatus, setGlobalCtxMessage} from "redux/actions/globalCtx";

const ProfileDetail = (props) => {
  const history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //context
  const {token, profile} = globalState
  const {memNo, type, index} = useParams();
  const tmemNo = profile.memNo;
  //memNo :글이 작성되있는 프로필 주인의 memNo

  const replyRef = useRef(null);
  const replyButtonRef = useRef(null);  //button Ref
  const blurBlockStatus = useRef(false); // click 이벤트 막기용
  const replyIsMoreRef = useRef(null);
  const infoRef = useRef(null);
  const member = useSelector(state => state.member);

  //팝업 사진 스와이퍼
  const [tooltipEvent, setTooltipEvent] = useState(false);
  const [showSlide, setShowSlide] = useState(false);
  const [imgList, setImgList] = useState([]);

  // 댓글 수정시 사용 action :['add' 등록, 'edit': 수정, replyIdx: 수정할 글번호]
  const [inputMode, setInputMode] = useState({action:'add', replyIdx: null });
  const setInputModeAction = (action = 'add', replyIdx) => {
    if(action ==='add'){
      setInputMode({action:'add', replyIdx: null });
    } else if(action ==='edit') {
      setInputMode({action:'edit', replyIdx });
    }
  };

  const [item, setItem] = useState(null);
  const [replyList, setReplyList] = useState([]);
  const [isMore, setIsMore] = useState(false);
  const [text, setText] = useState('');

  //차단 / 신고하기
  const [blockReportInfo, setBlockReportInfo] = useState({memNo: '', nickNm: ''});
  const popup = useSelector(state => state.popup);
  const detailData = useSelector(state => state.detail);

  // 프로필 탭
  const profileTab = useSelector((state) => state.profileTab);

  const swiperFeeds = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  };

  //내 프로필 여부 (나의 프로필에서 작성한 피드, 팬보드 여부 체크)
  const isMyProfile = (token?.isLogin) && profile?.memNo === memNo;

  //내가 작성한 글 여부
  const isMyContents = (token?.isLogin) && item && profile?.memNo?.toString() === ((type === 'notice' || type === 'feed') ? item?.mem_no : item?.writer_mem_no)?.toString();
  const adminChecker = globalState?.adminChecker;

  // 탭 유지 시키기
  const tabResetBlock = () => {
    dispatch(setProfileTabData({...profileTab, isRefresh: true, isReset: false}));
  };

  /* 프로필 사진 확대 */
  const openShowSlide = (data, isList = "y", keyName='profImg') => {
    const getImgList = data => data.map(item => item[keyName])
    let list = [];
    isList === 'y' ? list = getImgList(data) : list.push(data);

    setImgList(list);
    setShowSlide(true);
  }

  //상세조회
  const getDetailData = () => {
    if(type==='notice') {
      Api.mypage_notice_detail_sel({noticeNo: index, memNo})
        .then((res) => {
          const {data, result, message} = res;
          if(result === 'success'){
            dispatch(setProfileDetailData({
              ...detailData,
              list: data
            }))
            setItem(data);
          } else {
            dispatch(setGlobalCtxAlertStatus({
              status: true,
              content: '해당 게시글이 존재하지 않습니다.',
              callback: () => {
                history.goBack()
              },
              cancelCallback: () => {
                history.goBack()
              },
            }));

          }
        });
    } else if (type === 'fanBoard') {
      Api.mypage_fanboard_detail({
        memNo, fanBoardNo: index
      }).then((res) => {
        const {data, result, message} = res;
        if (result === 'success') {
          setItem(data);
        } else {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            content: '해당 게시글이 존재하지 않습니다.',
            callback: () => {
              history.goBack()
            },
            cancelCallback: () => {
              history.goBack()
            },
          }));

        }
      })
    } else if(type === "feed") {
      Api.myPageFeedDetailSel({
        feedNo: index,
        memNo: memNo,
        viewMemNo: member.memNo ? member.memNo : globalState.profile.memNo
      }).then((res) => {
        const {data, result, message} = res;
        if(result === "success") {
          dispatch(setProfileDetailData({
            ...detailData,
            list: data
          }))
          setItem(data);
        } else {
          dispatch(setGlobalCtxAlertStatus({
            status: true,
            content: '해당 게시글이 존재하지 않습니다.',
            callback: () => {
              history.goBack()
            },
            cancelCallback: () => {
              history.goBack()
            },
          }));
        }
      }).catch((e) => console.log(e));
    }
  }

  //댓글 조회
  const getReplyList = (_page, records= 10) => {
    if (type === 'notice') {
      Api.getMypageNoticeReply({
        memNo,
        noticeIdx: index,
        page: _page,
        records
      }).then(res => {
        const {data, result, message} = res;
        if (result === 'success') {
          setReplyList(data?.list);
        }

      });
    } else if (type === 'fanBoard') {
      Api.member_fanboard_reply({
        params: {
          memNo,
          replyIdx: index
        }
      }).then((res) => {
        const {data, result, message} = res;

        if (result === 'success') {
          setReplyList(data?.list);
        }
      });

    } else if(type === "feed") {
      const params = {
        feedNo: index,
        pageNo: 1,
        pageCnt: 100,
      }
      Api.myPageFeedReplyList(params).then((res) => {
        if(res.result === "success") {
          setReplyList(res.data?.list);
        }
      }).catch((e) => console.log(e));
    }
  }

  //전체 조회  (피드, 팬보드)
  const getAllData = (_page, records) => {
    getDetailData();
    getReplyList(_page, records);
  }

  //어떠한 요소를 클릭했을때 blur(inputFormFocusEvent)를 막으려면 이 함수를 호출
  const blurBlock = () => {
    blurBlockStatus.current = true;
  };

  //댓글입력 폼, 댓글등록 버튼 이외에 요소를 누르면 blur로 판단하여 입력폼 초기화 및 댓글 입력폼을 등록상태로 변경
  const inputFormFocusEvent = (e) => {
    if(isMore) setIsMore(false);
    if(!blurBlockStatus.current) {
      if (replyRef.current !== e.target && replyButtonRef.current !== e.target) {
        //blur로 판단
        if (inputMode.action === 'edit') {
          setInputModeAction('add');
        }
      }
    }
    blurBlockStatus.current = false;
  };

  // 좋아요 툴팁 이벤트
  const tooltipScrollEvent = useCallback(() => {
    const infoNode = infoRef.current;
    const infoPosition = infoNode?.offsetTop;
    const scrollBottom = window.scrollY + document.documentElement.clientHeight - 100;

    if (scrollBottom > infoPosition) {
      setTooltipEvent(true);
    }
  }, []);

  useEffect(() => {
    const fromMemNo = history?.location?.state?.fromMemNo || 0;
    fromMemNo === memNo && tabResetBlock();
    getAllData(1, 9999);
  }, []);

  useEffect(() => {
    document.body.addEventListener('click', inputFormFocusEvent);
    return () => {
      document.body.removeEventListener('click', inputFormFocusEvent);
    }
  },[inputMode, text, isMore]);

  //글 삭제
  const deleteContents = () => {
    const callback = async () => {
      if (type === 'notice') {
        const {result, data, message} = await Api.mypage_notice_delete({
          data: {
            noticeNo: index,
            delChrgrName: item?.nickName,
          }
        })

        if (result === 'success') {
          history.goBack();
        } else {
          dispatch(setGlobalCtxMessage({type:'alert',msg: message}));
        }

      } else if (type === 'fanBoard') { //팬보드 글 삭제 (댓글과 같은 프로시져)
        const {data, result, message} = await Api.mypage_fanboard_delete({data: {memNo, replyIdx: index}});
        if (result === 'success') {
          history.goBack();
        } else {
          dispatch(setGlobalCtxMessage({type:'alert',msg: message}));
        }
      } else if(type === "feed") {
        const {result, data, message} = await Api.myPageFeedDel({
          data: {
            feedNo: index,
            delChrgrName: item?.nickName || item?.mem_nick
          }
        })
        if(result === "success") {
          history.goBack();
        } else {
          dispatch(setGlobalCtxMessage({type:'alert',msg: message}));
        }
      }
    }
    dispatch(setGlobalCtxMessage({type:'confirm',
      msg: '정말 삭제 하시겠습니까?',
      callback
    }));
  };

  const validChecker = () => {
    let confirm = true;
    let message = '';

    if(text.length === 0){
      message = '내용을 입력해주세요.';
      confirm = false;
    }
    if (text.length > 100) {
      message = '내용을 100자 이하로 입력해주세요.';
      confirm = false;
    }

    if(!confirm)
      dispatch(setGlobalCtxMessage({type:'toast',msg: message}));

    return confirm;
  };

  //댓글 등록
  const replyWrite = async () => {
    if(!validChecker()) return;

    if (type === 'notice') {
      const {data, result, message} = await Api.insertMypageNoticeReply({
        memNo,
        noticeIdx: index,
        contents: text
      });

      dispatch(setGlobalCtxMessage({type:'toast',msg: message}));
      if (result === 'success') {
        setText('');
        if (replyRef.current) {
          replyRef.current.innerText = '';
        }
        getAllData(1, 9999);
      } else {
      }
    } else if (type === 'fanBoard') {
      const {data, result, message} = await Api.member_fanboard_add({data: {
          memNo,
          depth: 2, // (1: 팬보드, 2: 댓글)
          parentGroupIdx : index,
          viewOn: 1,
          contents: text
        }});

      dispatch(setGlobalCtxMessage({type:'toast',msg: message}));
      if (result === 'success') {
        setText('');
        if (replyRef.current) {
          replyRef.current.innerText = '';
        }
        getAllData(1, 9999);
      } else {
      }
    } else if(type === "feed") {
      Api.myPageFeedReplyAdd({reqBody: true, data: {
          regNo: index,
          memNo: memNo,
          tmemNo: tmemNo,
          tmemConts: text
        }
      }).then((res) => {
        if(res.result === "success") {
          setText("");
          if(replyRef.current) {
            replyRef.current.innerText = "";
          }
          dispatch(setGlobalCtxMessage({type:'toast',msg: res.message}));
          getAllData(1, 9999);
        } else {}
      }).catch((e) => console.log(e));
    }
  };

  const replyEditFormActive = (replyIdx, originText) => {
    replyRef.current.focus();
    replyRef.current.innerText = originText;
    setText(originText);

    //수정 폼 활성화
    setInputModeAction('edit', replyIdx);
  };

  //댓글 수정
  //replyIdx : 댓글 번호, contents: 수정할 내용
  const replyEdit = async (replyIdx, contents) => {
    if(!validChecker()) return;

    if(type==='notice'){
      const {data, result, message} = await Api.modifyMypageNoticeReply({
          memNo,
          replyIdx,
          contents
        }
      );

      if (result === 'success') {
        dispatch(setGlobalCtxMessage({type:'toast',msg: '댓글이 수정되었습니다.'}))

        getAllData(1, 9999);
        setText('');
        replyRef.current.innerText = '';
        setInputModeAction('add');
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',msg: message}));
      }

    } else if (type === 'fanBoard') {
      const {data, result, message} = await Api.mypage_board_edit({data: {
          memNo,
          replyIdx,
          contents
        }});

      if(result === 'success'){
        dispatch(setGlobalCtxMessage({type:'toast',msg: '댓글이 수정되었습니다.'}))

        getAllData(1, 9999);
        setText('');
        replyRef.current.innerText = '';
        setInputModeAction('add');
      }else{
        dispatch(setGlobalCtxMessage({type:'alert',msg: message}));
      }

    } else if(type === "feed") {
      Api.myPageFeedReplyUpd({reqBody: true, data: {
          tailNo: replyIdx,
          tmemConts: contents
        }}).then((res) => {
        if(res.result === "success") {
          dispatch(setGlobalCtxMessage({type:'toast',msg: '댓글이 수정되었습니다.'}));
          getAllData(1, 9999);
          setText("");
          replyRef.current.innerText = "";
          setInputModeAction("add");
        } else {
          dispatch(setGlobalCtxMessage({type:'alert',msg: res.message}));
        }
      }).catch((e) => console.log(e));
    }
  };

  //댓글 삭제
  const replyDelete = (replyIdx) => {
    const callback = async (replyIdx) => {
      if (type === 'notice') {
        const {data, result, message} = await Api.deleteMypageNoticeReply({memNo, replyIdx});
        if (result === 'success') {
          getAllData(1, 9999);
        } else {
          //실패
        }

      } else if (type === 'fanBoard') {
        const {data, result, message} = await Api.mypage_fanboard_delete({data: {memNo, replyIdx}});
        if (result === 'success') {
          getAllData(1, 9999);
        } else {
          //실패
        }
      } else if(type === "feed") {
        const params = {
          regNo: index,
          tailNo: replyIdx,
          chrgrName: memNo
        }
        await Api.myPageFeedReplyDel(params).then((res) => {
          if(res.result === "success") {
            getAllData(1, 9999);
          } else {
            //실패
          }
        }).catch((e) => console.log(e));
      }
    };

    dispatch(setGlobalCtxMessage({type:'confirm',
      msg: '정말 삭제 하시겠습니까?',
      callback: () => callback(replyIdx)
    }));
  };

  /* 좋아요 */
  const fetchHandleLike = async (regNo, mMemNo, like) => {
    if(type === 'notice') {
      const params = {
        regNo: regNo,
        mMemNo: mMemNo,
        vMemNo: globalState.profile.memNo
      };
      if(like === "n") {
        await Api.profileFeedLike(params).then((res) => {
          if(res.result === "success") {
            let temp = detailData.list;
            temp.like_yn = "y";
            temp.rcv_like_cnt++;
            dispatch(setProfileDetailData({...detailData, list: temp}));
          }
        }).catch((e) => console.log(e));
      } else if(like === "y") {
        await Api.profileFeedLikeCancel(params).then((res) => {
          if(res.result === "success") {
            let temp = detailData.list;
            temp.like_yn = "n";
            temp.rcv_like_cnt--;
            dispatch(setProfileDetailData({...detailData, list: temp}));
          }
        }).catch((e) => console.log(e));
      }
    } else if(type === "feed") {
      const params = {
        feedNo: regNo,
        mMemNo: mMemNo,
        vMemNo: globalState.profile.memNo
      };
      if(like === "n") {
        await Api.myPageFeedLike(params).then((res) => {
          if(res.result === "success") {
            let temp = detailData.list;
            temp.like_yn = "y";
            temp.rcv_like_cnt++;
            dispatch(setProfileDetailData({...detailData, list: temp}));
          }
        }).catch((e) => console.log(e));
      } else if(like === "y") {
        await Api.myPageFeedLikeCancel(params).then((res) => {
          if(res.result === "success") {
            let temp = detailData.list;
            temp.like_yn = "n";
            temp.rcv_like_cnt--;
            dispatch(setProfileDetailData({...detailData, list: temp}));
          }
        }).catch((e) => console.log(e));
      }
    }
  }

  /* 차단/신고 팝업 열기 */
  const openBlockReportPop = (memNo, nickNm) => {
    dispatch(setSlidePopupOpen());
    setBlockReportInfo({memNo, nickNm});
  }

  /* 차단/신고 팝업 닫기 */
  const closeBlockReportPop = () => {
    closePopup(dispatch);
    setBlockReportInfo({memNo: '', memNick: ''});
  }

  const photoClickEvent = (memNo) => {
    history.push(`/profile/${memNo}`)
  }

  useEffect(() => {
    document.addEventListener('scroll', tooltipScrollEvent);
    return () => {
      document.removeEventListener('scroll', tooltipScrollEvent);
    }
  },[])

  return (
    <div id="profileDetail">
      <Header title="" type="back">
        <div className="buttonGroup" onClick={(e) => setIsMore(!isMore)}>
          <div className='moreBtn'>
            <img src={`${IMG_SERVER}/common/header/icoMore-b.png`} alt="" />
            {isMore &&
            <div className="isMore">
              {type !== 'fanBoard' && isMyContents &&
              <button onClick={() => goProfileDetailPage({history, memNo , action:'modify',type, index })}>
                수정하기</button>}
              {(isMyContents || adminChecker) &&
              <button onClick={deleteContents}>삭제하기</button>}
              {!isMyContents &&
              <button onClick={() => openBlockReportPop(item?.mem_no || item?.writer_mem_no, item?.nickName)}>
                차단/신고하기</button>}
            </div>
            }
          </div>
        </div>
      </Header>
      <section className='detailWrap'>
        {/* 피드, 팬보드 게시글 영역 */}
        <div className="detail">
          {item && <ListRowComponent item={item} isMyProfile={isMyProfile} index={index} type={type}
                                     photoClick={() => {photoClickEvent(item?.mem_no ? item.mem_no : item?.writer_mem_no)}}
                                     disableMoreButton={false}/>}
          <pre className="text">{item?.feed_conts ? item.feed_conts : item?.contents}</pre>
          {(type === 'notice' || type === 'feed') && (item?.photoInfoList?.length > 1 ?
              <div className="swiperPhoto" onClick={() => openShowSlide(item.photoInfoList, 'y', 'imgObj')}>
                {item.photoInfoList.map((photo,index) => {
                  return (
                    <div className="photo" key={index}>
                      <img src={photo?.imgObj?.thumb500x500} alt="이미지" />
                    </div>
                  )
                })}
              </div>
              : item?.photoInfoList?.length === 1 ?
                <div className="swiperPhoto" onClick={() => openShowSlide(item?.photoInfoList[0]?.imgObj, 'n')}>
                  <div className="photo">
                    <img src={item?.photoInfoList[0]?.imgObj?.thumb500x500} alt="" />
                  </div>
                </div>
                : <></>
          )}
          {type === 'fanBoard' ?
            <div className="info">
              <i className="cmt">{(replyList?.length) ? Utility.printNumber(replyList?.length) : 0}</i>
            </div>
            :
            <FeedLike data={detailData.list} fetchHandleLike={fetchHandleLike} type={type} detail={"detail"}/>
          }
        </div>

        {/* 댓글 리스트 영역 */}
        <div className='listWrap'>
          {replyList.map((item, index) => {
            const goProfile = () =>{ history.push(`/profile/${item?.tail_mem_no || item?.writerMemNo}`) };
            return <ProfileReplyComponent key={item?.replyIdx || item?.tail_no} item={item} profile={profile} isMyProfile={isMyProfile} type={type} dateKey={'writeDt'}
                                          replyDelete={replyDelete} replyEditFormActive={replyEditFormActive}
                                          blurBlock={blurBlock} goProfile={goProfile} adminChecker={adminChecker}
                                          openBlockReportPop={openBlockReportPop}
            />
          })}
        </div>
        <div className='bottomWrite'>
          <div ref={replyRef} className={`trickTextarea ${text.length > 0 && 'isText'}`} contentEditable="true"
               style={text.length === 0 ? {height:'20px'}: {}}
               onKeyUp={(e) => setText(e.target?.innerText)}
          />

          {/*댓글에서 수정 버튼을 눌렀을 때,  inputMode : false => true*/}
          <button ref={replyButtonRef} onClick={(e) => {
            inputMode.action === 'edit' ? replyEdit(inputMode.replyIdx, text) : replyWrite();
          }}>
            {inputMode.action === 'add' ? '등록' : '수정'}
          </button>

        </div>
      </section>

      {/* 프로필 사진 확대 */}
      {showSlide && <ShowSwiper imageList={imgList} popClose={setShowSlide} />}

      {/* 차단 / 신고하기 */}
      {popup.slidePopup &&
      <PopSlide>
        <BlockReport profileData={blockReportInfo} closePopupAction={closeBlockReportPop} />
      </PopSlide>
      }
    </div>
  )
}

/**
 * 프로필 상세 관련 주소이동 공통처리
 * @Param:
 * history : useHistory()
 * action : detail, write, modify
 * type : feed, fanBaord
 * index : 글번호
 * targetMemNo : 글주인 memNo
 * */
export const goProfileDetailPage = ({history, action = 'detail', type = 'feed',
                                      index, memNo, fromMemNo}) => {
  if(!history) return;
  if (type !== 'feed' && type !== 'fanBoard' && type !== 'notice') return;

  if (action === 'detail') {                                            //상세 memNo : 프로필 주인의 memNo
    history.push({
      pathname: `/profileDetail/${memNo}/${type}/${index}`,
      state: { fromMemNo }
    });
  } else if (action === 'write') {                                      // 작성
    if(type=='feed') {                                                  // 작성 memNo : 프로필 주인의 memNo
      history.push(`/profileWrite/${memNo}/${type}/write`);
    } else if (type ==='fanBoard') {                                    // 작성 memNo : 프로필 주인의 memNo
      //history.push(`/profileWrite/${memNo}/${type}/write`);
    } else if (type === "notice") {
      history.push(`/profileWrite/${memNo}/${type}/write`);
    }
  } else if (action === 'modify') {                                     // 수정 memNo : 프로필 주인의 memNo
    history.push(`/profileWrite/${memNo}/${type}/modify/${index}`);
  }
};

export default ProfileDetail
