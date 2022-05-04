import React from 'react';

const ProfileNoticePop = () => {
  return (
    <section className="profileRankNotice">
      <div className="title">최근 팬 랭킹</div>
      <div className="text">최근 3개월 간 내 방송에서 선물을 많이<br/>
        보낸 팬 순위입니다.</div>
      <div className="title">누적 팬 랭킹</div>
      <div className="text">전체 기간 동안 해당 회원의 방송에서<br/>
        선물을 많이 보낸 팬 순위입니다.</div>
      <div className="title">좋아요 전체 랭킹</div>
      <div className="text">팬 여부와 관계없이 해당 회원의<br/>
        방송에서 좋아요(부스터 포함)를 보낸<br/>
        전체 회원 순위입니다.</div>
    </section>
  )
}

export default ProfileNoticePop;
