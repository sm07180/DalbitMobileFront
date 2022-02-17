import React, {useContext, useEffect} from 'react'
//context
import {SecssionStore} from '../store'
//components
import Exit from './exit'
import Header from 'components/ui/new_header.js'
import {useDispatch, useSelector} from "react-redux";

//
const Index = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const store = useContext(SecssionStore)
  Index.store = store
  //---------------------------------------------------------------------

  useEffect(() => {
    if (globalState.token.isLogin === false) {
      location.href = '/'
    }
  }, [globalState.token.isLogin])
  return (
    <>
      {globalState.token.isLogin === true && (
        <>
          <Header title="회원탈퇴"/>
          <Exit/>
        </>
      )}
    </>
  )
}
export default Index
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
