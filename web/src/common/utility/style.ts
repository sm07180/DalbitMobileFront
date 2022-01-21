export function getMatrixDataFromStyle(elem: HTMLElement) {
  const matrixNumberPattern = /-?\d+\.?\d*/g;
  var mat = window
    .getComputedStyle(elem)
    .transform.match(matrixNumberPattern)
    ?.map((v) => Number(v));

  return mat;
}

// 3,000,000 3단위수로 ,붙이기
export function addComma(x: number) {
  if (x === undefined || x === null) return 0;
  try {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } catch {
    return 0;
  }
}
