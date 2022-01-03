import React, {useEffect, useState, useContext} from 'react'
import Api from 'context/api'
import {authReq} from 'pages/self_auth'
import {Context} from 'context'

const ProfileSelfCheck = (props) => {
  const globalCtx = useContext(Context)
  const [authState, setAuthState] = useState(false)
  const [phone, setPhone] = useState('')

  const checkSelf = () => {
    Api.self_auth_check().then((res) => {
      const {result, data} = res
      if (result === 'success') {
        setAuthState(true)
        setPhone(data.phoneNo)
      } else {
        setAuthState(false)
      }
    })
  }

  useEffect(() => {
    checkSelf()
  }, [])

  return (
    <div className="inputBoxWrap">
      <div className="formInputBox sign hasBtn">
        <label className="inputBoxTitle" htmlFor="sign">
          본인인증
        </label>
        <input type="text" placeholder="본인인증을 해주세요." id="sign" className="writeInput" readOnly defaultValue={phone} />
        <button type="button" className="requestBtn" onClick={() => authReq('5', globalCtx.authRef, globalCtx)}>
          본인인증
        </button>
      </div>
      <p className={`formInputBoxResult ${authState ? '' : 'isWarning'}`}>
        {authState ? '본인인증이 완료 되었으며, 재 인증도 가능합니다.' : '본인인증을 완료하지 않으셨습니다.'}
      </p>
    </div>
  )
}

export default ProfileSelfCheck
