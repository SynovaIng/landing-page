export const formatProjectCountApprox = (totalCount: number): string => {
  if (!Number.isFinite(totalCount) || totalCount <= 0) {
    return "0";
  }

  if (totalCount < 10) {
    return String(Math.floor(totalCount));
  }

  const roundedByTen = Math.floor(totalCount / 10) * 10;
  return `${roundedByTen}+`;
};
