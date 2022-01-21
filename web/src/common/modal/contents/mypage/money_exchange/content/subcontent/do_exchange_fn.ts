export function Inspection({ state, type, currentByeol }): { status: boolean; content: string; skip?: boolean } {
  // console.log(state);
  if (type === 1) {
    if (state.byeolCnt < 570) {
      return {
        status: false,
        content: "환전 신청별은\n최소 570개 이상이어야 합니다.",
      };
    }
    if (state.byeolCnt > currentByeol) {
      return {
        status: false,
        content: "환전 신청별은\n보유 별보다 작거나 같아야 합니다.",
      };
    }
    return {
      status: true,
      content: "",
    };
  } else {
    if (state.noUsage) {
      return {
        status: false,
        content: "",
        skip: true,
      };
    } else if (state.byeolCnt < 570) {
      return {
        status: false,
        content: "환전 신청별은\n최소 570개 이상이어야 합니다.",
      };
    }
    if (state.byeolCnt > currentByeol) {
      return {
        status: false,
        content: "환전 신청별은\n보유 별보다 작거나 같아야 합니다.",
      };
    }
    if (state.name === "" || state.name.length < 2) {
      return {
        status: false,
        content: "예금주 성명을\n정확하게 입력해주세요.",
      };
    }
    if (state.selectBank === "0" || state.selectBank === 0) {
      return {
        status: false,
        content: "입금 받으실 은행을\n선택해주세요.",
      };
    }
    if (state.account === 0 || state.account.toString().length < 10) {
      return {
        status: false,
        content: "입금 받으실 은행의\n계좌번호를 확인해주세요.",
      };
    }
    if (state.fSocialNo === "" || state.fSocialNo.length < 6 || state.bSocialNo === "" || state.bSocialNo.length < 7) {
      return {
        status: false,
        content: "주민등록번호를 확인해주세요.",
      };
    }
    if (state.phone === "") {
      return {
        status: false,
        content: "연락 받으실 전화번호를\n입력해주세요.",
      };
    }
    if (state.phone.toString().length < 9) {
      return {
        status: false,
        content: "전화번호를 확인해주세요.",
      };
    }
    if (state.fAddress === "") {
      return {
        status: false,
        content: "주소를 정확하게\n입력해주세요.",
      };
    }

    if (state.files[0] === false) {
      return {
        status: false,
        content: "신분증 사본을 등록해주세요.",
      };
    }
    if (state.files[1] === false) {
      return {
        status: false,
        content: "통장 사본을 등록해주세요.",
      };
    }
    if (state.consent && state.files[2] === false) {
      return {
        status: false,
        content: "가족관계 증명서 또는\n주민등록 등본 사본을 등록해주세요.",
      };
    }

    if (!state.check) {
      return {
        status: false,
        content: "개인정보 수집 및 이용에\n동의하셔야 환전 신청이 가능합니다.",
      };
    }

    return {
      status: true,
      content: "",
    };
  }
}
