//context
import React from 'react'
import {useDispatch} from "react-redux";
import {setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default function RankingType(props) {
  const dispatch = useDispatch();

  const {rankingTerm} = props

  if (props.rankingType === 'exp') {
    return (
      <div className="content-wrap">
        {rankingTerm.round === 1 && <img src="https://image.dalbitlive.com/event/200608/ranking_exp_01_img1.png"/>}
        {rankingTerm.round === 2 && <img src="https://image.dalbitlive.com/event/200608/ranking_exp_01_img2.png" />}
        {rankingTerm.round === 3 && <img src="https://image.dalbitlive.com/event/200608/ranking_exp_01_img3.png" />}

        <div className="notice-wrap">
          <p>순위는 실시간으로 집계됩니다.</p>

          <p>
            매회차 당첨 가능, 같은 회차 분야별 <span>(경험치,좋아요, 선물)</span> 중복 당첨은 제외함{' '}
            <span>(가격기준 고순위만 인정, 후순위 유저가 대체 선정)</span>
          </p>

          <p>
            당첨자 발표일 및 유의사항{' '}
            <button
              type="button"
              onClick={() => {
                dispatch(setGlobalCtxUpdatePopup({popup: ['TERMS', 'event-detail']}))
              }}>
              자세히보기
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch(setGlobalCtxUpdatePopup({popup: ['TERMS', 'event-gift-detail']}))
              }}>
              경품 상세소개
            </button>
          </p>
        </div>
      </div>
    )
  } else if (props.rankingType === 'like') {
    return (
      <div className="content-wrap">
        {rankingTerm.round === 1 && <img src="https://image.dalbitlive.com/event/200608/ranking_like_01_img1.png" />}
        {rankingTerm.round === 2 && <img src="https://image.dalbitlive.com/event/200608/ranking_like_01_img2.png" />}
        {rankingTerm.round === 3 && <img src="https://image.dalbitlive.com/event/200608/ranking_like_01_img3.png" />}

        <div className="notice-wrap">
          <p>부스터도 좋아요 수에 합산됩니다</p>
          <p>순위는 실시간으로 집계됩니다.</p>
          <p>이벤트 전체적인 유의사항은 ‘경험치 랭킹’에서 확인하세요.</p>
        </div>
      </div>
    )
  } else if (props.rankingType === 'gift') {
    return (
      <div className="content-wrap">
        {rankingTerm.round === 1 && <img src="https://image.dalbitlive.com/event/200609/ranking_gift_01_img3_0609.png" />}
        {rankingTerm.round === 2 && <img src="https://image.dalbitlive.com/event/200608/ranking_gift_01_img2.png" />}
        {rankingTerm.round === 3 && <img src="https://image.dalbitlive.com/event/200608/ranking_gift_01_img3.png" />}

        <div className="notice-wrap">
          <p>
            부스터도 선물에 합산(부스터 1회당 10개)됩니다. <span>(※ 달 직접 선물제외)</span>
          </p>
          <p>집계는 실시간으로 진행됩니다.</p>
          <p>이벤트 전체적인 유의사항은 ‘경험치 랭킹’에서 확인하세요.</p>
          <p>
            배지(회장님, 부회장님, 사장님)는 매 회차 당첨 가능.
            <br />
            단, 최고 높은 등급의 배지 1개만 지급됩니다.
            <br />
            배지 유효기간은 1개월 입니다.
          </p>

          <p>배지는 이벤트 종료 후 일괄 지급됩니다.</p>
        </div>
      </div>
    )
  }

  return null
}
