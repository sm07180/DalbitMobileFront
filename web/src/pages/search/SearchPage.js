import React, { useState, useEffect, useRef } from "react";
import CntTitle from "components/ui/cntTItle/CntTitle";

const SearchPage = (props) => {
  const searchValue = useRef(null);



  return (
    <>
      <div>
        <CntTitle title={'검색'}/>
        <div>
          <input ref={searchValue} type="text"/>
        </div>
      </div>

      <div>
        <CntTitle title={'믿고 보는 DJ'}/>
      </div>

      <div>
        <CntTitle title={'🔥 지금 핫한 라이브'}/>
        <div>
          <input ref={searchValue} type="text"/>
        </div>
      </div>

      <div>
        <CntTitle title={'오늘 인기 있는 클립'}/>
        <div>
          <input ref={searchValue} type="text"/>
        </div>
      </div>

      <div>
        <CntTitle title={'검색'}/>
        <div>
          <input ref={searchValue} type="text"/>
        </div>
      </div>
    </>
  )
};

export default SearchPage;