/**
 * @files common/ui/use_tab.tsx
 * @brief 공통탭
 */
import React, { useState } from "react";

type TabProps = {
  initialTab: number;
};

const useTabs = ({ initialTab }: TabProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialTab);

  return {
    currentIdx: currentIndex,
    changeItem: setCurrentIndex
  };
};

export default useTabs;
