/**
 * @title error페이지
 */
import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import 'styles/errorstyle.scss'

export default () => {
  let history = useHistory()
  return (
    <section id="error">
      <button
        className="closeButon"
        onClick={() => {
          history.goBack()
        }}>
        닫기
      </button>

      <div className="img"></div>

      <h3 className="title">에러 ERROR</h3>
      <p className="text">
        죄송합니다.
        <br />
        서비스 이용에 불편을 드려 죄송합니다.
        <br />
        잠시 후 다시 시도해 주시기 바랍니다.
      </p>

      <div className="buttonWrap">
        <button
          onClick={() => {
            history.goBack()
          }}>
          이전
        </button>
        <button
          onClick={() => {
            history.push('/')
          }}>
          확인
        </button>
      </div>
    </section>
  )
}
