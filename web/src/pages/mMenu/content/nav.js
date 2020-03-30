import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

// component
import Header from '../component/header.js'

// static
import Home from '../static/ic_home.svg'
import Setting from '../static/ic_setting.svg'

export default props => {
  return (
    <div>
      <Header>
        <img src={Home} />
        <img src={Setting} />
      </Header>
    </div>
  )
}
