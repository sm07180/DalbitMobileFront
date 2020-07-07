import React, {useEffect} from 'react'
import styled from 'styled-components'

// static
import NoResultIcon from 'components/ui/ic_noResult.svg'

export default props => {
  useEffect(() => {}, [])

  return (
    <NoResult>
      <img src={NoResultIcon} />
      <div className="text">조회 된 결과가 없습니다.</div>
    </NoResult>
  )
}

const NoResult = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 100px 0;

  img {
    display: block;
  }

  .text {
    margin-top: 9.7px;
    width: 110px;
    text-align: center;
    color: #757575;
    word-break: keep-all;
    font-size: 14px;
    letter-spacing: -0.35px;
  }
`
