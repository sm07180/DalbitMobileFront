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
              msg: `?????????????????????.`,
              title: '',
              callback: () => {
                history.goBack()
              }
            }))
          } else {
            dispatch(setGlobalCtxMessage({
              type: "toast",
              msg: '????????? ?????? ???????????????.'
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
          <span className="gender">{profileInfo.gender === 'f' ? '??????' : '??????'}</span>
          <img
            src={
              profileInfo.gender === 'f'
                ? 'https://image.dalbitlive.com/svg/female.svg'
                : 'https://image.dalbitlive.com/svg/male.svg'
            }
            alt={profileInfo.gender === 'f' ? '??????' : '??????'}
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
            ??????
            <img src={'https://image.dalbitlive.com/svg/male.svg'} alt="??????" />
          </button>

          <button
            type="button"
            className={`genderBox__btn genderBox__btn--female ${profileInfo.gender === 'f' ? 'active' : ''}`}
            onClick={() => setProfileInfo({...profileInfo, gender: 'f'})}>
            ??????
            <img src={'https://image.dalbitlive.com/svg/female.svg'} alt="??????" />
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
      <Header title="????????? ??????" />
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
                ?????????
              </label>
              <input
                type="text"
                className="writeInput"
                id="nick"
                placeholder="???????????? ????????? ?????????"
                onChange={onInputChange}
                value={profileInfo?.nickNm ?? ''}
                name="nickNm"
                maxLength={20}
              />
              <button type="button" className="cancelBtn" data-name="nickNm" onClick={onClearClick}>
                <img src="https://image.dalbitlive.com/svg/ico_delete_round.svg" alt="?????? ??????" />
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
                ????????????
              </label>
              <input type="password" defaultValue="@@@@@@@@@@@@@@@@@" id="pass" readOnly />
              <button
                type="button"
                className="requestBtn"
                onClick={() => {
                  history.push('/password')
                }}>
                ???????????? ??????
              </button>
            </div>
            <div className="inputBoxWrap">
              <div className="formInputBox disabled">
                <label className="inputBoxTitle" htmlFor="birth">
                  ????????????
                </label>
                <input
                  type="text"
                  defaultValue={profileInfo.birth ? convertDateFormat(profileInfo.birth, 'YYYY.MM.DD') : ''}
                  id="birth"
                  readOnly
                />
                <img src="https://image.dalbitlive.com/svg/ico_calendar.svg" className="calendarIcon" alt="calendar" />
              </div>
              <p className="formInputBoxResult">???????????? ????????? ?????? ???????????????.</p>
            </div>
            <div className="inputBoxWrap">
              {renderGenderBox()}
              <p className="formInputBoxResult">???????????? ????????? ?????? ???????????????.</p>
            </div>

            <div className="profileMessage">
              <label className="title" htmlFor="profileText">
                ????????? ?????????
              </label>
              <button type="button" className="cancelBtn" data-name="profMsg" onClick={onClearClick}>
                <img src="https://image.dalbitlive.com/svg/ico_delete_round.svg" alt="?????? ??????" />
              </button>
              <textarea
                className="formInputBox profileText"
                id="profileText"
                maxLength={100}
                placeholder="??????????????????."
                onChange={onInputChange}
                value={profileInfo?.profMsg ?? ''}
                name="profMsg"
              />
            </div>
            <div className="btnWrap">
              <button type="submit" className={`btn ${isActive ? '' : 'isDisable'}`} disabled={!isActive}>
                ??????
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
