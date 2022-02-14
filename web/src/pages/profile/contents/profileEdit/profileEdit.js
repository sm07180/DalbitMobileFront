import React, {useEffect, useState, useContext, useCallback, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// global components
import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/InputItems'
// components
import TopSwiper from '../../components/TopSwiper'
// contents

import './profileEdit.scss'
import PasswordChange from "pages/password";
import DalbitCropper from "components/ui/dalbit_cropper";

const ProfileEdit = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context

  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }

  //이미지 크로퍼
  const inputRef = useRef(null);
  const [eventObj, setEventObj] = useState(null);
  const [image, setImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);

  //프로필 정보
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
      // initProfileInfo = {nickNm, profImg: profImg.path, profMsg, gender}
      const sortImgList = profImgList.concat([]).sort((a, b)=> a.idx - b.idx);
      setProfileInfo({gender, birth, nickNm, profImg, profMsg, memId, profImgList: sortImgList})
      setCurrentAvatar(profImg.path)

      setHasGender(gender !== 'n')
    }
  }, [profile])


  const getMyInfo = async () => {
    const {result, data, message} = await Api.profile({
      params: {memNo: context.token.memNo}
    })

    if (result === 'success') {
      context.action.updateProfile(data);
    }
  };

  //프로필 수정
  const profileEditConfirm = async (_profileInfo) => {
    const {gender, nickNm, profMsg, birth} = _profileInfo? _profileInfo: profileInfo;
    const param = {
      gender,
      nickNm,
      profMsg,
      birth,
      profImg: currentAvatar
    }

    const {result, data, message} = await Api.profile_edit({data: param});

    if (result === 'success') {
      globalCtx.action.updateProfile({...profile, ...data});
      globalCtx.action.alert({
        msg: `저장되었습니다.`,
        title: '',
        callback: () => history.goBack()
      });
    } else {
      globalCtx.action.alert({title: 'Error', msg: message});
    }
  }

  useEffect(() => {
    getMyInfo();
  }, []);

  useEffect(() => {
    dispatchProfileInfo();
  }, [profile]);

  const addProfileImg = useCallback((profImg) => {
    Api.postAddProfileImg({profImg}).then((res) => {
      const {result, message} = res
      if (result === 'success') {
        getMyInfo(); //프로필 정보 갱신
        context.action.toast({msg: '이미지 등록 되었습니다.'});
      } else {
        context.action.toast({msg: message});
      }
    })
  }, [])

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

      if(profileInfo?.profImgList.length === 0) { // 프로필 편집 처리함
        setImage(null);
        setCurrentAvatar(data.path);
        profileEditConfirm({...profileInfo, profImg: data.path});
      } else {
        //사진 리스트에 추가
        setImage(null);
        // setProfileInfo((prevState) => {
        //   return {...profileInfo, profImgList: prevState.concat({img_name: data?.path, ...data})};
        // });
        //이미지 추가등록 API - profImgList에 추가
        addProfileImg(data.path);
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
        photoUpload();
      }
    }
  }, [image]);
  return (
      <>{
          !passwordPageView ?
          <div id="profileEdit">
            <Header title={'프로필 수정'} type={'back'}>
              <button className='saveBtn'>저장</button>
            </Header>
            <section className='topSwiper'>
              <div className="nonePhoto">
                <i><img src="https://image.dalbitlive.com/mypage/dalla/coverNone.png" alt=""/></i>
              </div>
            </section>
            <section className="insertPhoto">
              <div className="insertBtn">
                <div className="photo">
                  <img src={profile && profile.profImg && profile.profImg.thumb100x100} alt=""/>
                  <button><img src="https://image.dalbitlive.com/mypage/dalla/addPhotoBtn.png" alt=""/></button>
                </div>
              </div>

              <div className="coverPhoto">
                <div className="title">커버사진 <small>(최대 10장)</small></div>
                <Swiper {...swiperParams}>
                  {profileInfo?.profImgList?.length && profileInfo?.profImgList.map((data, index) =>
                    <div key={data?.profImg.idx}>
                      <label>
                        <img src={data?.profImg?.thumb100x100} alt=""/>
                        <button className="cancelBtn"></button>
                      </label>
                    </div>)
                  }
                  {Array(10 - profileInfo?.profImgList.length ).fill({}).map((v, i) =>
                    <div key={i} onClick={() => inputRef.current.click()}>
                      <div className='empty'>+</div>
                    </div>)}
                </Swiper>
              </div>
            </section>
            <section className="editInfo">
              <InputItems title={'닉네임'}>
                <input type="text" maxLength="15" placeholder={profile.nickNm}/>
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
                      <li className={`${profileInfo?.gender === 'm' ? 'active' : ''}`}>남성</li>
                      <li className={`${profileInfo?.gender === 'f' ? 'active' : ''}`}>여성</li>
                    </>
                  }
                </ul>
              </div>
              <InputItems title={'프로필 메시지'} type={'textarea'}>
                <textarea rows="4" maxLength="100" placeholder='입력해주세요.'
                          onChange={(e) => setProfileInfo({...profileInfo, profMsg: e.target.value})}/>
                <div className="textCount">0/100</div>
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
          </div>
            :
        <PasswordChange backEvent={() => setPasswordPageView(false)}/>
      }</>
  )
}

export default ProfileEdit
