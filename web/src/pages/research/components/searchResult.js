import React, {useState, useEffect} from 'react'

import Api from 'context/api'
// global components
import CntTitle from 'components/ui/cntTitle/CntTitle'
// components
import Tabmenu from './Tabmenu'
import ResultCnt from './ResultCnt'
// css

const tabmenu = ['전체','DJ','라이브', '클립']

export default (props) => {
  const {searchResult} = props
  const [tabName, setTabName] = useState(tabmenu[0])  
  const [djResultList, setDjResultList] = useState([])  
  const [liveResultList, setLiveResultList] = useState([])
  const [clipResultList, setClipResultList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const resultType = [
    {text: 'DJ', type: 'dj', data: djResultList},
    {text: '라이브', type: 'live', data: liveResultList},
    {text: '클립', type: 'clip', data: clipResultList},
  ];

  async function fetchSearchMember() {
    const res = await Api.member_search({
      params: {
        search: searchResult,
        page: 1,
        records: 20
      }
    })
    if (res.result === 'success') {
      setDjResultList(res.data.list);
    }
  }

  async function fetchSearchLive() {
    const res = await Api.broad_list({
      params: {
        search: searchResult,
        page: 1,
        records: 20
      }
    })
    if (res.result === 'success') {
      setLiveResultList(res.data.list);
    }
  }
  async function fetchSearchClip() {
    const res = await Api.getClipList({
      search: searchResult,
      slctType: 0,
      dateType: 0,
      page: 1,
      records: 20
    })
    if (res.result === 'success') {
      setClipResultList(res.data.list);
    }
  }

  useEffect(() => {
    fetchSearchMember();
    fetchSearchLive();
    fetchSearchClip();    
  }, [])

  return (
    <>
      <Tabmenu data={tabmenu} tab={tabName} setTab={setTabName} setPage={setCurrentPage}/>
      {resultType.map((item,index) => {
        const {text,type,data} = item
        return (
          <React.Fragment key={index}>
            {tabName === '전체' ?
              <section className={`${type}Result`}>
                <CntTitle title={text}>
                  {data.length > 0 && <button>더보기</button>}
                </CntTitle>
                <ResultCnt data={data} type={type} />
              </section>
              :
              tabName === text ?
              <section className={`${type}Result`}>
                <ResultCnt data={data} type={type} />
              </section>
              :
              <></>
            }
          </React.Fragment>
        )
      })}
    </>
  )
}