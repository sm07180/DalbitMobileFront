import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {DATE_TYPE} from '../constant'
import {Context} from 'context'
import {ClipPlay} from 'pages/clip_rank/components/clip_play_fn'
import {useSelector} from "react-redux";

const liveDateCheckIdx = 3

export default function ClipRankingListTop3() {
  const context = useContext(Context)
  const history = useHistory()
  const clipRankState = useSelector(({clipRank}) => clipRank);
  const {formState, clipRankList} = clipRankState

  // function validation(data) {
  //   if (data.winnerMsg.length === 0) {
  //     context.action.alert({
  //       msg: '작성하신 소감정보가 없습니다.'
  //     })
  //   } else {
  //     setWinnerRankMsgProf(data)
  //     {
  //       context.action.updatePopup('RANK_TOP_IMPORESSION')
  //     }
  //   }
  // }

  function loginCheck(memNo) {
    if (!context.token.isLogin) {
      history.push(`/login?redirect=/mypage/${memNo}`)
    } else {
      history.push(`/mypage/${memNo}`)
    }
  }

  return (
    <div className={`TopBox ${formState.dateType === DATE_TYPE.WEEK && `isImpression`}`}>
      {clipRankList.slice(0, liveDateCheckIdx).map((v, i) => {
        return (
          <div className="TopBox__item" key={i}>
            <div className="TopBoxThumb">
              {formState.dateType === DATE_TYPE.DAY &&
              <div
                className="TopBoxThumb__pic"
                onClick={() => {
                  ClipPlay(v.clipNo, context, history)
                }}
              >
                <img src={v.bgImg.thumb120x120} alt="프로필 사진" />
              </div>
              }

              {formState.dateType === DATE_TYPE.WEEK &&
              <>
                <div
                  className="TopBoxThumb__user"
                  onClick={() => loginCheck(v.memNo)}
                >
                  <img src={v.profImg.thumb190x190} alt="유저이미지" />

                  <p>{v.nickName}</p>
                </div>

                <div
                  className="TopBoxThumb__item"
                  onClick={() => {
                    ClipPlay(v.clipNo, context, history);
                  }}
                >
                  <img src={v.bgImg.thumb190x190} alt="플레이어 썸네일" />
                </div>
              </>
              }
            </div>

            <div className={`textBox ${formState.dateType === DATE_TYPE.WEEK ? " week" : ""}`}>
              {/* 일간일 때 title, nickName */}
              {/* 주간일 때 subjectName, title */}
              <span className="category" onClick={() => {ClipPlay(v.clipNo, context, history)}}>{v.subjectName}</span>
              <span className="subject" onClick={() => {ClipPlay(v.clipNo, context, history)}}>{v.title}</span>
              <strong className="nickName" onClick={() => {loginCheck(v.memNo);}}>{v.nickName}</strong>
              {/* 추후에 소감보기 생긴다고 하셔서 주석처리 해놓겠습니다. */}
              {/*{(formState.dateType === DATE_TYPE.WEEK && formState.rankingDate != convertDateFormat(convertMonday(), "YYYY-MM-DD")) ? (*/}
              {/*  <button*/}
              {/*    className="viewButton"*/}
              {/*    onClick={() => {*/}
              {/*      validation(v);*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    소감보기*/}
              {/*  </button>*/}
              {/*) : (*/}
              {/*  <></>*/}
              {/*)}*/}
            </div>
          </div>
        )
      })}
    </div>
  )
}
