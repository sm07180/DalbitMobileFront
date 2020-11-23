import React from 'react'
// //components
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
import {useHistory} from 'react-router-dom'
import './style.scss'

export default () => {
  const history = useHistory()
  return (
    <>
      <Layout>
        <Header title="장기 미접속 회원 휴면회원 전환 안내" />
        <div id="customerOut">
          <p className="text">
            안녕하세요. 달빛라이브입니다.
            <br />
            달빛라이브는 개인정보 보호에 대한 강화 정책을 시행하기
            <br />
            위해 「 정보통신망 이용 촉진 및 개인 정보 보호 등에 관한
            <br />
            법률 제 29조」 에 의거하여,
            <b>
              장기간 사용 이력이 확인되지
              <br /> 않는 회원님의 계정에 대해 휴면전환
            </b>
            을 안내해 드립니다.
          </p>

          <ul className="point">
            <li>
              <b>시행일자</b> <strong className="color_red">2020년 12월 23일 (수)</strong>
            </li>
            <li>
              <b>보관항목</b>
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

          <strong className="notice">휴면 전환을 원하지 않는 경우</strong>

          <div className="subNotice">
            <b className="color_red"> 2020년 12월 22일(화) 00시 이전</b>까지 까지 달빛라이브 앱/웹
            <br />에 <b>이상 로그인하시면 자동 휴면전환 회원 대상에서 제외</b>됩니다
          </div>

          <p className="checkText">
            ※ 회원 계정 삭제 후 서비스 재이용을 원하시는 경우에는 신규 회원가입을 통해서 이용이 가능합니다.
          </p>

          <button className="button" onClick={() => history.push('/login')}>
            달빛라이브 로그인하기
          </button>
        </div>
      </Layout>
    </>
  )
}
