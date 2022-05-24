import React from 'react'
import {setSubTab} from "redux/actions/rank";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";

const MyRanking = (props) => {
  const {data} = props
  const history = useHistory();
  const dispatch = useDispatch();

  const goRankingDetailPage = (e) => {
    const { target } = e.currentTarget.dataset;
    history.push(`/rank/${target}`);
    dispatch(setSubTab(target));
  }

  return (
    <ul className='rankBox'>
      <li data-target="DJ" onClick={goRankingDetailPage}>
        <p className='rankCategory'>DJ</p>
        <p className='rankData'>{data.dj !== 0 ? data.dj : "-"}</p>
        <p className='rankDaily'>daily</p>
      </li>
      <li data-target="FAN" onClick={goRankingDetailPage}>
        <p className='rankCategory'>FAN</p>
        <p className='rankData'>{data.fan !== 0 ? data.fan : "-"}</p>
        <p className='rankDaily'>daily</p>
      </li>
      <li data-target="CUPID" onClick={goRankingDetailPage}>
        <p className='rankCategory'>CUPID</p>
        <p className='rankData'>{data.cupid !== 0 ? data.cupid : "-"}</p>
        <p className='rankDaily'>daily</p>
      </li>
      <li data-target="TEAM" onClick={goRankingDetailPage}>
        <p className='rankCategory'>TEAM</p>
        <p className='rankData'>{data.team !== 0 ? data.team : "-"}</p>
        <p className='rankDaily'>weekly</p>
      </li>
    </ul>
  )
}

export default MyRanking
