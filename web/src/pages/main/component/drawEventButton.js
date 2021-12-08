import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'

export default (props) => {
  const history = useHistory();
  const {scrollOn} = props;

  const goEventPage = () => {
    history.push('/event/draw');
  };

  return (
    <div className={`eventFloat draw ${scrollOn === true ? '' : 'low'}`} onClick={goEventPage}/>
  )
}
