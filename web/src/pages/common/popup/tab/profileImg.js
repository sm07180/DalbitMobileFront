import React from 'react'
import styled from 'styled-components'

const Img = props => {
  return <ProfileImg width={props.width} height={props.height} src={props.src} marginLeft={props.marginLeft} marginRight={props.marginRight} />
}

const ProfileImg = styled.div`
  display: flex;
  width: ${props => (props.width ? props.width.toString() + 'px' : '40px')};
  height: ${props => (props.height ? props.height.toString() + 'px' : '40px')};
  border-radius: 75px;
  background: url(${props => (props.src ? props.src : '')}) no-repeat;
  margin-left: ${props => (props.marginLeft ? props.marginLeft.toString() + 'px' : '0px')};
  margin-right: ${props => (props.marginRight ? props.marginRight.toString() + 'px' : '0px')};
`

export {Img}
