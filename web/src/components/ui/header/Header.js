import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

import './header.scss'

export default (props) => {
  const {title, type, children, setSearchVal, searching, setSearching} = props
  const history = useHistory()
  const [cancelBtn, setCancelBtn] = useState(false);

  const goBack = () => {
    return history.goBack()
  }

  const onChange = (e) => {
    setSearchVal(e.target.value);
    if(e.target.value){
      setSearching("ing");
    } else {
      setSearching("noValue");
    }
  }

  const focusIn = () => {
    setCancelBtn(true);
  }

  const focusOut = () => {
    setCancelBtn(false);
    document.getElementById('searchInput').value = "";
    setSearching("noValue");
    setSearchVal("");
  }

  const removeValue = () => {
   document.getElementById('searchInput').value = "";
   setSearching("noValue");
   setSearchVal("");
  }

  const handleSubmit = (event) => {
    event.preventDefault();  
    document.getElementById('searchInput').blur();
    setSearching("enter");
  }

  return (
    <header className={`${type ? type : ''}`}>
      {type === 'back' && (
        <button className="back" onClick={goBack}></button>
      )}
      <h1 className="title">{title}</h1>
      {title === '라이브' && 
        <div className="buttonGroup">
          <button className='ranking'></button>
          <button className='message'></button>
          <button className='alarm'></button>
        </div>
      }
      {title === '클립' && 
        <div className="buttonGroup">
          <button className='message'></button>
          <button className='alarm'></button>
        </div>
      }
      {title === '좋아요한 클립' && 
        <div className="buttonGroup">
          <button className='play'></button>
          <button className='shuffle'></button>
        </div>
      }
      {title === '최근 들은 클립' && 
        <div className="buttonGroup">
          <button className='play'></button>
          <button className='shuffle'></button>
        </div>
      }
      {title === 'MY' && 
        <div className="buttonGroup">
          <button className='store'></button>
          <button className='search'></button>
          <button className='alarm'></button>
        </div>
      }
      {title === '검색' && 
        <div className="searchField">
          <form className='searchForm' onSubmit={handleSubmit}>
            <input
              type="text"
              className='searchInput'
              id='searchInput'
              placeholder='닉네임, 방송, 클립을 입력해주세요.'
              onChange={onChange}
              onFocus={focusIn}
              onBlur={focusOut}
            />
            {searching && <button className='removeValue' onClick={removeValue}/>}
          </form>
          {cancelBtn && <button className='searchCancel' onClick={removeValue}>취소</button>}
        </div>
      }
      {children}
    </header>
  )
}
