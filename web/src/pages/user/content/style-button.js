import React, {useState, useContext} from 'react'
import styled from 'styled-components'

import {osName, browserName} from 'react-device-detect'
//context
import Api from 'context/api'
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'context/color'

//context
import {Context} from 'context'

export default props => {
  //---------------------------------------------------------------------
  const [fetch, setFetch] = useState(null)

  const context = useContext(Context)

  async function fetchData() {
    //console.log(JSON.stringify(obj))
    console.log('회원가입 버튼 클릭 = ' + JSON.stringify(props))
    console.log('----')

    const res = await Api.member_join({
      data: {
        memType: 'g',
        memId: props.loginID,
        //gender: props.gender,
        gender: 'm',
        //nickNm: props.loginNickNm,
        nickNm: '구렌나루',
        birthYY: 2020,
        birthMM: 10,
        birthDD: 10,
        term1: 'y',
        term2: 'y',
        term3: 'y',
        name: props.loginName,
        os: 3
      }
    })
    setFetch(res)
    console.log('회원가입 = ' + JSON.stringify(res))
    if (res && res.code) {
      if (res.code == 0) {
        alert(res.message)
        window.location.href = '/' // 홈페이지로 새로고침
      } else {
        alert(res.message)
      }
    }
  }
  //---------------------------------------------------------------------
  return (
    <>
      <Button
        onClick={() => {
          if (props.text !== '회원가입 완료') {
            props.update('step-two')
          } else {
            fetchData()
          }
        }}>
        {props.text || '버튼'}
      </Button>
    </>
  )
}
//---------------------------------------------------------------------
const Button = styled.button`
  display: block;
  width: 100%;
  margin-top: 30px;
  background: ${COLOR_MAIN};
  color: #fff;
  line-height: 50px;
`
