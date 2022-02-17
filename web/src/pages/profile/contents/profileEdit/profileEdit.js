import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// global components
import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/InputItems'
// components
import TopSwiper from '../../components/topSwiper'
// contents
import './profileEdit.scss'
import PasswordChange from "pages/password";
import DalbitCropper from "components/ui/dalbit_cropper";
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdateProfile} from "redux/actions/globalCtx";

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()
  const {token, profile} = globalState

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }

  //이미지 크로퍼
  const inputRef = useRef(null);
  const [eventObj, setEventObj] = useState(null);
  const [image, setImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);

  //이미지 팝업
  const [showSlide, setShowSlide] = useState({visible: false, imgList:[]});

  //프로필 정보
  const initProfileInfo = useRef(null);
  const [profileInfo, setProfileInfo] = useState({
    birth: null, nickNm: null, gender: null, profImg: null, profMsg: null, memId: null, profImgList: []
  })
  //대표 이미지
  const [currentAvatar, setCurrentAvatar] = useState('')

  //성별 선택 여부 (true: 선택함, false: 성별선택안함)
  const [hasGender, setHasGender] = useState(false)

  //비밀번호 페이지(컴포넌트) 표시 여부
  const [passwordPageView, setPasswordPageView] = useState(false);

  //profile state 갱신시 state 갱신
  const dispatchProfileInfo = useCallback(() => {
    if (profile !== null) {
      const {birth, nickNm, gender, profImg, profMsg, memId, profImgList} = profile
      const sortImgList = profImgList.concat([]).sort((a, b)=> a.idx - b.idx);
      initProfileInfo.current = {nickNm, profImg, profMsg, gender};
      setProfileInfo({gender, birth, nickNm, profImg, profMsg, memId, profImgList: sortImgList});
      setCurrentAvatar(profImg);
      setHasGender(gender !== 'n');

    }
  }, [profile])

  const getMyInfo = async () => {
    const {result, data, message} = await Api.profile({
      params: {memNo: globalState.token.memNo}
    })
    setShowSlide({visible: false, imgList: []});
    if (result === 'success') {
      dispatch(setGlobalCtxUpdateProfile(data));
    }
  };

  //대표 이미지 지정
  const readerImageEdit = async (idx) => {
    const {result, data, message} = await Api.postSetLeaderProfileImg({idx});

    if (result === 'success') {
      setShowSlide({visible: false, imgList: []});
      getMyInfo();
      dispatch(setGlobalCtxMessage({type: "toast", msg: '선택 이미지로 대표 이미지가 변경되었습니다.'}));
    } else {
      dispatch(setGlobalCtxMessage({type: "toast", msg: message}));
    }
  }


  //프로필 수정
  const profileEditConfirm = async (_profileInfo, finished = false) => {
    const {gender, nickNm, profMsg, birth, profImg} = _profileInfo? _profileInfo: profileInfo;
    const param = {
      gender :gender || initProfileInfo.current.gender,
      nickNm : nickNm || initProfileInfo.current.nickNm,
      profMsg: profMsg || initProfileInfo.current.profMsg,
      birth: birth || initProfileInfo.current.birth,
      profImg: (_profileInfo? profImg.path : currentAvatar.path) || initProfileInfo.current.profImg.path,
    }

    const {result, data, message} = await Api.profile_edit({data: param});

    if (result === 'success') {
      dispatch(setGlobalCtxUpdateProfile({...profile, ...data}));
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: `저장되었습니다.`,
        callback: finished ? () => history.goBack() : () => {
        }
      }));
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", title: 'Error', msg: message}));
    }
  }

  useEffect(() => {
    getMyInfo();
  }, []);

  useEffect(() => {
    dispatchProfileInfo();
  }, [profile]);

  //이미지 Add Api
  const addProfileImage = (profImg) => {
    Api.postAddProfileImg({profImg}).then((res) => {
      const {result, message} = res
      if (result === 'success') {
        getMyInfo(); //프로필 정보 갱신
        dispatch(setGlobalCtxMessage({type: "toast", msg: '이미지 등록 되었습니다.'}));
      } else {
        dispatch(setGlobalCtxMessage({type: "toast", msg: message}));
      }
    })
  };

  //이미지 삭제 Api
  const deleteProfileImage = (imgIdx) => {
    if (imgIdx !== null) {
      Api.postDeleteProfileImg({idx: imgIdx}).then((res) => {
        const {result, message} = res;
        dispatch(setGlobalCtxMessage({type: "toast", msg: message}));

        setShowSlide({visible: false, imgList: []});
        if (result === 'success') {
          getMyInfo(); //프로필 정보 갱신
        } else {
        }
      })
    }
  };

  //프로필 사진 업로드
  const photoUpload = async () => {
    const {result, data, message} = await Api.image_upload({
      data: {
        dataURL: image.content,
        uploadType: 'profile'
      }
    });

    if (result === 'success') {
      if (inputRef.current) {
        inputRef.current.value = ''
      }

      //등록한 사진 리스트가 한장도 없을경우 사진 업로드후, 프로필 정보 수정처리! ( 기존정책 )
      if (profileInfo?.profImgList.length === 0) { // 프로필 편집 (편집후 return 에서 profile정보 받아서 갱신 처리)
        profileEditConfirm({...profileInfo, profImg: data});
        setImage(null);
        setCurrentAvatar(data);
      } else {  //기존 이미지가 1장 이상 있으면, 이미지 add Api만 호출, 프로필정보 갱신 API call
        //이미지 추가등록 API - profImgList에 추가
        addProfileImage(data.path);
        setImage(null);
      }

    } else {
      dispatch(setGlobalCtxMessage({type: "toast", msg: message}));
    }
  };

  //이미지 팝업 띄우기
  const showImagePopUp = (data = null, type='')=> {
    if(!data) return;

    let resultMap = [];
    if (type === 'profileList') { // 프로필 이미지 리스트, 대표 이미지 눌렀을 때
      data.map((v, idx) => {
        if (v?.profImg) {
          resultMap.push({idx: v.idx, ...v.profImg});
        }
      });
    } else { //배경 이미지 눌렀을때
      resultMap.push({idx: data.idx, ...data.profImg});
    }

    setShowSlide({visible:true, imgList: resultMap });
  };

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
        photoUpload();// 사진 업로드
      }
    }
  }, [image]);

  const emptySwiperItems = useMemo(() => Array(10 - (profileInfo?.profImgList?.length || 0)).fill(''), [profileInfo]);
  return (
      <>{
          !passwordPageView ?
          <div id="profileEdit">
            <Header title={'프로필 수정'} type={'back'}>
              <button className='saveBtn'
                      onClick={() => profileEditConfirm(null, true)}>저장
              </button>
            </Header>
            <section className='topSwiper' onClick={()=> showImagePopUp(profileInfo?.profImgList, 'profileList')}>
              {profileInfo?.profImgList?.length > 0 ?
                <TopSwiper data={profile}/>
                :
                <div className="nonePhoto"
                     onClick={(e) => {
                       e.stopPropagation();
                       inputRef.current.click();
                     }}>
                  <i><img src={"https://image.dalbitlive.com/mypage/dalla/coverNone.png"} alt=""/></i>
                </div>
              }
            </section>
            <section className="insertPhoto">
              <div className="insertBtn">
                <div className="photo"
                     onClick={()=> {
                       profileInfo?.profImgList.length >0 ?
                         showImagePopUp(profileInfo?.profImgList, 'profileList') :
                         inputRef.current.click();
                     }}>
                  <img src={profile && profile.profImg && profile.profImg.thumb100x100} alt=""/>
                  <button><img src="https://image.dalbitlive.com/mypage/dalla/addPhotoBtn.png" alt=""/></button>
                </div>
              </div>

              <div className="coverPhoto">
                <div className="title">커버사진 <small>(최대 10장)</small></div>
                <Swiper {...swiperParams}>
                  {profileInfo?.profImgList?.map((data, index) =>{
                    return <div key={data?.idx}>
                      <label onClick={(e)=>e.preventDefault()}>
                        <img src={data?.profImg?.thumb100x100} alt=""
                             onClick={()=> showImagePopUp(profileInfo?.profImgList, 'profileList')}/>
                        <button className="cancelBtn"
                                onClick={() => {
                                  dispatch(setGlobalCtxMessage({
                                    type: "confirm",
                                    msg: '정말로 삭제하시겠습니까?',
                                    callback: () => deleteProfileImage(data?.idx)
                                  }))
                                }}/>
                      </label>
                    </div>})
                  }
                  {emptySwiperItems.map((v, i) =>{
                    return (<div key={i}
                                 onClick={() => {
                                   inputRef.current.click();
                                 }}>
                      <div className='empty'>+</div>
                    </div>);
                  })}
                </Swiper>
              </div>
            </section>
            <section className="editInfo">
              <InputItems title={'닉네임'}>
                <input type="text" maxLength="15" placeholder={profile.nickNm}
                       onChange={(e) => setProfileInfo({...profileInfo, nickNm: e.target.value})}/>
                <button className='inputDel'></button>
              </InputItems>
              <InputItems title={'UID'}>
                <input type="text" placeholder={profile.memId} disabled/>
              </InputItems>
              <InputItems title={'비밀번호'}>
                <input type="password" name={"password"} maxLength="20" defaultValue={"@@@@@@@@@@@@@@@@@"} placeholder=''
                       onClick={() => setPasswordPageView(true)}/>
                <button className='inputChange' onClick={() => setPasswordPageView(true)}>변경</button>
              </InputItems>
              <div className="inputItems">
                <div className="title">성별</div>
                <ul className="selectMenu">
                  {hasGender ?
                    <li className='active fixGender'>{profileInfo?.gender === 'm' ? '남성' : '여성'}</li>
                    :
                    <>
                      <li className={`${profileInfo?.gender === 'm' ? 'active' : ''}`}
                          onClick={() => setProfileInfo({...profileInfo, gender: 'm'})}>남성</li>
                      <li className={`${profileInfo?.gender === 'f' ? 'active' : ''}`}
                          onClick={() => setProfileInfo({...profileInfo, gender: 'f'})}>여성</li>
                    </>
                  }
                </ul>
              </div>
              <InputItems title={'프로필 메시지'} type={'textarea'}>
                <textarea rows="4" maxLength="100" placeholder='입력해주세요.'
                          defaultValue={profileInfo?.profMsg || ''}
                          onChange={(e) => setProfileInfo({...profileInfo, profMsg: e.target.value}) }/>
                <div className="textCount">{profileInfo?.profMsg?.length || 0}/100</div>
              </InputItems>
            </section>

            <input ref={inputRef} type="file" className='blind'
                   accept="image/jpg, image/jpeg, image/png, image/gif"
                   onChange={(e) => {
                     e.persist();
                     setEventObj(e);
                     setCropOpen(true);
                   }}/>
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

            {showSlide?.visible &&
            <ShowSwiper imageList={showSlide?.imgList || []} popClose={setShowSlide} showTopOptionSection={true}
                        readerButtonAction={readerImageEdit}
                        deleteButtonAction={(idx) =>
                          dispatch(setGlobalCtxMessage({
                            type: "confirm",
                            msg: '정말로 삭제하시겠습니까?',
                            callback: () => deleteProfileImage(idx)
                          }))}
            />
            }
          </div>
            :
        <PasswordChange backEvent={() => setPasswordPageView(false)}/>
      }
      </>
  )
}

export default ProfileEdit
