/**
 * @file /user/content/selfAuth.js
 * @brief 본인인증 페이지
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Api from 'context/api'

//context
import _ from 'lodash'
import Utility from 'components/lib/utility'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//hook
import useChange from 'components/hooks/useChange'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  //hooks
  const {changes, setChanges, onChange} = useChange(update, {onChange: -1})

  //update
  function update(mode) {
    switch (true) {
      case mode.onChange !== undefined:
        console.log(JSON.stringify(changes))
        break
    }
  }

  async function authCheck(rec, num) {
    const res = await Api.self_auth_check({})
  }

  async function authRes(rec, num) {
    const res = await Api.self_auth_res({
      data: {
        rec_cert: rec,
        certNum: num
      }
    })
    if (res.result == 'success' && res.code == '0') {
      //자식 창으로 성공했다는 값 넘겨주기
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  useEffect(() => {
    console.log(document.getElementsByName('rec_cert').value)
    console.log(document.getElementsByName('certNum').value)

    const rec = document.getElementsByName('rec_cert').value
    const num = document.getElementsByName('certNum').value
    authRes(rec, num)
  }, [])

  //---------------------------------------------------------------------
  return (
    <Content>
      [복호화 하기전 수신값]: <input type="text" name="rec_cert" id="rec_cert" onChange={onChange} />
      [수신한 요청번호]: <input type="text" name="certNum" id="certNum" onChange={onChange} />
    </Content>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div``
