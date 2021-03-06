import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Header from "components/ui/header/Header";

import './style.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default (props) => {
  const {memNo} = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory()
  const [dueDate, setDueDate] = useState('') // 자동 탈퇴 일자
  const [longTermDate, setLongTermDate] = useState('') // 휴면 정책 시행 일자

  useEffect(() => {
    async function fetchData() {
      const {result, data, message} = await Api.getLongTermUser({memNo})
      if (result === 'success') {
        if (data) {
          setDueDate(data.dueDate)
          setLongTermDate(data.longTermDate)
        }
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.push('/login')
          }
        }))
      }
    }
    fetchData()
  }, [])
  return (
    <>
      <Header title="장기 미접속 회원 탈퇴 안내" type="back" />
      <div id="customerNotice">
        <p className="text">
          안녕하세요. 달라입니다.
          <br /> 달라는 개인정보 보호에 대한 강화 정책을 시행하기
          <br />
          위해 「 정보통신망 이용 촉진 및 개인 정보 보호 등에 관한
          <br /> 법률 제 29조」 에 의거하여,
          <strong>
            장기간 사용 이력이 확인되지
            <br />
            않는 회원님의 계정에 대해 회원 탈퇴 및 개인 정보 파기
          </strong>
          를<br /> 안내해 드립니다.
        </p>

        <ul className="point">
          <li>
            <strong className="tit">시행일자</strong> <strong className="color_red">{longTermDate}</strong>
          </li>
          <li>
            <strong className="tit">파기항목</strong>
            <span>
              회원가입 시 또는 회원정보 수정으로
              <br />
              수집하고 관리되는 모든 정보
            </span>
          </li>
          <li>
            <strong className="tit">관련법령</strong>
            <span className="color_red">
              정보통신망 제29조 2항 및 동법 시행
              <br /> 령 제16조
            </span>
          </li>
        </ul>

        <strong className="notice">자동 탈퇴를 원하지 않는 경우</strong>

        <div className="subNotice">
          <strong className="color_red">{dueDate} 00시 이전</strong>까지 달라 앱/웹에
          <strong> 1회 이상 로그인하시면 자동 탈퇴 회원 대상에서 제외</strong>됩니다.
        </div>


        <p className="checkText">
          ※ 회원 계정 삭제 후 서비스 재이용을 원하시는 경우에는 신규 회원가입을 통해서 이용이 가능합니다.
        </p>

        <button className="button" onClick={() => history.push('/login')}>
          달라 로그인하기
        </button>
      </div>
    </>
  )
}
