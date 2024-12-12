import { moveStageHandler } from './stage.handler.js';
import { gameEnd, gameStart } from './game.handler.js';

// 스테이지 이동을 처리하는 핸들러 함수를 가져옵니다.
// 게임 시작 및 종료를 처리하는 핸들러 함수를 가져옵니다.

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
};
// 이벤트 ID와 해당 핸들러 함수를 매핑하는 객체입니다.
// 2 게임 시작 이벤트에 대해 gameStart 핸들러를 연결합니다.
// 3 게임 종료 이벤트에 대해 gameEnd 핸들러를 연결합니다.
// 11 스테이지 이동 이벤트에 대해 moveStageHandler 핸들러를 연결합니다.

export default handlerMappings;
// handlerMappings 객체를 내보내어 다른 모듈에서 이 객체를 가져와 핸들러를 쉽게 사용할 수 있도록 합니다.
