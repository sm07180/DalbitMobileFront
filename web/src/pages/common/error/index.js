/**
 * @title error페이지
 */
import {React, useContext} from 'react'
import 'styles/errorstyle.scss'
import {Context} from 'context'
import Api from 'context/api'
export default () => {
  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)
  console.log(customHeader.os)
  const roots = () => {
    let osType = customHeader.os // os : 1(Aos) , 2(ios)
  }
  return (
    <>
      <section>
        <ul>
          <li className="logoImg">로고이미지</li>
          <li className="errorTitle">에러 ERROR</li>
          <li className="details">
            죄송합니다.
            <br /> 서비스 이용에 불편을 드려 죄송합니다.
            <br /> 잠시 후 다시 시도해 주시기 바랍니다.
          </li>
          <li className="btn">
            <a href="/">확인</a>
          </li>
          <li className="bottomImg">하단이미지</li>
        </ul>
      </section>
    </>
  )
}
