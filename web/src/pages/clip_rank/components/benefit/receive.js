import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {ClipRankContext} from 'context/clip_rank_ctx'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'
import {DATE_TYPE} from '../../constant'
import '../../index.scss'
import DalbitTextArea from 'pages/mypage/content/textarea'

const Receive = () => {
  const history = useHistory()
  const context = useContext(Context)
  const [winMsg, setWinMsg] = useState('')
  const {clipRankState} = useContext(ClipRankContext)
  const {formState} = clipRankState
  const [rankingList, setRankingList] = useState([])
  const [myProfile, setMyProfile] = useState([])

  // async function fetchDayData() {
  //   const res = await Api.getClipRankingDayPop({})
  //   if (res.result === 'success') {
  //     setRankingList(res.data.list)
  //   } else {
  //     setRankingList([])
  //   }
  // }

  async function fetchWeekData() {
    const res = await Api.getClipRankingWeekPop({})
    if (res.result === 'success') {
      setRankingList(res.data.list)
    } else {
      setRankingList([])
    }
  }

  // const validation = () => {
  //   if (formState.dateType === DATE_TYPE.WEEK) {
  //     if (!winMsg) {
  //       context.action.alert({
  //         msg:
  //           '소감작성을 완료하여 주세요.<br />소감 작성은 주간 클립TOP3에게만 주어지는 혜택으로 회원님만의 매력을 어필할 수 있습니다.'
  //       })
  //       return false
  //     }
  //     if (winMsg.length > 100) {
  //       return false
  //     }
  //     clipWinMsg()
  //   } else {
  //     context.action.alert({
  //       msg: '보상지급이 완료되었습니다.<br />보상달은 > 내 지갑에서 확인할 수 있습니다.',
  //       callback: () => {
  //         history.replace('/clip_rank')
  //       }
  //     })
  //   }
  // }

  const validation = () => {
    context.action.alert({
      msg: '보상지급이 완료되었습니다.',
      callback: () => {
        history.replace('/clip_rank')
      }
    })
  }

  // const clipWinMsg = async () => {
  //   const res = await Api.postClipWinMsg({
  //     winMsg: winMsg
  //   })
  //   if (res.result === 'success') {
  //     context.action.alert({
  //       msg:
  //         '소감작성 및 보상지급이 완료되었습니다.<br />보상달은 > 내 지갑에서,<br />보상뱃지는 > 프로필에서 확인할 수 있습니다.',
  //       title: '',
  //       callback: () => {
  //         history.replace('/clip_rank')
  //       }
  //     })
  //   } else {
  //     context.action.alert({
  //       msg: `${res.message}`,
  //       callback: () => {
  //         history.replace('/clip_rank')
  //       }
  //     })
  //   }
  // }

  useEffect(() => {
    // if (formState.dateType === DATE_TYPE.DAY) {
    //   fetchDayData()
    // } else {
    fetchWeekData()
    // }
  }, [])

  useEffect(() => {
    const createMyRank = () => {
      if (context.token.isLogin) {
        const settingProfileInfo = async (memNo) => {
          const profileInfo = await Api.profile({
            params: {memNo: context.token.memNo}
          })
          if (profileInfo.result === 'success') {
            setMyProfile(profileInfo.data)
          }
        }
        settingProfileInfo()
      } else {
        return null
      }
    }
    createMyRank()
  }, [])

  return (
    <div id="benefitsReceive" className="gray">
      <div className="pointBox">
        <div className="point">
          <p className="text">{myProfile.nickNm}님</p>
          <strong className="title">축하합니다!!</strong>
        </div>

        <p className="notice">
          {/*{formState.dateType === DATE_TYPE.DAY &&*/}
          {/*  '[혜택받기] 버튼을 눌러 주시면 보상달이 지급되어 내지갑에서 확인하실 수 있습니다. '}*/}
          {/*{formState.dateType === DATE_TYPE.WEEK &&*/}
          {/*  '[소감 작성 완료 및 혜택받기] 버튼을 눌러 주시면 보상달이 지급되어 내지갑으로, 보상뱃지는 프로필에서 확인하실 수 있습니다. '}*/}
          [혜택받기] 버튼을 통해 보상 받은 보상 배지는 프로필에서 확인할 수 있습니다.
        </p>
      </div>

      {rankingList.length > 0 && (
        <div className="rankingBox">
          {rankingList.map((v, i) => {
            return (
              <div className="rankingList" key={i}>
                <div className="rankingList__item">
                  {v.rank === 1 && (
                    <img src={`${IMG_SERVER}/images/clip_rank/medal_gold_b@2x.png`} className="rankingList__item--gold" />
                  )}
                  {v.rank === 2 && (
                    <img
                      src={`${IMG_SERVER}/images/clip_rank/medal_silver_b@2x.png`}
                      className="rankingList__item--silverBronze"
                    />
                  )}
                  {v.rank === 3 && (
                    <img
                      src={`${IMG_SERVER}/images/clip_rank/medal_bronze_m@2x.png`}
                      className="rankingList__item--silverBronze"
                    />
                  )}
                  <p>
                    {formState.dateType === DATE_TYPE.DAY ? '일간' : '주간'} {v.rank}위
                  </p>
                </div>

                <div className="rankingList__content">
                  <div className="thumbBox">
                    <img src={v.bgImg.thumb292x292} className="thumbBox__img" />
                  </div>

                  <div className="iconBox">
                    {/*<div className="iconBox__text">*/}
                    {/*  <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} alt="달"/>*/}
                    {/*  <>{`달 ${v.rewardDal}`}</>*/}
                    {/*</div>*/}
                    {formState.dateType === DATE_TYPE.WEEK && (
                      <div className="iconBox__text iconBox__text--crown">
                        <img src={v.icon} alt={`${v.rank}등 왕관`} />
                        클립 주간 {v.rank}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="rankWrite">
        {/*{formState.dateType === DATE_TYPE.WEEK && (*/}
        {/*  <>*/}
        {/*    <h3 className="rankWrite__title">소감작성</h3>*/}

        {/*    <DalbitTextArea*/}
        {/*      id="winnerMsg"*/}
        {/*      className="rankWrite__textarea"*/}
        {/*      placeholder="랭킹 TOP3 혜택에 대한 소감을 &#13;&#10;10자 이상, 최대 100자까지 입력해 주세요!"*/}
        {/*      state={winMsg}*/}
        {/*      setState={setWinMsg}*/}
        {/*      maxLength="100"*/}
        {/*    />*/}
        {/*  </>*/}
        {/*)}*/}
        <ul className="rankWrite__noticeList">
          <li>일간 클립랭킹은 중복이 가능합니다.</li>
          <li>주간 클립랭킹은 가장 상위 순위의 클립으로 순위가 확인되고,</li>
          <li>주간 클립랭킹 Top3에게는 보상 배지 혜택을 드립니다.</li>
          {/*{formState.dateType === DATE_TYPE.WEEK && <li>· 소감작성을 완료하신 후 수정이 불가하오니 신중하게 작성해주세요.</li>}*/}
        </ul>

        <button className="rankWrite__button" onClick={validation}>
          {/*{formState.dateType === DATE_TYPE.DAY ? '혜택받기' : '소감작성 완료 및 혜택받기'}*/}
          혜택받기
        </button>
      </div>
    </div>
  )
}

export default Receive
