import React, {useState,useContext} from 'react';
import {useHistory} from "react-router-dom";
import {Context} from 'context';
import {IMG_SERVER} from 'context/config';
// global components
import Header from 'components/ui/header/Header';
import CntWrapper from 'components/ui/cntWrapper/CntWrapper';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import LayerPopup from 'components/ui/layerPopup/LayerPopup';
// components
import BadgeInfo from '../components/popup/BadgeInfo';
// scss
import '../scss/teamBadge.scss';

const InviteList = (props) => {
  const history = useHistory();
  const context = useContext(Context);
  const [badgePop, setBadgePop] = useState(false);

  const clickPopup = () => {
    setBadgePop(!badgePop);
  };

  const onClickBadge = () => {
    setBadgePop(true);
  };
  
  // 페이지 시작
  return (
    <div id="teamBadge">
      <Header title="팀명들어가는곳" type="back" />
      <CntWrapper>
        <div className="text">
          {true ?
            <div>
              팀 화면에 보여질 대표배지를 설정할 수 있습니다.
              <button>설정</button>
            </div>
            :
            <div className="set">
              우리팀을 대표할 배지를 선택하세요.(최대 4개)<br/>
              대표배지는 선택된 순서로 노출됩니다.
            </div>
          }
        </div>
        <div className="title">활동 배지<span><strong>0</strong>/4</span></div>
        <section className="badgeList">
          <label className="badgeItem" onClick={onClickBadge}>
            <img src={`${IMG_SERVER}/team/badge/a002.png`} alt="" />
            {true &&
              <div className="checkboxLabel">
                <input type="checkbox" className="blind" />
                <div className="checkBox"></div>
              </div>
            }
          </label>
        </section>
        {true &&
          <section className="buttonWrap">
            <SubmitBtn text="완료"/>
          </section>
        }
      </CntWrapper>
      {badgePop &&
        <LayerPopup setPopup={setBadgePop}>
          <BadgeInfo closePop={clickPopup} />
        </LayerPopup>
      }
    </div>
  )
}

export default InviteList;