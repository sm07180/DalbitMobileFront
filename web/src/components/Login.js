import React, {useEffect, useState, Component} from 'react'
import {GoogleLogin} from 'react-google-login'
import KakaoLogin from 'react-kakao-login'
import styled from 'styled-components'

export default () => {
  return
  ;<GoogleLogin clienrId={process.env.REACT_APP_Goolgle} buttonText="Google" onSuccess={'성공'} onFailure={'실패'} />
}
