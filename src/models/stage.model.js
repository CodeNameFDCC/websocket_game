const stages = {};
// 사용자 UUID를 키로 하고 각 사용자의 스테이지 정보를 배열로 저장하는 객체입니다.
// 각 사용자별로 스테이지를 관리할 수 있도록 합니다.

export const createStage = (uuid) => {
  stages[uuid] = []; // 초기 스테이지 배열 생성
};
// 주어진 사용자 UUID에 대해 빈 스테이지 배열을 생성하는 함수입니다.
// 사용자가 새로 시작할 때 호출되어 해당 사용자의 스테이지 정보를 초기화 합니다.

export const getStage = (uuid) => {
  return stages[uuid];
};
// 주어진 사용자 UUID에 해당하는 스테이지 배열을 반환하는 함수입니다.
// 사용자의 현재 스테이지 정보를 조회할 때 사용됩니다.

export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};
// 주어진 사용자 UUID의 스테이지 배열에 새로운 스테이지 정보를 추가하는 함수입니다.
// 스테이지 ID
// 스테이지 시작 시간을 나타내는 타임스탬프
// 새로운 스테이지 객체를 배열에 추가하고 해당 배열의 새로운 길이를 반환합니다.

export const clearStage = (uuid) => {
  return (stages[uuid] = []);
};
// 주어진 사용자 UUID의 스테이지 배열을 빈 배열로 초기화 하는 함수입니다.
// 사용자가 게임을 재시작 하거나 스테이지 정보를 초기화할 때 호출됩니다.
