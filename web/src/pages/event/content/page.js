import React, {useState} from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

const Page = ({postsPerPage, totalPosts, paginate}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  }
  //console.log(paginate)
  return (
    <Wrap>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number}>
            <Button
              onClick={() => {
                paginate(number), setCurrentPage(number)
              }}
              id={number}
              className={currentPage === number ? 'active' : ''}>
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </Wrap>
  )
}
export default Page

//styled
const Wrap = styled.nav`
  margin-bottom: 146px;
  & ul {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  & li {
    margin-right: 8px;
    border-radius: 8px;
    text-align: center;
  }
`
const Button = styled.a`
  display: block;
  position: relative;
  width: 36px;
  height: 36px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  color: ${COLOR_MAIN};
  font-size: 14px;
  cursor: pointer;
  &.active {
    color: #fff;
    background-color: ${COLOR_MAIN};
    border: none;
  }
`
