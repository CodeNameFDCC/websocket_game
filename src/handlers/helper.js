import { getUsers, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';

// 사용자 정보를 관리하는 모델로 부터 사용자 목록을 가져오고
// 특정 사용자를 제거하는 기능을 가져옵니다.
// 클라이언트의 버전 정보를 담고 있는 상수를 가져옵니다.
// 다양한 이벤트 핸들러를 매핑하는 객체를 가져옵니다.
// 새로운 스테이지를 생성하는 기능을 제공하는 모델을 가져옵니다.

export const handleConnection = (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());

  createStage(userUUID);
  // 스테이지 빈 배열 생성

  socket.emit('connection', { uuid: userUUID });
};
// 새로운 사용자가 연결될 때 호출되는 함수입니다.
// 연결된 사용자 UUID와 소켓 ID를 로그로 출력합니다.
// 현재 연결된 사용자 목록을 출력합니다.
// createStage 함수를 호출하여 해당 사용자에 대한 새로운 스테이지를 생성합니다.
// 클라이언트에게 연결 성공 메시지를 보냅니다.
// emit 은 이벤트를 발생시킨다 'connection' 이라는 이벤트

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};
// 사용자가 연결을 끊을 때 호출되는 함수입니다.
// removeUser 함수를 호출하여 해당 소켓 ID의 사용자를 삭제합니다.
// 연결이 끊어진 사용자 ID를 로그로 출력합니다.
// 현재 연결된 사용자 목록을 출력합니다.

export const handleEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }
  socket.emit('response', response);
};

// 클라이언트로부터 이벤트가 발생했을 때 호출되는 함수입니다.
// 클라이언트의 버전이 서버에서 지원하는 버전 목록에 포함되어 있는지 확인합니다.
// 포함되지 않는 경우 클라이언트에게 버전 불일치 메시지를 보냅니다.
// handlerMappings에서 해당하는 핸들러를 찾습니다.
// 핸들러가 없으면 클라이언트에게 핸들러 미발견 메시지를 보냅니다.
// 핸들러를 호출하고 반환된 응답에 따라 처리를 진행합니다.
// 응답에 brooadcast 플래그가 있다면 모든 클라이언트에게 브로드 캐스트 메시지를 보내고
// 그렇지 않다면 해당 소켓에만 응답을 보냅니다.
