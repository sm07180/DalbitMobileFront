import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from "context";

export default (props) => {
  const history = useHistory();
  const context = useContext(Context);
  const {scrollOn} = props;

  const goEventPage = () => {
    if (!context.token.isLogin) {
      history.push('/login')
      return;
    }

    history.push('/event/draw');
  };

  return (
    <div className={`eventFloat draw ${scrollOn === true ? '' : 'low'}`} onClick={goEventPage}/>
  )
}
