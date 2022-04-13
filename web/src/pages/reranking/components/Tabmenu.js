import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
// global components
import TabBtn from './TabBtn'


const Tabmenu = (props) => {
  const {data, tab, setTab} = props
  const [activeWidth, setActiveWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLeft, setActiveLeft] = useState(0);
  const [param, setParam] = useState("");
  const tabWrap = useRef();
  const params = useParams();

  useEffect(() => {
    const children =  tabWrap.current.firstChild;
    setActiveWidth(children.offsetWidth);
    setParam(params.type);
  }, [data])

  useEffect(() => {
    setActiveIndex(Array.from(document.querySelectorAll('.tabList')).indexOf(document.querySelector('.tabActive')));
  }, [tab, param])

  useEffect(() => {
    const tabmenuWidth =  tabWrap.current.offsetWidth;
    const childrenLength =  document.getElementsByClassName('tabList').length;
    if(childrenLength !== 0){
      setActiveLeft(tabmenuWidth / childrenLength * activeIndex);
    }
  }, [activeIndex, activeWidth])

  return (
    <ul className="tabmenu" ref={tabWrap}>
      {data.map((data,index) => {
        const param = {
          item: data,
          tab: tab,
          setTab: setTab,
        }
        return (
          <TabBtn param={param} key={index}/>
        )
      })}
      <div className={`underline`}></div>
      {/* <div className="underline" id='tabUnderline' style={{width: activeWidth, left: activeLeft}}></div> */}
    </ul>
  )
}

export default Tabmenu
