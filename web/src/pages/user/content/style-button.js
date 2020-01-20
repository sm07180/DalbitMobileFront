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
        s_mem: 'g',
        s_id: '111851878962322049110',
        s_pwd: '1234',
        s_gender: 'm',
        s_nickNm: 'ho gyeom kim',
        i_birthYY: 1980,
        i_birthMM: 11,
        i_birthDD: 23,
        s_term1: 'y',
        s_term2: 'y',
        s_term3: 'y',
        s_name: '김호겸',
        i_os: 3
      }
    })
    setFetch(res)
    console.log(res)

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
