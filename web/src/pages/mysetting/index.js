import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {convertDateFormat} from 'components/lib/dalbit_moment'
import Layout from 'pages/common/layout'
import Header from 'pages/mypage/component/header'
import ProfileAvatar from './component/profile_avatar'
import ProfileSelfCheck from './component/profile_selfCheck'
import './mysetting.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdateProfile} from "redux/actions/globalCtx";

let initProfileInfo = {}
export default function MySetting() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const {token, profile} = globalState
  const [profileInfo, setProfileInfo] = useState({})
  const [currentAvatar, setCurrentAvatar] = useState('')
  const [hasGender, setHasGender] = useState(false)

  const dispatchProfileInfo = useCallback(() => {
    if (profile !== null) {
      const {birth, nickNm, gender, profImg, profMsg, memId, profImgList} = profile
      initProfileInfo = {nickNm, profImg: profImg.path, profMsg, gender}
      setProfileInfo({gender, birth, nickNm, profImg, profMsg, memId, profImgList})
      setCurrentAvatar(profImg.path)
      setHasGender(gender !== 'n')
    }
  }, [profile])

  const getProfileInfo = () => {
    Api.profile({
      params: {
        memNo: token.memNo
      }
    }).then((res) => {
      const {result, message, data} = res
      if (result === 'success') {
        dispatch(setGlobalCtxUpdateProfile({
          ...profile,
          ...data
        }))
      } else {
        dispatch(setGlobalCtxMessage({type: "alert", title: 'Error', msg: message}))
      }
    })
  }

  const onInputChange = (event) => {
    const {name, value} = event.target
    setProfileInfo({...profileInfo, [name]: value})
  }

  const onClearClick = (event) => {
    const {dataset} = event.currentTarget
    const {name} = dataset
    if (name) {
      setProfileInfo({...profileInfo, [name]: ''})
    }
  }

  const isActive = useMemo(() => {
    return (
      profileInfo.gender !== 'n' &&
      profileInfo.nickNm !== '' &&
      (profileInfo.nickNm !== initProfileInfo.nickNm ||
        profileInfo.gender !== initProfileInfo.gender ||
        profileInfo.profMsg !== initProfileInfo.profMsg)
    )
  }, [profileInfo])

  const updateProfile = useCallback(
    (willGoBack = true) => {
      const {gender, nickNm, profMsg, birth} = profileInfo
      const dataList = {
        gender,
        nickNm,
        profMsg,
        birth,
        profImg: currentAvatar
      }
      Api.profile_edit({data: dataList}).then((res) => {
        const {result, data, message} = res
        if (result === 'success') {
          dispatch(setGlobalCtxUpdateProfile({...profile, ...data}))
          if (willGoBack) {
            dispatch(setGlobalCtxMessage({
              type: "alert",
              msg: `저장되었습니다.`,
              title: '',
              callback: () => {
                history.goBack()
              }
            }))
          } else {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: '이미지 등록 되었습니다.'
            }))
          }
        } else {
          dispatch(setGlobalCtxMessage({type: "alert", title: 'Error', msg: message}))
        }
      })
    },
    [profileInfo, currentAvatar]
  )

  const renderGenderBox = () => {
    if (hasGender) {
      return (
        <div className={`formInputBox genderBox disabled ${profileInfo.gender === 'f' ? 'female' : 'male'}`}>
          <span className="gender">{profileInfo.gender === 'f' ? '여자' : '남자'}</span>
          <img
            src={
              profileInfo.gender === 'f'
                ? 'https://image.dalbitlive.com/svg/female.svg'
                : 'https://image.dalbitlive.com/svg/male.svg'
            }
            alt={profileInfo.gender === 'f' ? '여자' : '남자'}
          />
        </div>
      )
    } else {
      return (
        <div className="formInputBox genderBox">
          <button
            type="button"
            className={`genderBox__btn genderBox__btn--male ${profileInfo.gender === 'm' ? 'active' : ''}`}
            onClick={() => setProfileInfo({...profileInfo, gender: 'm'})}>
            남자
            <img src={'https://image.dalbitlive.com/svg/male.svg'} alt="남자" />
          </button>

          <button
            type="button"
            className={`genderBox__btn genderBox__btn--female ${profileInfo.gender === 'f' ? 'active' : ''}`}
            onClick={() => setProfileInfo({...profileInfo, gender: 'f'})}>
            여자
            <img src={'https://image.dalbitlive.com/svg/female.svg'} alt="여자" />
          </button>
        </div>
      )
    }
  }

  useEffect(() => {
    if (profile === null || profile.birth === '') {
      getProfileInfo()
    }
  }, [])

  useEffect(() => {
    if (profile !== null) {
      dispatchProfileInfo()
    }
  }, [profile])

  useEffect(() => {
    if (currentAvatar !== initProfileInfo.profImg && currentAvatar) {
      updateProfile(false)
    }
  }, [currentAvatar])

  useEffect(() => {
    if (!token.isLogin) {
      history.push('/login')
    }
  }, [token.isLogin])

  return (
    <Layout status="no_gnb">
      <Header title="프로필 수정" />
      <div id="settingPage" className="subContent gray">
        <form
          action="#"
          method="POST"
          onSubmit={(e) => {
            e.preventDefault()
            updateProfile()
          }}>
          <ProfileAvatar setCurrentAvatar={setCurrentAvatar} />
          <div className="profileInfoBox profileForm">
            <ProfileSelfCheck />

            <div className="formInputBox">
              <label className="inputBoxTitle" htmlFor="nick">
                닉네임
              </label>
              <input
                type="text"
                className="writeInput"
                id="nick"
                placeholder="닉네임을 입력해 주세요"
                onChange={onInputChange}
                value={profileInfo?.nickNm ?? ''}
                name="nickNm"
                maxLength={20}
              />
              <button type="button" className="cancelBtn" data-name="nickNm" onClick={onClearClick}>
                <img src="https://image.dalbitlive.com/svg/ico_delete_round.svg" alt="취소 버튼" />
              </button>
            </div>
            <div className="formInputBox disabled">
              <label className="inputBoxTitle" htmlFor="uid">
                UID
              </label>
              <input type="text" defaultValue={profileInfo.memId} id="uid" readOnly />
            </div>
            <div className="formInputBox disabled hasBtn">
              <label className="inputBoxTitle" htmlFor="pass">
                비밀번호
              </label>
              <input type="password" defaultValue="@@@@@@@@@@@@@@@@@" id="pass" readOnly />
              <button
                type="button"
                className="requestBtn"
                onClick={() => {
                  history.push('/password')
                }}>
                비밀번호 변경
              </button>
            </div>
            <div className="inputBoxWrap">
              <div className="formInputBox disabled">
                <label className="inputBoxTitle" htmlFor="birth">
                  생년월일
                </label>
                <input
                  type="text"
                  defaultValue={profileInfo.birth ? convertDateFormat(profileInfo.birth, 'YYYY.MM.DD') : ''}
                  id="birth"
                  readOnly
                />
                <img src="https://image.dalbitlive.com/svg/ico_calendar.svg" className="calendarIcon" alt="calendar" />
              </div>
              <p className="formInputBoxResult">본인인증 정보로 자동 갱신됩니다.</p>
            </div>
            <div className="inputBoxWrap">
              {renderGenderBox()}
              <p className="formInputBoxResult">본인인증 정보로 자동 갱신됩니다.</p>
            </div>

            <div className="profileMessage">
              <label className="title" htmlFor="profileText">
                프로필 메세지
              </label>
              <button type="button" className="cancelBtn" data-name="profMsg" onClick={onClearClick}>
                <img src="https://image.dalbitlive.com/svg/ico_delete_round.svg" alt="취소 버튼" />
              </button>
              <textarea
                className="formInputBox profileText"
                id="profileText"
                maxLength={100}
                placeholder="입력해주세요."
                onChange={onInputChange}
                value={profileInfo?.profMsg ?? ''}
                name="profMsg"
              />
            </div>
            <div className="btnWrap">
              <button type="submit" className={`btn ${isActive ? '' : 'isDisable'}`} disabled={!isActive}>
                저장
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
