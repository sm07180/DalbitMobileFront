
import React from 'react';
import './static/rangking2.scss';

import sample1 from './static/sample1.jpg';
// import sample2 from './static/sample2.jpg';
// import sample3 from './static/sample3.jpg';
// import sample4 from './static/sample4.jpg';
// import sample5 from './static/sample5.jpg';




import closeBtn from './static/ic_back.svg';
import rankNotice from './static/notice_img.png';
import scoreup from './static/scoreup.png';
import scoredown from './static/scoredown.png';
import pointimg from './static/pointimg.png';

import icoLike from './static/ico_like.png';
import icoPeople from './static/ico_people.png';
import icoStar from './static/ico_star.png';
import icoTtar from './static/ico_time.png';

import icoKorea from './static/ico-korea.png';
import icoFemale from './static/ico-female.png'





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

    <div className="rangkMy">
      <div className="rangkMy__textBox">
        <div className="rangkMy__list rangkMy__list--title"> 내 랭킹</div>
        <div className="rangkMy__list rangkMy__list--score">1290</div>
        <div className="rangkMy__list rangkMy__list--scoreUp">
          <img src={scoreup}className="scoreupImg"/> 230</div>
        <div className="rangkMy__list rangkMy__list--point">
          <img src={pointimg} className="pointImg"/> 45</div>        
      </div>

      <div className="rangkMy__content">
        <div className="rangkMy__imgTitle">
          <div className="rangkMy__imgFrame">
            <div className="rangkMy__lingImg"></div>
            <img src={sample1} className="rangkMy__img"/>
          </div>
          <div className="rangkMy__itme">
            <div className="rangkMy__level">Lv<b className="rangkMy__level--bold">49. </b> 은메달</div>
            <div className="rangkMy__title">상큼 레몬향기</div>
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

    <div className="bestBox">
      <div className="best__margin">
        <div className="best__one">
          <div className="best__medal">
            <div className="best__score">NEW</div>
          </div>
          <div className="best__live">Live</div>

          <div className="best__content">
            <div className="best__imgBox">
              <div className="best__lingImg"></div>
              <img src={sample1} className="best__img"/>
            </div>
            <div className="best__subTitle">
              Lv<b>49.</b> 황금트로피
            </div>
            <div className="best__title">
              세상 아름다운 DJ 쩡 
              <div className="best__titleImg">
                <img src={icoKorea} className="best__title--img"/>
                <img src={icoFemale} className="best__title--img"/>
              </div>
            </div>
          </div>

          <ul className="rangkPoint rangkPoint--center">
            <li className="rangkPoint__list rangkPoint__list--bold">
            <img src={pointimg} className="rangkPoint__list--img50"/> 45
            </li>
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

      <div className="best__two">
      <div className="best__margin">
        <div className="best__one best__one--rightMargin">
          <div className="best__medal best__medal--silver">
            <div className="best__score best__score--down">
              <img src={scoredown} className="scoreImg"/> 45
            </div>
          </div>
          <div className="best__live">Live</div>

          <div className="best__content">
            <div className="best__imgBox best__imgBox--two">
              <div className="best__lingImgSmall best__lingImgSmall--lv10"></div>
              <img src={sample1} className="best__img"/>
            </div>
            <div className="best__subTitle best__subTitle--yellow">
              Lv<b>8.</b> 황금트로피1
            </div>
            <div className="best__title best__title--block">
              세상 아름다운 DJ 쩡 
              <div className="best__titleImg best__titleImg--margin">
                <img src={icoKorea} className="best__title--img"/>
                <img src={icoFemale} className="best__title--img"/>
              </div>
            </div>
          </div>

          <ul className="rangkPoint rangkPoint--row">
            <li className="rangkPoint__list rangkPoint__list--two rangkPoint__list--bold " >
            <img src={pointimg} className="rangkPoint__list--img50"/> 45
            </li>
            <li className="rangkPoint__list rangkPoint__list--two">
            <img src={icoStar} className="rangkPoint__list--img50"/> 4,345
            </li>
            <li className="rangkPoint__list rangkPoint__list--two">
            <img src={icoPeople} className="rangkPoint__list--img50"/> 45
            </li>
            <li className="rangkPoint__list rangkPoint__list--two">
            <img src={icoLike} className="rangkPoint__list--img50"/> 81222
            </li>
            <li className="rangkPoint__list rangkPoint__list--two">
            <img src={icoTtar} className="rangkPoint__list--img50"/> 1811
            </li>                              
          </ul>
        </div>
      </div>
      <div className="best__margin">
        <div className="best__one">
          <div className="best__medal best__medal--bronze">
            <div className="best__score best__score--basic">-</div>
          </div>
          <div className="best__live">Live</div>

          <div className="best__content">
            <div className="best__imgBox best__imgBox--two">
              <div className="best__lingImgSmall best__lingImgSmall--lv16"></div>
              <img src={sample1} className="best__imgSmall"/>
            </div>
            <div className="best__subTitle best__subTitle--green">
              Lv<b>49.</b> 황금트로피
            </div>
            <div className="best__title best__title--block">
              세상 아름다운 DJ 쩡 
              <div className="best__titleImg best__titleImg--margin">
                <img src={icoKorea} className="best__title--img"/>
                <img src={icoFemale} className="best__title--img"/>
              </div>
            </div>
          </div>

          <ul className="rangkPoint rangkPoint--row">
            <li className="rangkPoint__list rangkPoint__list--two rangkPoint__list--bold " >
            <img src={pointimg} className="rangkPoint__list--img50"/> 45
            </li>
            <li className="rangkPoint__list rangkPoint__list--two">
            <img src={icoStar} className="rangkPoint__list--img50"/> 4,345
            </li>
            <li className="rangkPoint__list rangkPoint__list--two">
            <img src={icoPeople} className="rangkPoint__list--img50"/> 45
            </li>
            <li className="rangkPoint__list rangkPoint__list--two">
            <img src={icoLike} className="rangkPoint__list--img50"/> 81222
            </li>
            <li className="rangkPoint__list rangkPoint__list--two">
            <img src={icoTtar} className="rangkPoint__list--img50"/> 1811
            </li>                              
          </ul>
        </div>
      </div>
      </div>
    </div>

    <div className="rankBox">
      <div className="rankBox__list">
        <div className="rankBox__text">
          <div className="rankBox__number">4</div>
          <div className="rankBox__score rankBox__score--basic"></div>
          <div className="rankBox__point"><img src={pointimg} className="pointImg"/>2536</div>
        </div>

        <div className="rankBox__content">
          <div className="rankBox__itemTop">
            <div className="rankBox__itemImg"><img src={sample1} className="itemImg"/></div>
            <div className="rankBox__itemText">
              <div className="rankBox__itemTitle">타이틀</div>
              <div className="rankBox__itemPoint">
              <img src={icoKorea} className="itemPoint"/>
              <img src={icoFemale} className="itemPoint"/>
              <div className="djIcon">스페셜DJ</div>
              </div>
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
        <div className="rankBox__Live">
          LIVE
        </div>
      </div>


      <div className="rankBox__list">
        <div className="rankBox__text">
          <div className="rankBox__number">4</div>
          <div className="rankBox__score rankBox__score--basic"></div>
          <div className="rankBox__point"><img src={pointimg} className="pointImg"/>2536</div>
        </div>

        <div className="rankBox__content">
          <div className="rankBox__itemTop">
            <div className="rankBox__itemImg"><img src={sample1} className="itemImg"/></div>
            <div className="rankBox__itemText">
              <div className="rankBox__itemTitle">타이틀</div>
              <div className="rankBox__itemPoint">
              <img src={icoKorea} className="itemPoint"/>
              <img src={icoFemale} className="itemPoint"/>
              <div className="djIcon">스페셜DJ</div>
              </div>
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
        <div className="rankBox__Live">
          LIVE
        </div>
      </div>
      
    </div>

  </div>


  </>
  );
};

export default index
