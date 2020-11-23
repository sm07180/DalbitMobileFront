import React, {useEffect, useState, useContext} from 'react'
// //components
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import './style.scss'
export default () => {
  const context = useContext(Context)
  const history = useHistory()
  return (
    <>
      <Layout>
        <Header title="휴면회원 안내" />
        <div id="customerClear">
          <div className="visual"></div>
          <strong className="title">회원님께서는 현재 휴면 상태입니다.</strong>

          <p className="text">
            저희 달빛라이브에서는 개인 정보 보호에 대한 강화 정책
            <br />을 시행하기 위해 「 정보통신망 이용 촉진 및 개인 정보 보호
            <br /> 등에 관한 법률 제 29조」에 의거하여,
            <b>
              장기간 사용 이력이
              <br /> 확인되지 않는 회원님께 사전 고지를 통해 재접속 요청하였으나
              <br />
              추가 사용이력이 확인되지 않아 휴면상태로 전환
            </b>
            되었습니다.
          </p>

          <strong className="point">
            휴면상태를 해제하고 서비스를 이용하려면
            <br /> <b>본인인증을 완료</b>해주세요.
          </strong>

          <span className="subText">※ 본인인증이 완료되면 자동 휴면 해제되어 기존 회원정보로 서비스 이용이 가능합니다.</span>

          <span className="subText">
            ※ 휴면전환 정책은 <button onClick={() => context.action.updatePopup('TERMS', 'service')}>이용약관</button>과
            <button onClick={() => context.action.updatePopup('TERMS', 'privacy')}>개인정보 취급방침</button>에 명시되어 있으며,
            해제를 하지 않으신 경우
            <strong>5년 후 자동 탈퇴 처리되어 보유하신 '달'과 '별'이 자동 소멸</strong>됩니다.
          </span>

          <button className="button" onClick={() => history.push('/login')}>
            본인인증 후 휴면 해제하기
          </button>
        </div>
      </Layout>
    </>
  )
}
