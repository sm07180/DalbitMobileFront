import React, {useState} from 'react'

// global components

const FilterBtn = (props) => {
  const {data, list, handleSelect} = props;
  const [filterOpen, setFilterOpen] = useState(false);

  // 필터 열고닫기
  const openFilterGroup = () => {
    setFilterOpen(!filterOpen);
  };

  // 필터 닫기
  const closeFilterGroup = () => {
    setFilterOpen(false);
  };

  const clickFilterList = (e) => {
    const {filterIndex} = e.currentTarget.dataset;

    handleSelect(filterIndex);
  };
  
  return (
    <button className="filterBtn" onClick={openFilterGroup}>
      {data.name}
      <span className={`${filterOpen ? 'arrowUp' : 'arrowDown'}`}/>
      {filterOpen &&
      <ul className="option" onMouseLeave={closeFilterGroup}>
        {list.map((row, index) => {
          return (
            <li className={`${data.name === row.name && 'checked'}`} data-filter-index={row.index} onClick={clickFilterList} key={index}>{row.name}</li>
          )
        })}
      </ul>
      }
    </button>
  );
};

export default FilterBtn;