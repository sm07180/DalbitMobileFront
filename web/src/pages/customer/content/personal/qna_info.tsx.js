import React from 'react'

export default function QnaInfo() {
  return (
    <div id="qnaInfoWrap">
      <h3>
        <img src="https://image.dalbitlive.com/mypage/ico_comment_p.svg" alt="comment" /> 회원님의 소중한 의견을 남겨주세요
      </h3>
      <div className="InfoInnerBox">
        <p className="introBox">
          <span>달라</span>는 회원님들의
          <br />
          소중한 의견 및 제안으로 만들어지고 있습니다. <br />
          <span>
            제안뿐 아니라 평소 불편한 점, <br />
            오류(버그) 사항에 대해 1:1문의에 남겨 주시면
          </span>
          <br />
          상세히 검토하여 최선의 답변을 드리고
          <br />
          서비스에 즉시 반영될 수 있도록 하겠습니다.
        </p>

        <div className="giftBox">
          <p className="giftBox__title">매월 5명을 선정하여 소정의 선물을 드립니다.</p>

          <div className="giftBox__content">
            <div className="image">
              <img src="https://image.dalbitlive.com/mypage/img_giftbox_r@2x.png" alt="gift" />
            </div>

            <dl>
              <dt>- 지급 선물</dt>
              <dd>
                <img src="https://image.dalbitlive.com/mypage/ico_moon.svg" alt="moon" />달 100 +
                <img src="https://image.dalbitlive.com/mypage/ico_buster.svg" alt="buster" />
                부스터 10
              </dd>
              <dt>- 선정자 발표 및 지급일</dt>
              <dd>: 매월 초 공지사항을 통해</dd>
            </dl>
          </div>
        </div>

        <div className="noticeBox">
          <p className="noticeBox__title">유의사항</p>

          <ul>
            <li>선정자는 개별 연락드립니다.</li>
            <li>선정 선물은 '마이페이지 &gt; 내지갑' 과 방송방 생성 후 부스터 사용창 하단에서 확인이 가능합니다.</li>
            <li>매월 최대 5명이 선정되며, 경우에 따라 조정될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
