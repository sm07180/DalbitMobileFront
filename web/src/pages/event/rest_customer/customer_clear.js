import React from 'react'
// //components
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

export default () => {
  return (
    <>
      <Header title="휴면회원 안내" />
      <div id="customerNotice">
        <p className="text">
          저희 달빛라이브에서는 개인 정보 보호에 대한 강화 정책을 시행하기 위해 「 정보통신망 이용 촉진 및 개인 정보 보호 등에
          관한 법률 제 29조」에 의거하여,
          <strong>
            장기간 사용 이력이 확인되지 않는 회원님께 사전 고지를 통해 재접속 요청하였으나 추가 사용이력이 확인되지 않아
            휴면상태로 전환
          </strong>
          되었습니다.
        </p>
      </div>
    </>
  )
}
