import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

// getGameAssets 게임 자산을 가져오는 함수입니다.
// 스테이지 관련 처리를 위한 모델 함수들입니다.
// 각각 스테이지를 초기화, 조회, 설정하는 기능을 제공합니다.

export const gameStart = (uuid, payload) => {
  // 게임을 시작하는 함수로 사용자 UUID와 추가 데이터를 담고 있는 payload를 인자로 받습니다.
  const { stages } = getGameAssets();
  // 게임 자산에서 스테이지 정보를 가져옵니다.
  clearStage(uuid);
  // 주어진 사용자 UUID에 해당하는 스테이지를 초기화합니다.
  setStage(uuid, stages.data[0].id, payload.timestamp);
  // 첫 번째 스테이지를 해당 사용자 UUID에 설정하고 시작 시간을 타임스탬프와 함께 저장합니다.
  console.log('Stage:', getStage(uuid));
  // 현재 설정된 스테이지 정보를 로그로 출력합니다.

  return { status: 'success' };
  // 게임 시작이 성공적으로 처리되었음을 나타내는 응답 객체를 반환합니다.
};

export const gameEnd = (uuid, payload) => {
  // 게임을 종료하는 함수로 사용자 UUID와 종료시 관련 데이터를 담고 있는 payload를 인자로 받습니다.
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  // payload에서 게임 종료 시각과 점수를 추출합니다.
  // 현재 사용자 UUID에 해당하는 스테이지 정보를 가져옵니다.

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }
  // 스테이지가 존재하지 않을 경우 실패 메시지를 반환합니다.

  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }
    const stageDuration = (stageEndTime - stage.timestamp) / 100;
    totalScore += stageDuration; // 1초당 10점
  });
  // 각 스테이지의 지속 시간을 계산하여 총 점수를 합산합니다.
  // 마지막 스테이지의 종료 시간은 게임 종료 시간을 사용하고
  // 나머지 스테이지는 다음 스테이지의 시작 시간을 사용합니다.

  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }
  // 클라이언트에서 전송한 점수와 계산된 점수가 허용 오차 범위 (5) 내에 있는지 확인합니다.
  // 범위를 초과하면 실패 메시지를 반환합니다.

  return { status: 'success', message: 'Game ended successfully', score };
  // 모든 검증이 통과된 후 게임 종료 처리를 위한 로직을 실행합니다.
  // 성공 메시지와 최종 점수를 반환합니다.
};
