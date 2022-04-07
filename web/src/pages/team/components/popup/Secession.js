import React, {useEffect, useState} from 'react';
// global components
// scss
import '../../scss/secession.scss';

const SecessionPop = (props) => {
  const {closeSlide} = props;

  // 페이지 시작
  return (
    <section className="secession">
      <div className="teamList">
        <label className="listRow">
          <div className="photo">
            <img src="" alt="" />
          </div>
          <div className="listContent">
            <div className="nick">일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십</div>
          </div>
          <div className="listBack">
            <input type="radio" name="team" className="blind" />
            <div className="checkIcon"></div>
          </div>
        </label>
        <label className="listRow">
          <div className="photo">
            <img src="" alt="" />
          </div>
          <div className="listContent">
            <div className="nick">일이삼사오육칠팔구십</div>
          </div>
          <div className="listBack">
            <input type="radio" name="team" className="blind" />
            <div className="checkIcon"></div>
          </div>
        </label>
      </div>
      <div className="buttonGroup">
        <button onClick={closeSlide}>취소</button>
        <button>다음</button>
      </div>
    </section>
  )
}

export default SecessionPop;