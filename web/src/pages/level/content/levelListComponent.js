import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import Api from 'context/api'
//component
import LevelListItemComponent from './levelListItemComponent'

export default props => {
  //useState
  const [levelInfoData, setlevelInfoData] = useState([])
  //api
  async function fetchData() {
    const res = await Api.mypage_level_info()
    if (res.result === 'success') {
      setlevelInfoData(res.data)
    } else if (res.result === 'fail') {
      console.log('fail')
    }
  }
  //useEffect
  useEffect(() => {
    fetchData()
  }, [])

  return <LevelList>{levelInfoData && <LevelListItemComponent data={levelInfoData} />}</LevelList>
}

const LevelList = styled.ul`
  margin-top: 16px;
`
