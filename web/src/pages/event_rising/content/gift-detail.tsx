import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import "../event_rising.scss";

export default function eventDetail() {
  const history = useHistory();

  const [draging, setDraging] = useState({
    down: false,
    move: false,
  });

  return (
    <div className="event_rising_modal">
      <button
        className="btn_close"
        onClick={() => {
          if (draging.move === true) {
            setDraging({
              move: false,
              down: false,
            });
          } else {
            history.push(sessionStorage.getItem("modal_previous_path")!);
          }
        }}
      >
        팝업닫기
      </button>

      <h2>경품 상세 소개</h2>

      <h3>{"<경품 상세 소개>"}</h3>
      <p>
        1) LG 울트라 노트북 15U50N-KR56K 112만원 <br />
        2) 오디오인터페이스 + 고급마이크 세트 50만원
        <br />
        ※ 야마하 AG06 + 오디오테크니카 AT2020 + 관절스탠드
        <br />
        3) 삼성 JBL PULSE4 블루투스스피커 라이트쇼 22만원
        <br />
        4) LG 시네빔 HF60LA 리얼 풀HD 홈프로젝터 104만원
        <br />
        5) LG 울트라PC 15U490-GR36K 64만원 <br />
        6) 에어팟 프로 33만원
      </p>

      <h3>{"<이벤트 유의사항>"}</h3>

      <ul>
        <li>가격은 정품 사이트 정품가격을 기준으로 합니다.</li>
        <li>현저한 가격변동이 있는 경우 대체상품으로 지급됩니다.</li>
      </ul>
    </div>
  );
}
