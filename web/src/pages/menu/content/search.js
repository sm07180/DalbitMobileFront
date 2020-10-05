import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import Room, {RoomJoin} from 'context/room'
// component
import Header from 'components/ui/new_header.js'
import SearchBar from './search_bar'
import List from './search-list'
import InitialSearch from './search_start'
import ArrowIcon from '../static/s_arrow.svg'
import qs from 'query-string'
//static
import SearchIco from '../static/search/ic_search.svg'
//scss
import './search.scss'
//flag

export default (props) => {
  // ctx
  const context = useContext(Context)
  const history = useHistory()
  const parameter = qs.parse(location.search)
  console.log(parameter)
  // state
  const [result, setResult] = useState('')
  //function
  const onChange = (e) => {
    setResult(e.target.value)
  }
  const handleSubmit = (e) => {}
  //submit initial
  useEffect(() => {
    if (parameter.query !== '' && parameter !== {}) {
      setResult(parameter.query)
    } else {
      setResult('')
    }
  }, [parameter])
  return (
    <div id="search">
      <Header title="검색" />
      <div className="controller">
        <form onSubmit={handleSubmit}>
          <input type="text" name="query" placeholder="검색어를 입력해 보세요." value={result} onChange={onChange} />
          <button type="submit">
            <img className="ico" src={SearchIco} />
          </button>
        </form>
      </div>
    </div>
  )
}
