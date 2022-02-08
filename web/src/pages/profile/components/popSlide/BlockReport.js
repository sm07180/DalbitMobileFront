import React, {useState, useEffect, useRef} from 'react'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
import moment from 'moment'
// global components
import TabBtn from 'components/ui/tabBtn/TabBtn'
import ListRow from 'components/ui/listRow/ListRow'
// components
import Tabmenu from '../Tabmenu'

import './blockReport.scss'

const PopRelation = (props) => {
  const {type} = props
  const tabMenuRef = useRef();
  const [showList, setShowList] = useState([]);
  const [fanStarLikeState, setFanStarLikeState] = useState({type: '', title: '', tab: [], subTab: []});
  
  // 팬 조회

  // 스와이퍼
  const swiperProps = {
    slidesPerView: 'auto',
  }

  useEffect(() => {
    
  },[])

  return (
    <section className="blockReport">
      
    </section>
  )
}

export default PopRelation
