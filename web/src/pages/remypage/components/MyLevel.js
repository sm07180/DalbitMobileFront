import React from 'react'
import LevelItems from "components/ui/levelItems/LevelItems";
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";

const MyLevel = (props) => {
  const {isMyProfile, profileData, closePopupAction} = props;

  return (
    <>
    <h3>내 레벨</h3>
    <section className="myLevelInfo">
      <div className="infoItem">
        <LevelItems data={profileData.level} />
        <span>{profileData.grade}</span>
        <p>{profileData.expRate}%</p>
      </div>
      <div className="levelGauge">
        <span className="gaugeBar" style={{width:`${profileData.expRate}%`}}></span>
      </div>
      <div className="exp">다음 레벨까지 {profileData.expNext} EXP 남음</div>
      <SubmitBtn text="확인" onClick={closePopupAction} />
    </section>
    </>
  )
}

export default MyLevel
