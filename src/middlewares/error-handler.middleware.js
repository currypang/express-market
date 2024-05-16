export default (err, req, res, next) => {
  return res
    .status(500)
    .json({
      errorMessage:
        '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
    });
};
