import React, {useState} from 'react'

import './filterBtn.scss'

// global components

const FilterBtn = (props) => {
  const {data, filterTextType, setFilterTextType, setSearchPaging, searchPaging} = props
  const [filterOpen, setFilterOpen] = useState(false)

  // 필터 열고닫기
  const openFilterGroup = () => {
    setFilterOpen(!filterOpen)
  }
  const clickFilterList = (e) => {
    const {filterIndex} = e.currentTarget.dataset

    setFilterTextType(data[filterIndex])
    setSearchPaging({...searchPaging, page: 1});
  }

  return (
    <button className="filterBtn" onClick={openFilterGroup}>
      {filterTextType}
      <span className={filterOpen ? 'arrowUp' : 'arrowDown'}/>
      {filterOpen &&
      <ul className="option">
        {data.map((list,index) => {
          return (
            <li className={`${filterTextType === list && 'checked'}`} data-filter-index={index} onClick={clickFilterList} key={index}>{list}</li>
          )
        })}
      </ul>
      }
    </button>
  )
}

export default FilterBtn;