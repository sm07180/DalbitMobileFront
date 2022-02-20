import React, { useMemo } from "react";
import "./Pagenation.scss";

type PageProps = {
  /** 총 Page */
  totalPage: number;
  /** 현재 표시되고있는 Page */
  currentPage: number;
  /** 페이지 몇개까지 보여줄지 */
  count: number;
  /** Page Change Event */
  setPage(number: number): void;
};

export function Pagenation(props: PageProps) {
  const { setPage, currentPage, totalPage, count } = props;
  const PageBtnMaxLength = count;
  const removedLastDigitPageNumber = useMemo(() => Math.floor((currentPage - 1) / PageBtnMaxLength) * PageBtnMaxLength, [
    currentPage,
  ]);

  const prev = () => {
    if (currentPage !== 1) {
      setPage(currentPage - 1);
    }
  };
  const next = () => {
    if (currentPage < totalPage) {
      setPage(currentPage + 1);
    }
  };

  return (
    <div className={"pagenation-wrap"}>
      <button className={"left"} onClick={prev} />
      {[...Array(count)].map((value, index) => {
        const pageNumber = removedLastDigitPageNumber + index + 1;

        return (
          pageNumber <= totalPage && (
            <div
              key={index}
              onClick={() => setPage(pageNumber)} // !!!
              className={`page ${currentPage === pageNumber ? "active" : ""}`}
            >
              {pageNumber}
            </div>
          )
        );
      })}
      <button className={"right"} onClick={next} />
    </div>
  );
}

Pagenation.defaultProps = {
  currentPage: 1,
};

export default Pagenation;

// const Container = styled.div`
//   display: flex;
//   margin: 20px 0 100px 0;
//   width: 100%;
//   justify-content: center;
//   align-items: center;
// `
// const Left = styled.button`
//   display: flex;
//   width: 30px;
//   height: 30px;
//   justify-content: center;
//   align-items: center;
//   margin-right: 4px;
//   cursor: pointer;

//   background-repeat: no-repeat;
//   background-position: center;
// `
// const Right = styled.button`
//   display: flex;
//   width: 30px;
//   height: 30px;
//   justify-content: center;
//   margin-left: 4px;
//   cursor: pointer;

//   background-repeat: no-repeat;
//   background-position: center;
// `

// const Page = styled.button`
//   color: #e0e0e0;
//   border: 1px solid #e0e0e0;
//   border-radius: 8px;
//   width: 36px;
//   height: 36px;
//   margin: 0 4px;
//   user-select: none;

//   &.active {
//     color: #fff;
//     border-color: #FF3C7B;
//     background-color: #FF3C7B;
//   }
// `
