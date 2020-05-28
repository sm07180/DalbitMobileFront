<<<<<<< HEAD
import React from 'react';
import './static/rangking2.scss';
=======
import React from 'react'
// import './static/rangking2.css';
>>>>>>> 2c227430a9c0670530f801203be480acd4339110


import sample1 from './static/sample1.jpg';
// import sample2 from './static/sample2.jpg';
// import sample3 from './static/sample3.jpg';
// import sample4 from './static/sample4.jpg';
// import sample5 from './static/sample5.jpg';

<<<<<<< HEAD


import closeBtn from './static/ic_back.svg';
import rankNotice from './static/notice_img.png';
import scoreup from './static/scoreup.png';
import pointimg from './static/pointimg.png';

import icoLike from './static/ico_like.png';
import icoPeople from './static/ico_people.png';
import icoStar from './static/ico_star.png';
import icoTtar from './static/ico_time.png';




const index = () => {
  return (
  <>
  <div className="header">
    <h2 className="header__title">
    <img src={closeBtn} className="header__back"/> 
    탑 랭킹
    </h2>
  </div>

  <div className="center">
    <div className="rankTitle">
      <div className="rankTitle__tab">
        <a href="#" className="rankTitle__button rankTitle__button--active">DJ</a>
        <a href="#" className="rankTitle__button">팬</a>        
      </div>
      <div className="rankTitle__titme">
  16:00 <img src={rankNotice} className="rankTitle__noticeImg"/>
      </div>
    </div>

    <div className="rankDay">
      <a href="#" className="rankDay__button rankDay__button--active">오늘
      <hr className="acitve--line"/>
      </a>
      <a href="#" className="rankDay__button">일간</a>
      <a href="#" className="rankDay__button">주간<hr/></a>
      <a href="#" className="rankDay__button">월간<hr/></a>      
    </div>

    <div className="rangkBest">
      <div className="rangkBest__textBox"> {/* 레프트 */}
        <div className="rangkBest__list rangkBest__list--title"> 내 랭킹</div>
        <div className="rangkBest__list rangkBest__list--score">1290</div>
        <div className="rangkBest__list rangkBest__list--scoreUp">
          <img src={scoreup}className="scoreupImg"/> 230</div>
        <div className="rangkBest__list rangkBest__list--point">
          <img src={pointimg} className="pointImg"/> 45</div>        
      </div>

      <div className="rangkBest__content">{/* 라 */}
        <div className="rangkBest__imgTitle">
          <div className="rangkBest__imgFrame">
            <div className="rangkBest__lingImg"></div>
            <img src={sample1} className="rangkBest__img"/>
          </div>
          <div className="rangkBest__itme">
            <div className="rangkBest__level">lv<b className="rangkBest__level--bold">49. </b> 은메달</div>
            <div className="rangkBest__title">상큼 레몬향기</div>
          </div>
        </div>
        <ul className="rangkPoint">
          <li className="rangkPoint__list">
            <img src={icoStar} className="rangkPoint__list--img50"/> 45
          </li>
          <li className="rangkPoint__list">
          <img src={icoPeople} className="rangkPoint__list--img50"/> 45
          </li>
          <li className="rangkPoint__list">
          <img src={icoLike} className="rangkPoint__list--img50"/> 2,181
          </li>
          <li className="rangkPoint__list">
          <img src={icoTtar} className="rangkPoint__list--img50"/> 2,181
          </li>                              
        </ul>
      </div>
    </div>

  </div>


  </>
  );
};
=======
const index = () => {
  return (
    <>
      <div>
        <h2 className="chargeTitle"></h2>
      </div>
    </>
  )
}
>>>>>>> 2c227430a9c0670530f801203be480acd4339110

export default index
