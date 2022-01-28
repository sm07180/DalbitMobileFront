import React, {useState} from 'react'

// global components

const FilterBtn = (props) => {
  const {data} = props
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterTextType, setFilterTextType] = useState(data[0])

  // 필터 열고닫기
  const openFilterGroup = () => {
    setFilterOpen(!filterOpen)
  }
  const clickFilterList = (e) => {
    const {filterIndex} = e.currentTarget.dataset
    
    setFilterTextType(data[filterIndex])
  }

  return (
    <button className="filterBtn" onClick={openFilterGroup}>
      {filterTextType}
      <span className="arrowDown"></span>
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

export default FilterBtn