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
  
  async function fetchData(obj) {
    //console.log(JSON.stringify(obj))
    console.log('----')

    const res = await Api.member_join({
      data: {
        memType: 'g',
        memId: '111851878962322049110',
        memPwd: '1234',
        gender: 'm',
        nickNm: 'ho gyeom kim',
        birthYY: 1980,
        birthMM: 11,
        birthDD: 23,
        term1: 'y',
        term2: 'y',
        term3: 'y',
        name: '김호겸',
        os: 3
      }
    })
    setFtch(res)
    consle.log(res)

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
          console.log('회원가입이야 ')
          console.log(props.text)
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
