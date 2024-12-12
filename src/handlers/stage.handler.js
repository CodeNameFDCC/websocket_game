import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

// 사용자의 현재 스테이지 정보를 가져오는 함수입니다.
// 사용자의 스테이지 정보를 업데이트하는 함수입니다.
// 게임 자산 정보를 가져오는 함수로 스테이지의 유효성을 검사하는 데 사용됩니다.

export const moveStageHandler = (userId, payload) => {
  // 사용자가 스테이지를 이동할 때 호출되는 함수로
  // 사용자 ID와 이동할 스테이지 정보를 담고 있는 payload를 인자로 받습니다.

  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }
  // 클라이언트에서 전송한 payload.currentStage 와 서버의 현재 스테이지 ID를 비교합니다.
  // 불일치할 경우 실패 메시지를 반환합니다.

  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];
  // 현재 스테이지 배열을 오름 차순으로 정렬하여 가종 높은 ID를 가진 스테이지를 확인합니다.

  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }
  // 클라이언트에서 전송한 payload.currentStage와 서버의 현재 스테이지 ID를 비교합니다.
  // 불일치할 경우 실패 메시지를 반환합니다.

  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 100; // 초 단위로 계산
  //서버의 현재 시간을 가져와서 현재 스테이지의 타임스탬프와의 차이를 계산하여 경과 시간을 초 단위로 구합니다.

  if (elapsedTime < 100 || elapsedTime > 105) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }
  // 경과 시간이 100초 이상 105초 이하인지 확인합니다.
  // 이 조건을 만족하지 않으면 실패 메시지를 반환합니다.

  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage does not exist' };
  }
  // 게임 자산에서 다음 스테이지의 존재 여부를 확인합니다.
  // 존재하지 않을 경우 실패 메시지를 반환합니다.

  setStage(userId, payload.targetStage, serverTime);
  console.log(`Stage successfully updated to :`, payload.targetStage);
  return { status: 'success' };
  // 모든 검증이 통과한 경우 사용자의 스테이지 정보를 업데이트하고 성공 응답을 반환합니다.
};
