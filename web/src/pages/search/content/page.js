import React from 'react'
import styled from 'styled-components'
const Page = ({postsPerPage, totalPosts, paginate}) => {
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  }
  return (
    <Wrap>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <a className="page-link" onClick={() => paginate(number)}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </Wrap>
  )
}
export default Page

//styled
const Wrap = styled.nav`
  & ul {
    display: flex;
    width: 120px;
  }
  & li {
    width: 33.333%;
    padding: 10px;
    margin-left: -1px;
    box-sizing: border-box;
    border: 1px solid lightblue;
    text-align: center;
    cursor: pointer;

    & a {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
`
