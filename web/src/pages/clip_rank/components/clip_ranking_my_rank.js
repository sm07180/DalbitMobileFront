import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Utility from 'components/lib/utility'
import Api from 'context/api'
import {DATE_TYPE} from '../constant'
import {ClipPlay} from 'pages/clip_rank/components/clip_play_fn'
import {useDispatch, useSelector} from "react-redux";

export default function ClipRankingMyRank() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const clipRankState = useSelector(({clipRankCtx}) => clipRankCtx);
  const {formState, myInfo} = clipRankState
  const [myProfile, setMyProfile] = useState(false)

  useEffect(() => {
    const createMyRank = async () => {
      if (globalState.profile !== null) {
        setMyProfile({...globalState.profile})
      } else {
        const profileInfo = await Api.profile({
          params: {memNo: globalState.token.memNo}
        })
        if (profileInfo.result === 'success') {
          setMyProfile(profileInfo.data)
        }
      }
    }
    createMyRank()
  }, [globalState.profile])

  return (
    <>
      {/* 보상 달 혜택, 소감 추후에 */}
      {/*{myInfo.isReward && formState.dateType === 2 ? (*/}
      {/*  <div className="receiveContent">*/}
      {/*    <div className="thumbnail">*/}
      {/*      <img src={myInfo.rewardImage.thumb292x292} alt="유저 이미지" />*/}
      {/*    </div>*/}

      {/*    <div className="textBox">*/}
      {/*      <p className="rankText">{myProfile.nickNm}님 축하합니다</p>*/}
      {/*      <strong className="rankTitle">*/}
      {/*        {formState.dateType === DATE_TYPE.DAY ? '일간' : '주간'}*/}
      {/*        클립랭킹 {myInfo.rewardRank}위*/}
      {/*      </strong>*/}
      {/*    </div>*/}
      {/*    <button*/}
      {/*      className="benefitButton"*/}
      {/*      onClick={() => {*/}
      {/*        history.push({*/}
      {/*          pathname: `/clip_rank/receive`*/}
      {/*        })*/}
      {/*      }}>*/}
      {/*      혜택*/}
      {/*      <br />*/}
      {/*      받기*/}
      {/*    </button>*/}
      {/*    /!**/}
      {/*      <button className="benefitButton modify">*/}
      {/*        소감내용*/}
      {/*        <br />*/}
      {/*        수정*/}
      {/*      </button> *!/*/}
      {/*  </div>*/}
      {/*) : (*/}
        <>
          {Object.keys(myInfo).length > 0 && myInfo.myRank != 0 && (
            /* 최상위 순위 반영이므로 map(x)*/
            <div className="myRanking" onClick={() => ClipPlay(myInfo.myClipNo, dispatch, globalState, history)}>
              <div className="rankingList">
                <div className="rankingList__item">
                  <p className="rankingList__item--title">
                    {formState.dateType === DATE_TYPE.DAY ? '일간' : '주간'}
                    <br/>
                    클립랭킹
                  </p>

                  <>
                    <p className="rankingList__item--number myRankingNumber">{myInfo.myRank}</p>

                    <div className="rankingList__item--updown">
                      {myInfo.myUpDown === '-' || myInfo.myUpDown === '' ? (
                        <span className="rankingList__item--updown">{myInfo.myUpDown}</span>
                      ) : myInfo.myUpDown.includes('new') ? (
                        <span className="rankingList__item--updown new">{myInfo.myUpDown}</span>
                      ) : myInfo.myUpDown.includes('+') ? (
                        <span className="rankingList__item--updown up">{Math.abs(parseInt(myInfo.myUpDown))}</span>
                      ) : (
                        <span className="rankingList__item--updown down">{Math.abs(parseInt(myInfo.myUpDown))}</span>
                      )}
                    </div>
                  </>
                </div>

                <div className="rankingList__content">
                  <div className="thumbBox">
                    <img src={myInfo.bgImg.thumb292x292} className="thumbBox__pic " alt="프로필 사진" />
                  </div>

                  <div className="textBox">
                    <p className="textBox__subject">
                      <span className="subject">{myInfo.subjectName}</span>
                      <span className="title">{myInfo.title}</span>
                    </p>
                    <strong className="textBox__nickName topTitle">{myProfile.nickNm}</strong>
                    <div className="textBox__detail">
                      <span className="textBox__detail--item headsetIcon">{Utility.addComma(myInfo.myListenPoint)}</span>
                      <span className="textBox__detail--item giftIcon">{Utility.addComma(myInfo.myGiftPoint)}</span>
                      <span className="textBox__detail--item heartIcon">{Utility.addComma(myInfo.myGoodPoint)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      {/*)}*/}
    </>
  )
}
