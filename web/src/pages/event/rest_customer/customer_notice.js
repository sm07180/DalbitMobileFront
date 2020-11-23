import React from 'react'
// //components
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

export default () => {
  return (
    <>
      <Header title="장기 미접속 회원 탈퇴 안내" />
      <div id="customerNotice">
        <p className="text">
          안녕하세요. 달빛라이브입니다. 달빛라이브는 개인정보 보호에 대한 강화 정책을 시행하기위해 「 정보통신망 이용 촉진 및 개인
          정보 보호 등에 관한 법률 제 29조」 에 의거하여,
          <b>장기간 사용 이력이 확인되지 않는 회원님의 계정에 대해 회원 탈퇴 및 개인 정보 파기</b>를 안내해 드립니다.
        </p>

        <ul className="point">
          <li>
            <b>시행일자</b> <strong className="color_red">2020년 12월 23일 (수)</strong>
          </li>
          <li>
            <b>파기항목</b>
            <span>
              회원가입 시 또는 회원정보 수정으로
              <br />
              수집하고 관리되는 모든 정보
            </span>
          </li>
          <li>
            <b>관련법령</b>
            <span className="color_purple">
              정보통신망 제29조 2항 및 동법 시행
              <br /> 령 제16조
            </span>
          </li>
        </ul>
      </div>
    </>
  )
}
