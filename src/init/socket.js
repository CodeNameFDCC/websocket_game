import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

// SocketIO 서버 클래스를 가져옵니다. 이를 통해 실시간 웹소켓 통신 기능을 구현할 수 있습니다.
// registerHandler 웹 소켓 이벤트를 처리하기 위해 사용자 정의 핸들러 모듈을 가져옵니다.

const initSocket = (server) => {
  // 서버 인스턴스를 인자로 받아 웹소켓 서버를 초기화하는 함수입니다.
  const io = new SocketIO();
  // 서버 인스턴스를 생성합니다.
  // 이 인스턴스는 클라이언트와의 실시간 통신을 관리합니다.
  io.attach(server);
  // 생성한 Socket.IO 인스턴스를 기존 HTTP 서버에 연결하여 웹소켓 요청을 처리할 수 있도록 설정합니다.
  registerHandler(io);
  // 가져온 핸들러를 사용하여 Socket.IO 인스턴스에 이벤트 리스너를 등록합니다.
  // 이를 통해 클라이언트의 웹소켓 이벤트를 처리할 수 있습니다.
};

export default initSocket;
// initSocket 함수를 기본으로 내보내어
//다른 모듈에서 이 함수를 호출하여
//소켓 서버를 초기화할 수 있도록 합니다.
