import React, {useState, useContext} from 'react'
import styled from 'styled-components'

import {osName, browserName} from 'react-device-detect'
//context
import Api from 'Context/api'

//context
import {Context} from 'Context'

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
        gender: props.gender,
        nickNm: props.loginNickNm,
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
  border-radius: 5px;
  background: #5a7eff;
  color: #fff;
  line-height: 50px;
`
