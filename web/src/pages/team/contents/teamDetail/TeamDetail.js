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
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide';
import LayerPop from 'components/ui/layerPopup/LayerPopup';
// components
import BadgeLive from '../../components/BadgeLive';
import Secession from '../../components/popup/Secession';
import Invite from '../../components/popup/Invite';
import Benefits from '../../components/popup/Benefits';
// redux
import {useDispatch, useSelector} from "react-redux";
import {setCommonPopupOpenData} from "redux/actions/common";

import "../../scss/inviteList.scss";
import "../../scss/teamDetail.scss";

const TeamDetail = () => {
  const history = useHistory();
  const context = useContext(Context);
  const dispatch = useDispatch();
  const popup = useSelector(state => state.popup);

  const [moreShow, setMoreShow] = useState(false);
  const [benefitsPop, setBenefitsPop] = useState(false);

  // test로 넣음 : 팀리더 여부
  const teamLeader = true;

  // 초대하기 팝업
  const invitePopup = () => {
    dispatch(setCommonPopupOpenData({...popup, slidePopup: true}));
  };

  /***  더보기 관련 ***/
  const clickMoreBtn = () => {
    setMoreShow(!moreShow);
  };
  // 혜택 팝업
  const clickBenefits = () => {
    setBenefitsPop(!benefitsPop);
  };
  // 관리 팝업

  // 탈퇴 팝업
  const clickSecession = () => {
    if (teamLeader === true) {
      dispatch(setCommonPopupOpenData({...popup, commonPopup: true}));
    } else {
      context.action.confirm({
        msg: `정말 탈퇴 할까요?`,
        remsg: `탈퇴 이후 팀이 랭킹에 오르더라도
        리워드를 받을 수 없으며, 탈퇴 이후 재가입 할 경우
        기여도는 복원되지 않습니다.`,
        buttonText: {
          left: '취소',
          right: '완료'
        },
        callback: () => {
          console.log('secession');
        }
      });
    }
  };
  const closeSecesstion = () => {
    closePopup(dispatch);
  };

  // 팀 삭제
  const teamDelete = () => {
    context.action.confirm({
      msg: `삭제하면 72시간 이후부터
      팀을 만들 수 있습니다.`,
      remsg: `삭제한 이후에는 팀 랭킹 리워드를
      받을 수 없으며 삭제된 정보는 복구되지 않습니다.`,
      buttonText: {
        left: '취소',
        right: '삭제'
      },
      callback: () => {
        console.log('delete');
      }
    });
  };

  // 가입신청 수락 거절
  const teamConfirm = (e) => {
    const {targetConfirm} = e.currentTarget.dataset;

    if (targetConfirm === 'cancel') {
      context.action.confirm({
        msg: `정말 거절 할까요?`,
        buttonText: {
          left: '취소',
          right: '거절할게요'
        },
        callback: () => {
          console.log('cancel');
        }
      });
    } else if (targetConfirm === 'accept') {
      context.action.confirm({
        msg: `수락을 누르면 팀원으로 가입합니다.`,
        buttonText: {
          left: '취소',
          right: '수락할게요!'
        },
        callback: () => {
          console.log('accept');
        }
      });
    }
  };

  // 페이지 시작
  return (
    <div id="teamDetail">
      <Header title="팀" type="back">
        <div className="buttonGroup">
          <div className="moreBtn" onClick={clickMoreBtn}>
            <img src="https://image.dalbitlive.com/common/header/icoMore-b.png" alt="" />
            {moreShow &&
              <div className="isMore">
                <button onClick={clickBenefits}>팀 혜택</button>
                <button>팀 관리</button>
                <button onClick={clickSecession}>팀 탈퇴하기</button>
                <button className="delete" onClick={teamDelete}>팀 삭제하기</button>
              </div>
            }
          </div>
          <button className="question" onClick={clickBenefits}>?</button>
        </div>
      </Header>
      <CntWrapper>
        <section className="teamInfo">
          <div className="teamStatus">
            <div className="teamSymbol">
              <div className="parts-C">
                <img src={"https://image.dalbitlive.com/team/parts/C-9.png"} />
                <div className="parts-B">
                  <img src={"https://image.dalbitlive.com/team/parts/B-7.png"} />
                </div>
                <div className="parts-A">
                  <img src={"https://image.dalbitlive.com/team/parts/A-7.png"} />
                </div>
              </div>
            </div>
            <div className="listContent">
              <div className="teamName">우주최강슈퍼파월</div>
              <div className="listItem">
                <div className="iconPoint"></div>
                <div className="point">{Utility.addComma(123456789)}</div>
              </div>
            </div>
          </div>
          <div className="teamRank">
            <div className="count">{Utility.addComma(123456789)}</div>
            <div className="text">이번 주 TOP</div>
          </div>
          <div className="teamIntro">
            <span className={`text ${true ? 'open' : 'close'}`}>
              우리는 우주최강슈퍼파워 입니다. 소개가 길
            </span>
            <span className="arrow">
              <img src={`${IMG_SERVER}/common/arrow/grayArrow-${true ? 'up' : 'down'}.png`} alt="" />
            </span>
          </div>
        </section>
        <CntTitle title="활동 배지" more={'/'}>
          <span className="count"><strong>6</strong></span>
        </CntTitle>
        <section className="badgeList">
          <div className="badgeItem">
            <img src={`${IMG_SERVER}/team/teambadge/teamBadge-1.png`} alt="" />
          </div>
          <div className="badgeItem">
            <img src={`${IMG_SERVER}/team/teambadge/teamBadge-2.png`} alt="" />
          </div>
          <div className="badgeItem">
            <img src={`${IMG_SERVER}/team/teambadge/teamBadge-3.png`} alt="" />
          </div>
          <div className="badgeItem">
            <img src={`${IMG_SERVER}/team/teambadge/teamBadge-4.png`} alt="" />
          </div>
        </section>
        <CntTitle title="전체 멤버">
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
              <BadgeLive />
            </div>
          </ListRow>
          <div className="listRow invite" onClick={invitePopup}>
            <div className="photo">+</div>
            <div className="text">초대하기</div>
          </div>
        </section>
        <CntTitle title="가입 신청">
          <span className="count"><strong>6</strong></span>
        </CntTitle>
        <section className="joinList">
          <ListRow photo="" photoClick={() => photoClick()}>
            <div className="listContent">
              <div className="listItem">
                <div className="nick">🍓딸기딸기🍓</div>
              </div>
              <div className="listItem">
                <div className="time">2022-06-23 19:23</div>
              </div>
            </div>
            <div className="listBack">
              <div className="buttonGroup">
                <button className="cancel" data-target-confirm="cancel" onClick={teamConfirm}>거절</button>
                <button className="accept" data-target-confirm="accept" onClick={teamConfirm}>수락</button>
              </div>
            </div>
          </ListRow>
        </section>
        <section className="buttonWrap">
          <SubmitBtn text="가입신청" state="disabled" />
        </section>
      </CntWrapper>

      {/* 팀장이 탈퇴 시 슬라이드 팝업 */}
      {popup.commonPopup &&
        <PopSlide title="다음 팀장은 누구인가요?">
          <Secession closeSlide={closeSecesstion} />
        </PopSlide>
      }

      {/* 초대하기 슬라이드 팝업 */}
      {popup.slidePopup &&
        <PopSlide title="팀원 초대">
          <Invite closeSlide={closeSecesstion} />
        </PopSlide>
      }

      {/* 팀 혜택 팝업 */}
      {benefitsPop &&
        <LayerPop setPopup={clickBenefits} close={false}>
          <Benefits closePopup={clickBenefits} />
        </LayerPop>
      }
    </div>
  )
}

export default TeamDetail;
