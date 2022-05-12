import React, {useEffect, useState, useContext, useRef} from 'react'
import {Redirect, useHistory, useParams} from 'react-router-dom'
import Swiper from 'react-id-swiper'
import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import CheckList from '../../components/CheckList'
// contents
// css
import './profileWrite.scss'
import DalbitCropper from "components/ui/dalbit_cropper";
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import {setProfileTabData} from "redux/actions/profile";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const ProfileWrite = () => {
  const history = useHistory();
  const profileTab = useSelector((state) => state.profileTab);
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const fetching = useRef(false);

  const {profile} = globalState;
  // type : feed, fanBoard / action : create, update / index 글번호
  const {memNo, type, action, index} = useParams();
  //수정 : index 필수
  if (action === 'modify' && !index) {
    <Redirect to={{pathname: '/mypage'}}/>
  }
  const isMyProfile = memNo === profile.memNo;
  const swiperParams = {
    slidesPerView: 'auto',
  }

  const inputRef = useRef(null);
  const photoListSwiperRef = useRef(null);

  const [eventObj, setEventObj] = useState(null);
  const [image, setImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);

  //이미지 팝업 슬라이더
  const [showSlide, setShowSlide] = useState({show: false, viewIndex: 0});
  const [formState, setFormState] = useState({
    title: '',
    contents: '',
    others: type==='notice'? 0: 1,  //topFix 고정여부 [0:고정x, 1: 고정o] / viewOn 비밀글 여부 (등록만 가능, 수정불가 ) [0: 비밀글o, 1: 비밀글x]
    photoInfoList: []
  });
  const globalPhotoInfoListRef = useRef([]); // formState.photoInfoList 값 갱신용

  const tabResetBlock = () => {
    dispatch(setProfileTabData({...profileTab, isRefresh: true, isReset: false}));
  };

  const validChecker = () => {
    let confirm = true;
    let message = '';

    if(formState?.contents?.length === 0){
      message = '내용을 입력해주세요.';
      confirm = false;
    }
    //피드 1000자 이하, 팬보드 100자 이하
    if ((type==='feed' && formState?.contents?.length > 1000) ||
        (type==='notice' && formState?.contents?.length > 1000)) {
      message = '내용을 1,000자 이하로 입력해주세요.';
      confirm = false;
    }

    if(!confirm)
      dispatch(setGlobalCtxMessage({type:'toast',msg: message}));

    return confirm;
  };

  const fetchingInit = () => {
    fetching.current = false;
  };

  //등록 (상단 고정 : 방송방에서 사용중, 추후 작업 ! topFix:0 )
  const contentsAdd = async () => {
    if(fetching.current || !validChecker()) return;
    const {title, contents, others, photoInfoList} = formState;

    // 중복 호출 방지
    fetching.current = true;
    if (type === 'notice') {
      const res = await Api.mypage_notice_upload({
        reqBody: true,
        data: {
          title,
          contents,
          imgName: photoInfoList.length !== 0 ? photoInfoList[0].img_name : "",
          topFix: others,
          photoInfoList,// [{img_name: '/room_0/21374121600/20220207163549744349.png'}]
        }
      });

      if (!res) {
        fetchingInit();
        return;
      }
      const {data, message, result} = res;
      dispatch(setGlobalCtxMessage({type: 'toast', msg: message}));

      if (result === 'success') {
        history.goBack();
      } else {
        fetchingInit();
      }

    } else if (type === "feed") {
      const res = await Api.myPageFeedIns({
        reqBody: true,
        data: {
          memNo: memNo,
          feedContents: contents,
          photoInfoList
        }
      });

      if(!res){
        fetchingInit();
        return;
      }
      dispatch(setGlobalCtxMessage({type: 'toast', msg: res.message}));
      if (res.result === "success") {
        history.goBack();
      } else {
        fetchingInit();
      }

    } else {
      fetchingInit();
    }
  };

  //수정
  const contentsEdit = async () => {
    if(fetching.current || !validChecker()) return;
    const {title, contents, others, photoInfoList} = formState;

    // 중복 호출 방지
    fetching.current = true;
    if (type === 'notice') {
      const res = await Api.mypage_notice_edit({
        reqBody: true,
        data: {
          noticeNo: index,
          noticeTitle: title,
          noticeContents: contents,
          imgName: photoInfoList.length !== 0 ? photoInfoList[0].img_name : "",
          noticeTopFix: others,
          photoInfoList,// [{img_name: '/room_0/21374121600/20220207163549744349.png'}]
          chrgrName: profile?.nickName,
        }
      });
      if(!res){
        fetchingInit();
        return;
      }
      const {data, result, message} = res;
      dispatch(setGlobalCtxMessage({type:'toast',msg: message}));
      if (result === 'success') {
        history.goBack();
      } else {
        fetchingInit();
      }
    } else if (type === 'fanBoard') {
      //팬보드 수정에서는 비밀글 여부를 수정할 수 없음!
      const res = await Api.mypage_board_edit({
        data: {
          memNo,
          replyIdx: index,
          contents: contents,
          delChrgrname: profile?.nickName
        }
      });
      if(!res) {
        fetchingInit();
        return;
      }
      const {data, result, message} = res;
      if (result === 'success') {
        dispatch(setGlobalCtxMessage({type:'toast',msg: '팬보드를 수정했습니다.'}));
        history.goBack();
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',msg: '팬보드 수정에 실패했습니다.\\\\n잠시 후 다시 시도해주세요.'}));
        fetchingInit();
      }
    } else if (type === 'feed') {
      const res = await Api.myPageFeedUpd({
        reqBody: true,
        data: {
          feedNo: index,
          memNo: memNo,
          feedContents: contents,
          photoInfoList,
          delChrgrName: profile?.nickName
        }
      });
      if(!res) {
        fetchingInit();
        return;
      }
      const {data, result, message} = res;

      if(result === 'success') {
        dispatch(setGlobalCtxMessage({type:'toast',msg: message}));
        history.goBack();
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',msg: "피드 수정에 실패했습니다.\\\\n잠시 후 다시 시도해주세요."}));
        fetchingInit();
      }
    } else {
      fetchingInit();
    }
  }

  //피드 사진 업로드
  const noticePhotoUpload = async () => {
    const {result, data, message} = await Api.image_upload({
      data: {
        dataURL: image.content,
        uploadType: 'room'
      }
    });
    if (result === 'success') {
      if (inputRef.current) {
        inputRef.current.value = ''
      }

      //사진 리스트에 추가 (globalPhotoInfoListRef.current = formState.photoInfoList)
      setFormState({...formState, photoInfoList: globalPhotoInfoListRef.current.concat({img_name: data?.path, ...data})});
      setImage(null);

    } else {
      dispatch(setGlobalCtxMessage({type:'alert',msg: '사진 업로드를 실패하였습니다.'}));
    }
  };

  useEffect(() => {
    globalPhotoInfoListRef.current = formState?.photoInfoList;
  },[formState?.photoInfoList]);

  //크로퍼 완료시 실행 Effect -> 결과물 포토섭에 1장만 업로드
  useEffect(() => {
    if (image) {
      if (image.status === false) {
        dispatch(setGlobalCtxMessage({
          status: true,
          type: 'alert',
          content: image.content,
          callback: () => {
          }
        }))
      } else {
        noticePhotoUpload();
      }
    }
  }, [image]);

  //상세조회 (수정만)
  const getDetailData = () => {
    if (type === 'notice') {
      Api.mypage_notice_detail_sel({noticeNo: index, memNo})
        .then((res) => {
          const {data, result, message} = res;
          if (result === 'success') {
            const {title, contents, photoInfoList, topFix} = data;
            let newPhotoInfoList = [];
            //사진리스트
            photoInfoList.map((data, index) => {
              newPhotoInfoList.push(Object.assign({img_name: data?.img_name}, {...data?.imgObj}));
            });
            setFormState({title, contents, photoInfoList: newPhotoInfoList, others: topFix});
          } else {
            history.goBack();
          }
        });
    } else if (type === 'fanBoard') { //피드로 수정
      Api.mypage_fanboard_detail({
        memNo, fanBoardNo: index
      }).then((res) => {
        const {data, result, message} = res;
        const {contents, viewOn} = data;
        if (result === 'success') {
          setFormState({contents, others: viewOn, title: 'default', photoInfoList: []});
        } else {
          history.goBack();
        }
      })
    } else if (type === 'feed') {
      Api.myPageFeedDetailSel({
        feedNo: index,
        memNo: memNo,
        viewMemNo: profile.memNo
      }).then((res) => {
        const {data, result, message} = res;
        let newPhotoInfoList = [];
        if(result === "success") {
          data.photoInfoList.map((data, index) => {
            newPhotoInfoList.push(Object.assign({img_name: data?.img_name}, {...data?.imgObj}));
          });
          setFormState({...formState, contents: data.feed_conts, photoInfoList: newPhotoInfoList})
        } else {
          history.goBack();
        }
      });
    }
  };

  const deleteThumbnailImageList = (list, _index) => {
    const result = list.filter((data, index) => index !== _index)

    setFormState({...formState, photoInfoList: result})
  };

  useEffect(() => {
    // 프로필 탭 유지 관련
    tabResetBlock();
    action === 'modify' && getDetailData();
  }, []);

  return (
    <div id="profileWrite">
      <Header title={`${type === 'feed' ? '피드' : type === 'fanBoard' ? '팬보드' : type === 'notice' && '방송공지'} ${action === 'write' ? '쓰기' : '수정'}`} type={'back'}/>
      <section className='writeWrap'>
        <textarea maxLength={1000} placeholder='작성하고자 하는 글의 내용을 입력해주세요.'
          defaultValue={formState?.contents || ''}
          onChange={(e) => {
            setFormState({...formState, contents: e.target.value});
          }}
        />
        <div className="bottomGroup">
          {/*비밀글 viewOn : [0 : 비밀글, 1 : 기본]*/}
          {type === 'notice' ?
            <CheckList text="상단고정" checkStatus={formState.others===1}
                       onClick={()=>{setFormState({...formState, others:formState.others === 1? 0: 1})}}/>
            : ( action==='write' && (!isMyProfile || action==='modify') &&
              <CheckList text="비밀글" checkStatus={formState.others===0}
                         onClick={() => {
                           action !== 'modify' &&
                           setFormState({...formState, others: formState.others === 1 ? 0 : 1})
                         }}/>)}
          <div className="textCount">
            <span>{formState?.contents?.length || 0}</span> / 1000
          </div>
        </div>

        {/*파일 등록*/}
        <input ref={inputRef} type="file" className='blind'
               accept="image/jpg, image/jpeg, image/png"
               onChange={(e) => {
                 e.persist();
                 setEventObj(e);
                 setCropOpen(true);
               }}/>
        {/*사진 리스트 스와이퍼*/}
        {type === 'notice' &&
        <div className="insertGroup">
          <div className="title">사진 첨부</div>
          <div className={"swiper-container"}>
            <div className={"swiper-wrapper"}>
              {formState?.photoInfoList[0] ?
                <label className={"swiper-slide"} onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}>
                  <div className="insertPicture"
                       onClick={() => setShowSlide({show: true, viewIndex: 0})}>
                    <img src={formState?.photoInfoList[0]?.thumb60x60 || formState?.photoInfoList[0]?.thumb292x292} alt=""/>
                  </div>
                  <button className="cancelBtn"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteThumbnailImageList([formState?.photoInfoList[0]], 0)
                          }}/>
                </label>
                :
                <label className={"swiper-slide"}
                       onClick={(e) => {
                         inputRef?.current?.click();
                       }}>
                  <button className='insertBtn'>+</button>
                </label>
              }
            </div>
          </div>
        </div>
        }
        {type === "feed" &&
        <div className="insertGroup">
          <div className="title">사진 첨부<span>(최대 10장)</span></div>
          <Swiper {...swiperParams} ref={photoListSwiperRef}>
            {formState?.photoInfoList.map((data, index) =>
              <label key={index} onClick={(e) => e.preventDefault()}>
                <div className="insertPicture"
                     onClick={() => setShowSlide({show: true, viewIndex: index})}>
                  <img src={data?.thumb60x60 || data?.thumb292x292} alt=""/>
                </div>
                <button className="cancelBtn" onClick={(e) => {e.stopPropagation();deleteThumbnailImageList(formState?.photoInfoList, index)}}/>
              </label>)
            }
            {Array(10 - formState?.photoInfoList.length).fill({}).map((v, i) =>
              <label key={i} onClick={() => inputRef?.current?.click()}>
                <button className='insertBtn'>+</button>
              </label>)}
          </Swiper>
        </div>
        }
        <div className="insertButton">
          <SubmitBtn text={action==='write'?'등록':'수정'} onClick={action==='write'? contentsAdd: contentsEdit} />
        </div>
      </section>

      {cropOpen && eventObj !== null && (
        <DalbitCropper
          imgInfo={eventObj}
          onClose={() => {
            setCropOpen(false)
            if (inputRef.current) {
              inputRef.current.value = ''
            }
          }}
          onCrop={(value) => setImage(value)}
        />
      )}

      {/* 프로필 사진 확대 */}
      {showSlide?.show &&
      <ShowSwiper imageList={formState?.photoInfoList}
                  popClose={() => setShowSlide({show: false, viewIndex: 0})}
                  imageKeyName={'url'}
                  imageParam={'?500x500'}
                  initialSlide={showSlide?.viewIndex || 0}
      />}

    </div>
  )
}

export default ProfileWrite;
