import React, {useContext, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from 'context';
import {IMG_SERVER} from 'context/config';
import Utility from 'components/lib/utility';
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/CntWrapper';
import CntTitle from 'components/ui/cntTitle/CntTitle';
import ListRow from 'components/ui/listRow/ListRow';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import LayerPop from 'components/ui/layerPopup/LayerPopup'
// components
import TeamForm from '../../components/TeamForm';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupOpenData} from "redux/actions/common";

import "../../scss/teamManager.scss";

const TeamManager = () => {
  const history = useHistory();
  const context = useContext(Context);
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);
  
  const [confirmPop, setConfirmPop] = useState(false);

  const clickConfirmPopup = () => {
    setConfirmPop(!confirmPop);
  };
  
  // 강퇴하기
  const teamDelete = () => {
    context.action.confirm({
      msg: `해당 회원님을 정말 강퇴시킬까요?`,
      buttonText: {
        left: '취소',
        right: '강퇴'
      },
      callback: () => {
        console.log('delete');
      }
    });
  };

  // 페이지 시작
  return (
    <div id="teamManager">
      <Header title="팀 관리" type="back" />
      <CntWrapper>
        <section className="teamNotice">
          <div>팀 심볼과 이름은 생성 후 <strong>72시간 이내 최대 1번</strong>만
          수정할 수 있습니다.<span>남은시간 71시간 59분</span></div>
        </section>
        <section className="teamSymbol">
          <div className="parts-C">
            <img src={"https://image.dalbitlive.com/team/parts/C-9.png"} />
            <div className="parts-B">
              <img src={"https://image.dalbitlive.com/team/parts/B-7.png"} />
            </div>
            <div className="parts-A">
              <img src={"https://image.dalbitlive.com/team/parts/A-7.png"} />
            </div>
          </div>
        </section>
        <TeamForm rows={7} />
        <CntTitle title="맴버">
          <span className="count"><strong>2</strong>/5</span>
        </CntTitle>
        <section className="memberList">
          <ListRow photo="" photoClick={() => photoClick()}>
            <div className="listContent">
              <div className="listItem">
                <div className="nick">일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십</div>
                <img src={`${IMG_SERVER}/team/teamLeader.png`} alt="teamLeader" />
              </div>
              <div className="listItem">
                <div className="iconPoint"></div>
                <div className="point">{Utility.addComma(123456789)}</div>
              </div>
            </div>
            <div className="listBack">
              <button onClick={teamDelete}>강퇴하기</button>
            </div>
          </ListRow>
        </section>
        <div className="switchList">
          <div className="titleWrap">
            <span className="title">가입 신청 허용</span>
            <span className="subTitle">다른 회원이 우리팀에 가입 신청하는 것을 허용합니다.</span>
          </div>
          <label className="inputLabel">
            <input type="checkbox" className="blind" />
            <span className="switchBtn" />
          </label>
        </div>
        <section className="buttonWrap">
          <SubmitBtn text="완료" onClick={clickConfirmPopup} />
        </section>
      </CntWrapper>
    </div>
  )
}

export default TeamManager;
