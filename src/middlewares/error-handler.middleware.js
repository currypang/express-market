export default (err, req, res, next) => {
  // joi 공식문서 error 부분 확인 할 것
  //err.message, err.details[0].message 는 동일한 값을 출력
  // next에서 인자로 받아온 nonUnique는 err로 가져온다.
  // 에러 type을 통해 joi messages key 값 확인 가능

  // 상품 생성 시 기존 상품이 존재 할 시 처리
  if (err === 'nonUnique') {
    return res.status(400).json({ message: '이미 등록된 상품입니다.' });
  }
  // 전체 목록 조회 시 상품이 없는 경우
  if (err === 'empty') {
    return res.status(404).json({ data: [] });
  }
  // 상세 조회, 수정, 삭제 시 상품이 없는 경우
  if (err === 'notExist') {
    return res.status(404).json({ errorMessage: '상품이 존재하지 않습니다.' });
  }
  // joi 유효성 검증 처리
  if (err.isJoi) {
    return res.status(400).json({ errorMessage: err.message });
  }
  // 나머지 에러 처리
  return res.status(500).json({
    errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};
