/**
 * @files common/ui/no_result.tsx
 * @brief 데이터 결과 없음 컴포넌트
 */
import React from "react";

export default function NoResult(props: { type: string; text?: string; height?: number }) {
  const { type, text, height } = props;
  return (
    <div className="noResultWrap" style={height ? { minHeight: `${height}px` } : { minHeight: "400px" }}>
      <span className={`${type === "default" ? "noResult" : ""}`} dangerouslySetInnerHTML={{ __html: text! }}></span>
    </div>
  );
}

NoResult.defaultProps = {
  type: "default",
};
