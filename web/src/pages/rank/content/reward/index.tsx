import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { IMG_SERVER } from "constant/define";

//components
import RandomBoxPop from "./random_box";

//static
import CloseBtn from "../../static/ic_close.svg";

import { useHistory } from "react-router-dom";
import { DATE_TYPE, RANK_TYPE } from "pages/rank/constant";

export default function RankReward({ reward, formState, myInfo, setRewardPop }) {
  // const { setPopup, state, formData, setstate, rankType, dateType } = props;

  const history = useHistory();
  const [randomPopup, setRandomPopup] = useState(false);

  const closePopup = () => {
    setRewardPop(false);
    myInfo.isReward = false;
  };

  const onRandomPopup = () => {
    setRandomPopup(true);
    myInfo.isReward = false;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <PopupWrap>
      <div
        className="content-wrap"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button onClick={() => closePopup()} className="btn-close">
          <img src={CloseBtn} />
        </button>
        <div className="title-box">
          {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
            <p className="title">
              {formState[formState.pageType].dateType === DATE_TYPE.DAY ? "일간" : "주간"} 좋아요 랭킹 {reward.rank}위
            </p>
          ) : (
            <p className="title">{reward.text}가 되셨습니다.</p>
          )}

          <p className="sub-title">
            <img src={`${IMG_SERVER}/ranking/reward_pop_character3@2x.png`} width={26} height={26} /> 축하합니다
          </p>
        </div>

        <div className="reward-content">
          {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
            <>
              <div className="reward-like-box">
                {formState[formState.pageType].dateType === DATE_TYPE.DAY ? (
                  <div className="reward">
                    <span>보상</span>
                    <label className="badge-label">
                      <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 {reward.rewardDal}
                    </label>
                  </div>
                ) : (
                  <div className="reward-badge">
                    <label className="badge-label">
                      {" "}
                      <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={28} height={28} /> 달 {reward.rewardDal}
                    </label>{" "}
                    <div className="top-badge-box">
                      <span className="top-badge-title">TOP 배지</span>{" "}
                      <label
                        className="badge-label right"
                        style={{
                          background: `linear-gradient(to right, ${reward.startColor}, ${reward.endColor}`,
                        }}
                      >
                        <img src={reward.icon} width={28} height={28} />
                        <span>{reward.text}</span>
                      </label>
                    </div>
                  </div>
                )}

                <p className="notice">
                  보상 내역은 <span>마이페이지 &gt; 내 지갑</span>에서
                  <br />
                  확인하실 수 있습니다.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="title">{reward.text} 보상</p>

              <div>
                <div className="top-badge-box">
                  <span className="top-badge-title">TOP 배지</span>{" "}
                  <label
                    className="badge-label right"
                    style={{
                      background: `linear-gradient(to right, ${reward.startColor}, ${reward.endColor}`,
                    }}
                  >
                    <img src={reward.icon} width={26} height={26} />
                    <span>{reward.text}</span>
                  </label>
                </div>
                <div className="bottom-badge-box">
                  <label className="badge-label">
                    {" "}
                    <img src={`${IMG_SERVER}/images/api/ic_moon_s@2x.png`} width={20} height={20} /> 달 {reward.rewardDal}
                  </label>{" "}
                  <label className="badge-label right">
                    <img src={`${IMG_SERVER}/images/api/ic_gift@2x.png`} width={28} height={28} /> 경험치 랜덤 박스
                  </label>
                  {/* {myInfo.rewardPoint !== "" ? (
                    <label className="badge-label center">차기 스페셜DJ 선정 시 가산점 {myInfo.rewardPoint}점 지급</label>
                  ) : (
                    ""
                  )} */}
                </div>
              </div>
            </>
          )}
        </div>
        {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
          <button onClick={() => closePopup()} className="btn-random-box">
            확인
          </button>
        ) : (
          <button onClick={() => onRandomPopup()} className="btn-random-box">
            경험치 랜덤 박스 열기
          </button>
        )}

        {formState[formState.pageType].rankType !== RANK_TYPE.LIKE ? (
          <ul className="notice-box">
            <li>* 랭킹 배지는 자동 지급 받으셨습니다.</li>
            <li>* 경험치 랜덤 박스 보상은 데이터 업데이트 전까지 받아야합니다.</li>
            {/* <li>* 경험치 랜덤 박스는 최하 50 EXP ~ 최대 500 EXP까지 보상을  받을 수 있습니다.</li> */}
          </ul>
        ) : (
          <>
            {formState[formState.pageType].dateType === 1 ? (
              ""
            ) : (
              <ul className="notice-box">
                <li>* 랭킹 배지는 자동 지급 받으셨습니다.</li>
              </ul>
            )}
          </>
        )}
      </div>
      {randomPopup && (
        <RandomBoxPop
          formState={formState}
          setRandomPopup={setRandomPopup}
          setRewardPop={setRewardPop}
          // randomPopup={randomPopup}
          // setRandomPopup={setRandomPopup}
          // formData={formData}
          // setPopup={setPopup}
          // state={state}
          // setstate={setstate}
          // rankType={rankType}
          // dateType={dateType}
        />
      )}
    </PopupWrap>
  );
}

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    vertical-align: middle;
  }

  .content-wrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 328px;
    padding: 50px 16px;
    border-radius: 16px;
    background-color: #fff;

    .btn-close {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    .title-box {
      margin-bottom: 20px;
      text-align: center;
      font-weight: 500;

      .title {
        font-size: 14px;
        line-height: 22px;
      }

      .sub-title {
        font-size: 24px;
        line-height: 27px;
      }
    }

    .reward-content {
      position: relative;
      margin-bottom: 25px;
      padding: 18px 25px 12px 25px;
      border-radius: 20px;
      border: 1px solid #FF3C7B;

      .title {
        display: inline-block;
        position: absolute;
        width: 58%;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 11px;
        color: #FF3C7B;
        text-align: center;
        font-size: 14px;
        background-color: #fff;
        text-align: center;
      }

      .top-badge-box {
        display: flex;
        justify-content: space-between;
        padding: 3px;
        height: 34px;
        border-radius: 20px;
        border: 1px dotted #e8e8e8;

        .top-badge-title {
          width: 38%;
          font-size: 12px;
          line-height: 34px;
          letter-spacing: -0.3px;
          color: #424242;
          text-align: center;
        }

        .badge-label {
          display: inline-block;
          width: 60%;
          border-radius: 18px;
          color: #fff;
          font-size: 12px;
          letter-spacing: -0.6px;
          line-height: 32px;
          text-align: center;
          font-weight: 500;
        }
      }

      .bottom-badge-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 6px;

        .badge-label {
          display: inline-block;
          width: 38%;
          height: 34px;
          border-radius: 18px;
          background-color: #efefef;
          color: #424242;
          font-size: 12px;
          letter-spacing: -0.6px;
          line-height: 34px;
          text-align: center;
          font-weight: 500;

          &.right {
            width: 60%;
          }

          &.center {
            margin-top: 6px;
            width: 100%;
          }
        }
      }

      .reward-like-box {
        .reward {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 14px;

          span {
            font-size: 18px;
            font-weight: 500;
            color: #FF3C7B;
          }

          label {
            margin-left: 8px;
            display: inline-block;
            width: 96px;
            height: 34px;
            border-radius: 18px;
            background-color: #efefef;
            color: #424242;
            font-size: 16px;
            letter-spacing: -0.6px;
            line-height: 34px;
            text-align: center;
            font-weight: 500;
          }
        }

        .reward-badge {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          justify-content: space-between;
          height: 34px;
          padding: 3px;

          & > .badge-label {
            display: flex;
            align-items: center;
            width: 34%;
            padding: 3px;
            margin-right: 4px;
            background-color: #efefef;
            border-radius: 20px;
            font-size: 12px;
            color: black;
          }

          & > .top-badge-box {
            width: 73%;

            .badge-label {
              width: 70%;
            }
          }
        }

        .notice {
          font-size: 12px;
          color: #616161;
          line-height: 16px;
          text-align: center;

          span {
            text-decoration: underline;
          }
        }
      }
    }

    .btn-random-box {
      width: 100%;
      height: 44px;
      border-radius: 12px;
      background-color: #FF3C7B;
      letter-spacing: -0.4px;
      color: #ffffff;
      font-weight: 500;
    }

    .notice-box {
      margin-top: 12px;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: -0.18px;
      color: #757575;
    }
  }
`;
