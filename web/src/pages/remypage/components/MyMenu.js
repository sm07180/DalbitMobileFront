import React from 'react'

import {useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {setNoticeTab} from "redux/actions/notice";
import {IMG_SERVER} from 'context/config';

const menuList = [
  {name: "내 지갑", path: "wallet"},
  {name: "팀", path: "team"},
  {name: "방송리포트", path: "report"},
  {name: "클립 관리", path: "myclip"},
  {name: "서비스 설정", path: "setting"},
  {name: "사연 보관함", path: "story"},
  {name: "공지사항", path: "notice"},
  {name: "고객센터", path: "customer"},
]

export const MenuList = (props) => {
  const {list, data, history, dispatch, alarmData} = props;

  // 마이 메뉴 onClick 액션
  const onClickFunc = (pathname) => {
    switch (pathname) {
      case "team":
        if (data.teamNo > 0) {
          history.push(`/team/detail/${data.teamNo}`)
        } else {
          history.push('/team')
        }
        break;
      case "notice":
        dispatch(setNoticeTab("공지사항"))
        history.push('/notice')
        break;
      default:
        history.push(`/${list.path}`)
        break;
    }
  }
  return (
    <div
      className='myMenuList'
      onClick={() => onClickFunc(list.path)}>
      {list.path.includes("team") ?
        <div className='icon team'>
          {data.bgCode === "" ?
            <div className={`empty ${data.new > 0 ? 'new' : ''}`} />
            :
            <>
              <img src={`${IMG_SERVER}/team/parts/B/${data.bgCode}.png`} />
              <img src={`${IMG_SERVER}/team/parts/E/${data.edgeCode}.png`} />
              <img src={`${IMG_SERVER}/team/parts/M/${data.medalCode}.png`} />
            </>
          }
        </div>
        :list.path.includes("notice") ?
          <div className={`icon notice ${alarmData.notice > 0 ? "new" : ""}`}/>
          :
          <div className={`icon ${list.path}`}/>
      }
      <p className="name">{list.name}</p>
    </div>
  )
}

const MyMenu = (props) => {
  const {data} = props;
  const history = useHistory()
  const dispatch = useDispatch();
  const alarmData = useSelector(state => state.newAlarm);

  return (
    <div className="myMenu">
      {menuList.map((item,index) => {
        return <MenuList list={item} data={data} key={index} alarmData={alarmData} history={history} dispatch={dispatch} />
      })}
    </div>
  )
}

export default MyMenu;
