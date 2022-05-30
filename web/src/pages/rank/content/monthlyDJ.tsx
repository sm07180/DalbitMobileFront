import React, {useState} from "react";

export default function MonthlyDJ() {

    const [tooltipPop, setTooltipPop] = useState(false);
    const togglePopup = () => {
        setTooltipPop(!tooltipPop);
    };

  return (
    <div className="monthlyDJWrap">
        <div className="monthlyDJ">
            <div className="monthlyDJ__contentWrap">
                <div className="monthlyDJ__content-title">
                 🎤 월간 DJ랭킹 혜택!
                </div>
                <div className="monthlyDJ__content">
                    랭킹 5위까지 전체 회원 대상 푸시 발송 지원
                </div>
            </div>
            <div className="btn" onClick={togglePopup}>
                자세히
                {tooltipPop && (
                    <div className="monthlyDJ__tooltip">
                        랭킹 5위까지 최종 선정된 DJ는<br/>
                        <span className="monthlyDJ__tooltip-strong">전체 회원 대상 푸시를 1회</span> 보낼 수 있습니다. 1:1문의를
                        통해 신청 가능하며 자세한 내용은 공지사항을 확인하세요.
                        <img className="monthlyDJ__tooltip-btnClose" onClick={togglePopup} src="https://image.dallalive.com/svg/close_g_l.svg" alt="닫기" />
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
