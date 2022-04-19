import React, {useEffect, useState, useMemo, useContext, useCallback, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// global components
import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/InputItems'
import DalbitCropper from "components/ui/dalbit_cropper";
import ShowSwiper from "components/ui/showSwiper/ShowSwiper";
import PopSlide from "components/ui/popSlide/PopSlide";
// components
import TopSwiper from '../../components/topSwiper'
import PhotoChange from '../../components/popSlide/PhotoChange'
// contents

import './profileEdit.scss'
import PasswordChange from "pages/password";
import {authReq} from "pages/self_auth";
// redux
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupClose, setCommonPopupOpenData} from "redux/actions/common";
import {isAndroid} from "context/hybrid";

const ProfileEdit = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context

  const swiperParams = {
    slidesPerView: 'auto',
  }

  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);

  //이미지 크로퍼
  const inputRef = useRef(null);
  const [eventObj, setEventObj] = useState(null);
  const [image, setImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);

  //이미지 팝업
  const [showSlide, setShowSlide] = useState({visible: false, imgList:[], initialSlide : 0});

  //상단 스와이퍼 객체 가져오기 (TowSwiper)
  const topSwiperRef = useRef(null);

  //프로필 정보
  const initProfileInfo = useRef(null);
  const nickNameRef = useRef(null);
  const focusClearRef = useRef(null);
  const [profileInfo, setProfileInfo] = useState({
    birth: null, nickNm: null, gender: null, profImg: null, profMsg: null, memId: null, profImgList: []
  })

  //성별 선택 여부 (true: 선택함, false: 성별선택안함)
  const [hasGender, setHasGender] = useState(false)

  //비밀번호 페이지(컴포넌트) 표시 여부
  const [passwordPageView, setPasswordPageView] = useState(false);

  // 본인인증 여부
  const [authState, setAuthState] = useState(false);
  const [phone, setPhone] = useState('');

  //profile state 갱신시 state 갱신
  const dispatchProfileInfo = useCallback(() => {
    if (profile !== null) {
      const {birth, nickNm, gender, profImg, profMsg, memId, profImgList} = profile

      initProfileInfo.current = {nickNm, profImg, profMsg, gender};
      setProfileInfo({gender, birth, nickNm, profImg, profMsg, memId, profImgList});
      setHasGender(gender !== 'n');

    }
  }, [profile])

  const showSlideClear = useCallback(() => {
    setShowSlide({visible: false, imgList: [], initialSlide: 0});
  },[]);

  const getMyInfo = async () => {
    const {result, data, message} = await Api.profile({
      params: {memNo: context.token.memNo}
    })
    showSlideClear();
    if (result === 'success') {
      context.action.updateProfile(data);
    }
  };

  const openMoreList = () => {
    dispatch(setCommonPopupOpenData({...popup, commonPopup: true}))
  };

  const closeMoreList = () => {
    dispatch(setCommonPopupClose());
  };

  //대표 이미지 지정
  const readerImageEdit = async (idx) => {
    const {result, data, message} = await Api.postSetLeaderProfileImg({idx});

    if (result === 'success') {
      showSlideClear();
      getMyInfo();
      context.action.toast({msg: '선택 이미지로 대표 이미지가 변경되었습니다.'});
    } else {
      context.action.toast({msg: message});
    }
  }


  //프로필 수정
  const profileEditConfirm = async (_profileInfo, finished = false) => {
    const {gender, nickNm, profMsg, birth, profImg} = _profileInfo? _profileInfo: profileInfo;
    const param = {
      gender :gender || initProfileInfo.current.gender,
      nickNm : nickNm || initProfileInfo.current.nickNm,
      profMsg: profMsg,
      birth: birth || initProfileInfo.current.birth,
      profImg: profImg?.path || initProfileInfo.current.profImg.path,
    }

    const {result, data, message} = await Api.profile_edit({data: param});

    if (result === 'success') {
      context.action.updateProfile({...profile, ...data});
      context.action.alert({
        msg: `저장되었습니다.`,
        callback: finished ? () => history.replace('/myProfile') : () => {}
      });
    } else {
      context.action.alert({title: 'Error', msg: message});
    }
  }

  /* 본인인증 열기 */
  const getAuth = () => {
    authReq({code: '5', formTagRef: context.authRef, context});
  }

  /* 본인인증 여부 */
  const getAuthCheck = async () => {
    const res = await Api.self_auth_check({})
    if (res.result === 'success') {
      setAuthState(true)
      setPhone(res.data.phoneNo)
    } else {
      setAuthState(false)
    }
  }

  useEffect(() => {
    getMyInfo();
    getAuthCheck();
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
        context.action.toast({msg: '이미지가 등록 되었습니다.'});
      } else {
        context.action.toast({msg: message});
      }
    })
  };

  //이미지 삭제 Api
  const deleteProfileImage = (imgIdx) => {
    if (imgIdx !== null) {
      Api.postDeleteProfileImg({idx: imgIdx}).then((res) => {
        const {result, message} = res;
        context.action.toast({msg: message});

        showSlideClear();
        if (result === 'success') {
          getMyInfo(); //프로필 정보 갱신
        } else {
        }
      })
    }
  };

  //프로필 사진 업로드
  const photoUpload = async () => {
    try {
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
        } else {  //기존 이미지가 1장 이상 있으면, 이미지 add Api만 호출, 프로필정보 갱신 API call
          //이미지 추가등록 API - profImgList에 추가
          addProfileImage(data.path);
          setImage(null);
        }

      } else {
        context.action.toast({msg: message});
      }
    } catch(e) { //image upload Error
      context.action.toast({msg: '이미지 업로드 실패'});
      setImage(null);
    };
  };

  //이미지 팝업 띄우기
  const openShowSlide = (data, isList = "y", keyName='profImg', initialSlide= 0) => {
    let list = [];
    data.map((v, idx) => {
      if (v?.profImg) {
        list.push({idx: v.idx, ...v.profImg});
      }
    });
    setShowSlide({visible: true, imgList: list, initialSlide});
  };

  const imageSorting = (imageList = []) => {
    let list = [];
    imageList.map((v) => {
      if(v?.profImg?.path)
        list.push(v?.profImg?.path);
    });
    if(list.length> 1) {
      Api.profileImageUpdate({imageList: list})
        .then((res) => {
          const {result, message, data} = res;
          if (result === 'success') {
            closeMoreList();
            getMyInfo();
          } else {
            context.action.toast({msg: '잠시후에 다시 시도해주세요.'});
          }
        });
    } else {
      closeMoreList();
    }
  }

  //크로퍼 완료시 실행 Effect -> 결과물 포토섭에 1장만 업로드
  useEffect(() => {
    if (image) {
      if (image.status === false) {
        context.action.alert({
          msg: '지원하지 않는 파일입니다.'
        })
      } else {
        photoUpload();// 사진 업로드
      }
    }
  }, [image]);

  const emptySwiperItems = useMemo(() => Array(10 - (profileInfo?.profImgList?.length || 0)).fill(''), [profileInfo]);

  /* 상단 스와이퍼에서 사용하는 profileData (대표사진 제외한 프로필 이미지만 넣기) */
  const profileDataNoReader = useMemo(() => {
    if (profile?.profImgList?.length > 1) {
      return {...profile, profImgList: profile?.profImgList.concat([]).filter((data, index)=> !data.isLeader)};
    } else {
      return profile;
    }
  },[profile]);

  return (
      <>{
          !passwordPageView ?
          <div id="profileEdit">
            <Header title={'프로필 수정'} type={'back'} >
              <button className='saveBtn'
                      onClick={() => profileEditConfirm(null, true)}>저장
              </button>
            </Header>
            <section className='profileTopSwiper'>
              {profileInfo?.profImgList?.length > 0 ?
                <TopSwiper data={profileDataNoReader}
                           disabledBadge={true}
                           openShowSlide={openShowSlide}
                />
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
                     onClick={() => {
                       profileInfo?.profImgList.length > 0?
                         openShowSlide(profileInfo?.profImgList,  'y', 'profImg', 0)
                         : inputRef.current.click();
                     }}>
                  <img src={profile && profile.profImg && profile.profImg.thumb292x292} alt=""/>
                </div>
              </div>

              <div className="coverPhoto">
                <div className="title">프로필사진<small>(최대 10장)</small>
                  {profileInfo?.profImgList?.length > 1 &&
                    <button onClick={openMoreList}>순서변경</button>
                  }
                </div>
                <Swiper {...swiperParams}>
                  {profileInfo?.profImgList?.map((data, index) =>{
                    return <div key={data?.idx}>
                      <label onClick={(e)=>e.preventDefault()}>
                        <img src={data?.profImg?.thumb292x292} alt=""
                             onClick={() => {
                               openShowSlide(profileInfo?.profImgList, 'y', 'profImg', index)
                             }}/>
                        <button className="cancelBtn"
                                onClick={() => {
                                  context.action.confirm({
                                    msg: '정말로 삭제하시겠습니까?',
                                    callback: ()=> deleteProfileImage(data?.idx)
                                  })
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
              <InputItems title="닉네임">
                <input type="text" maxLength="15" defaultValue={profile.nickNm} ref={nickNameRef}
                       onClick={(e) => {
                         e.stopPropagation();
                         if(!focusClearRef.current && e.target.value === '') {  //입력 폼에 한번 포커싱 되면 한번더 클릭해도 내용 초기화 안되게하기.
                           focusClearRef.current = true;
                           e.target.value = profile?.nickNm || '';
                         }
                       }}
                       onBlur={() => {
                         if(focusClearRef.current === true){
                           focusClearRef.current = false;
                         }
                       }}
                       onChange={(e) => setProfileInfo({...profileInfo, nickNm: e.target.value})}/>
                <button className='inputDel'
                        onClick={() => {
                          //닉네임 초기화
                          if (nickNameRef.current) nickNameRef.current.value = '';
                          setProfileInfo({...profileInfo, nickNm: ''})

                          if(!focusClearRef.current) {  // 닉네임 초기화 방지
                            focusClearRef.current = true;
                          }
                          nickNameRef.current.focus();
                        }}/>
              </InputItems>
              <InputItems title="휴대폰번호" button="인증하기" buttonClass={"point"} onClick={getAuth}>
                <input type="text" placeholder={`${authState ? phone : '휴대폰 인증을 해주세요'}`} disabled />
              </InputItems>
              <InputItems title="비밀번호" button="변경하기" onClick={() => setPasswordPageView(true)}>
                <input type="password" name="password" maxLength="20" defaultValue={"@@@@@@@@@@@@@@@@@"} disabled />
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
                          value={profileInfo?.profMsg || ''}
                          onChange={(e) => {
                            if(e.target.value?.length> 100) {
                              e.target.value = profileInfo?.profMsg;
                            } else {
                              setProfileInfo({...profileInfo, profMsg: e.target.value});
                            }
                          }}/>
                <div className="textCount">{profileInfo?.profMsg?.length || 0}/100</div>
              </InputItems>
            </section>

            <input ref={inputRef} type="file" className='blind'
                   accept="image/jpg, image/jpeg, image/png"
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
            <ShowSwiper imageList={showSlide?.imgList || []} popClose={showSlideClear} showTopOptionSection={true}
                        readerButtonAction={readerImageEdit}
                        deleteButtonAction={(idx) =>
                          context.action.confirm({msg: '정말로 삭제하시겠습니까?', callback: () => deleteProfileImage(idx)})}
                        swiperParam={{initialSlide: showSlide?.initialSlide}}
            />
            }

            {popup.commonPopup &&
            <PopSlide title="사진 순서 변경">
              <PhotoChange list={profileInfo?.profImgList}
                           confirm={imageSorting}/>
            </PopSlide>
            }
          </div>
            :
        <PasswordChange backEvent={() => setPasswordPageView(false)}/>
      }
      </>
  )
}

export default ProfileEdit
