import React  from 'react'
import { useHistory } from "react-router-dom";

const ClipSubTitle = (props) => {
  const {title,more,children} = props
  const history = useHistory();

  const onMoreClick = () => {
    history.push(`/${more}`)
  }

  return (
    <div className="subTitle">
      <h3>{title}</h3>
      {children}
      {more &&
        <button onClick={onMoreClick}>더보기</button>
      }
    </div>
  )
}

export default ClipSubTitle
