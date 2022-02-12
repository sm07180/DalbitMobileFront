import React, {useEffect, useState, useContext, useRef} from 'react'
import {Redirect, useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'
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

const ProfileWrite = () => {
  const history = useHistory();
  // type : feed, fanBoard / action : create, update / index 글번호
  const {memNo, type, action, index} = useParams();

  //context
  const context = useContext(Context);
  const {token, profile} = context;

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
  const imageUploading = useRef(false);

  const [item, setItem] = useState(null);
  const [eventObj, setEventObj] = useState(null);
  const [image, setImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [activeState, setActiveState] = useState(false);//등록 버튼 활성화

  //이미지 팝업 슬라이더
  const [showSlide, setShowSlide] = useState({show: false, viewIndex: 0});
  const [imgList, setImgList] = useState([]);

  const [formState, setFormState] = useState({
    title: '',
    contents: '',
    others: 0,  //topFix 고정여부 [0, 1] / viewOn 비밀글 여부( 등록만 가능, 수정불가 ) [0, 1]
    photoInfoList: []
  });


  //등록
  const contentsAdd = async () => {
    const {title, contents, others, photoInfoList} = formState;
    if (type === 'feed') {
      console.log("feed Add", title, contents)
      const {data, message, result } = await Api.mypage_notice_upload({
        reqBody: true,
        data: {
          title,
          contents,
          topFix: others,
          photoInfoList,// [{img_name: '/room_0/21374121600/20220207163549744349.png'}]
        }
      });
      context.action.toast({msg: message});
      if (result === 'success') {
        history.goBack();
      }
    } else if (type === 'fanBoard') {
      const {data, result, message} = await Api.member_fanboard_add({
        data: {
          memNo,
          depth: 1,
          contents,
          viewOn: others
        }
      });
      context.action.toast({msg: message});
      if (result === 'success') {
        history.goBack();
      }
    }
  };

  //수정
  const contentsEdit = async () => {
    const {title, contents, others, photoInfoList} = formState;

    if (type === 'feed') {
      const {data, result, message} = await Api.mypage_notice_edit({
        reqBody: true,
        data: {
          title,
          contents,
          topFix: others,
          photoInfoList,// [{img_name: '/room_0/21374121600/20220207163549744349.png'}]
          noticeIdx: index,
          chrgrName: profile?.nickName,
        }
      });
      context.action.toast({msg: message});
      if (result === 'success') {
        history.goBack();
      }

    } else if (type === 'fanBoard') {
      const {data, result, message} = await Api.mypage_board_edit({
        data: {
          memNo,
          replyIdx: index,
          contents: contents
        }
      });
      context.action.toast({msg: message});
      if (result === 'success') {
        history.goBack();
      }
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

      //사진 리스트에 추가
      setFormState({...formState, photoInfoList: formState.photoInfoList.concat({img_name: data?.path, ...data})});
      setImage(null);

      if (photoListSwiperRef.current?.swiper) {
        photoListSwiperRef.current?.swiper?.update();
        photoListSwiperRef.current?.swiper?.slideTo(formState.photoInfoList?.length || 0);
      }
    } else {
      context.action.toast({msg: message});
    }
  };

  //크로퍼 완료시 실행 Effect -> 결과물 포토섭에 1장만 업로드
  useEffect(() => {
    if (image) {
      if (image.status === false) {
        context.action.alert({
          status: true,
          type: 'alert',
          content: image.content,
          callback: () => {
          }
        })
      } else {
        noticePhotoUpload();
      }
    }
  }, [image]);

  //상세조회 (수정만)
  const getDetailData = () => {
    if (type === 'feed') {
      Api.mypage_notice_detail_sel({feedNo: index, memNo})
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
    } else if (type === 'fanBoard') {
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
    }
  };

  const deleteThumbnailImageList = (list, _index) => {
    const result = list.filter((data, index) => index !== _index)

    setFormState({...formState, photoInfoList: result})
  };
  useEffect(() => {
    action === 'modify' && getDetailData();
  }, []);

  return (
    <div id="profileWrite">
      <Header title={`${type === 'feed' ? '피드' : '팬보드'} ${action === 'write' ? '쓰기' : '수정'}`} type={'back'}/>
      <span>{`${isMyProfile}`}</span>
      <section className='writeWrap'>
        <textarea maxLength={1000} placeholder='작성하고자 하는 글의 내용을 입력해주세요.'
                  defaultValue={formState?.contents || ''}
                  onChange={(e) => {
                    setFormState({...formState, contents: e.target.value});
                  }}
        />
        <div className="bottomGroup">
          {type === 'feed' ?
            <CheckList text="상단고정" checkStatus={formState.others===1}
                       onClick={()=>{setFormState({...formState, others:formState.others === 1? 0: 1})}}/>
            : (!isMyProfile && <CheckList text="비밀글"/>)}
          <div className="textCount">
            <span>{formState?.contents?.length || 0}</span> / 1000
          </div>
        </div>

        {/*파일 등록*/}
        <input ref={inputRef} type="file" className='blind'
               onChange={(e) => {
                 e.persist();
                 setEventObj(e);
                 setCropOpen(true);
               }}/>
        {/*사진 리스트 스와이퍼*/}
        {type === 'feed' &&
        <div className="insertGroup">
          <div className="title">사진 첨부<span>(최대 10장)</span></div>
          <Swiper {...swiperParams} ref={photoListSwiperRef}>
            {formState?.photoInfoList.map((data, index) =>
              <label key={index} onClick={(e) => e.preventDefault()}>
                <div className="insertPicture"
                     onClick={() => setShowSlide({show: true, viewIndex: index})}>
                  <img src={data?.thumb60x60 || data?.thumb50x50} alt=""/>
                </div>
                <button className="cancelBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteThumbnailImageList(formState?.photoInfoList, index)
                        }}/>
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
      />}

    </div>
  )
}

export default ProfileWrite
