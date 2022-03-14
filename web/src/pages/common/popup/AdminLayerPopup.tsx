import React, { useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GlobalContext } from "context";

import LayerPopup from "components/ui/layerPopup/LayerPopup";

import './adminLayerPopup.scss'

const AdminLayerPopup = (props: any)=> {
  const [popup, setPopup] = useState(false);
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  const popupClose = () => {
    globalAction.setBroadcastAdminLayer!((prevState) => ({
      ...prevState,
      status: false,
      roomNo: "",
      nickNm: "",
    }));
  };

  const closePopupDim = (e) => {
    const target = e.target;
    if (target.id === "layerPop") {
      popupClose();
    }
  };

  const sanctionPop = () => {
    setPopup(true);
  }

  //clip Link
  const broadCastLink = (type: string) => {
    if (type === "admin") {
      globalAction.setShadowAdmin!(1);
      popupClose();
      if (globalState.inBroadcast) {
        window.location.href = `/broadcast/${globalState.broadcastAdminLayer.roomNo}`;
        setTimeout(() => {
          globalAction.setInBroadcast!(false);
        }, 10);
      } else {
        history.push(`/broadcast/${globalState.broadcastAdminLayer.roomNo}`);
      }
    } else {
      globalAction.setShadowAdmin!(0);
      popupClose();
      if (globalState.inBroadcast) {
        window.location.href = `/broadcast/${globalState.broadcastAdminLayer.roomNo}`;
        setTimeout(() => {
          globalAction.setInBroadcast!(false);
        }, 10);
      } else {
        history.push(`/broadcast/${globalState.broadcastAdminLayer.roomNo}`);
      }
    }
  };


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <>
      <div id="layerAdminPop" onClick={closePopupDim}>
        <div className="popLayer">
          <div className="management">
            <span className="sanctionBtn" onClick={sanctionPop}>제재하기</span>
          </div>
          <div className="popContainer">
            <div className="adminContent">
              {globalState.broadcastAdminLayer.nickNm === "" ? (
                <h3>관리자로 입장하시겠습니까?</h3>
              ) : (
                <h3>
                  <b>{globalState.broadcastAdminLayer.nickNm}</b> 님의 <br /> 방송방에 입장하시겠습니까?
                </h3>
              )}
            </div>
            <div className="enterWrap">
              <button className="enterBtn normal" onClick={() => broadCastLink("normal")}>시청자 모드</button>
              <button className="enterBtn admin" onClick={() => broadCastLink("admin")}>관리자 모드</button>
              <button className="enterBtn destroy">방송방 삭제하기</button>
            </div>
          </div>
          <div className='closeWrap'>
            <button className='close'onClick={popupClose}>닫기</button>
          </div>
        </div>
      </div>
      {
        popup &&
          <LayerPopup title="신고조치" setPopup={setPopup}>
            <div className="sanctionContent">
              <section className="sanctionWrap">
                <div className="sanctionTitle">차단 유형</div>
                <div className="sanctionListWrap">
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>회원번호</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>deviceUuid</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>접속아이피</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>휴대폰번호</p>
                    </label>
                  </div>
                </div>
              </section>
              <section className="sanctionWrap">
                <div className="sanctionTitle">제재 조치</div>
                <div className="sanctionListWrap">
                  <div className="sanctionlist">
                    <label className="radioLabel">
                      <input type="radio" name="sanction" className="blind"/>
                      <span className="radioIcon"></span>
                      <p>경고</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="radioLabel">
                      <input type="radio" name="sanction" className="blind"/>
                      <span className="radioIcon"></span>
                      <p>1일정지</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="radioLabel">
                      <input type="radio" name="sanction" className="blind"/>
                      <span className="radioIcon"></span>
                      <p>3일정지</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="radioLabel">
                      <input type="radio" name="sanction" className="blind"/>
                      <span className="radioIcon"></span>
                      <p>7일정지</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="radioLabel">
                      <input type="radio" name="sanction" className="blind"/>
                      <span className="radioIcon"></span>
                      <p>영구정지</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="radioLabel">
                      <input type="radio" name="sanction" className="blind"/>
                      <span className="radioIcon"></span>
                      <p>강제탈퇴</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="radioLabel">
                      <input type="radio" name="sanction" className="blind"/>
                      <span className="radioIcon"></span>
                      <p>임시정지</p>
                    </label>
                  </div>
                </div>
              </section>
              <section className="sanctionWrap">
                <div className="sanctionTitle">제재 사유 선택</div>
                <div className="sanctionListWrap">
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>음란, 미풍양속 위배 행위</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>지나치게 과도한 욕설과 부적절한 언어를 사용하는 행위</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>지나치게 과도한 폭력, 위협, 혐오, 잔혹한 행위 또는 묘사</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>불법성 행위 또는 조장</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>청소년 유해 활동</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>동일한 내용을 반복적으로 등록 (도배)</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>상업적 또는 홍보/광고, 악의적인 목적으로 서비스 가입/활동</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>차별/갈등 조장 활동 (성별,종교,장애,연령,인종,지역,직업 등)</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>서비스 명칭 또는 운영진을 사칭하여 타인을 속이거나 피해와 혼란을 주는 행위</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>타인의 개인정보 및 계정, 기기를 도용/탈취하여 서비스를 이용 하는 행위</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>타인의 권리침해 및 명예훼손</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>다수의 계정을 이용한 어뷰징 활동</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>서비스 내 현금 거래</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>고의적인 서비스 운영 방해</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>연령제한으로 인한 한시적 제재조치</p>
                    </label>
                  </div>
                  <div className="sanctionlist">
                    <label className="checkBoxLabel">
                      <input type="checkbox" name="blockType" className="blind"/>
                      <span className="checkIcon"></span>
                      <p>서비스 자체 기준 위반</p>
                    </label>
                  </div>                
                </div>
              </section>
            </div>
            <div className="btnWrap">
              <button className="confirmBtn">확인</button>
              <button className="messageBtn">확인 및 메시지 발송</button>
            </div>         
          </LayerPopup>
      }
    </>
         
  );
};
export default  AdminLayerPopup
