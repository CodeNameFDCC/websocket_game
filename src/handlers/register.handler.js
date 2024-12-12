import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';

// 고유 식별자 UUID를 생성하기 위한 라이브러리를 가져옵니다.
// 사용자 정보를 관리하는 모델에서 사용자 추가 기능을 가져옵니다.
// 소켓 연결, 해제 및 이벤트 처리를 위한 사용자 정의 핸드러입니다.

const registerHandler = (io) => {
  // Socket.IO 인스턴스를 인자로 받아 클라이언트와의 연결 및 이벤트 처리를 설정하는 함수입니다.
  // 클라이언트가 서버에 연결할 때 호출되는 이벤트 리스너입니다.
  // 연결된 소켓 객체를 인자로 받습니다.

  io.on('connection', (socket) => {
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

    const userUUID = uuidv4(); // UUID 생성
    addUser({ uuid: userUUID, socketId: socket.id }); // 사용자 추가
    // 새로운 UUID를 생성하여 userUUID에 저장합니다.
    // 생성한 UUID와 소켓 ID를 사용하여 사용자를 추가합니다.

    handleConnection(socket, userUUID);
    // 연결된 소켓과 생성된 UUID를 인자로 하여 연결 처리를 수행합니다.
    // 이 함수는 사용자의 연결을 초기화 하고 필요한 작업을 수행합니다.

    socket.on('event', (data) => handleEvent(io, socket, data));
    // 클라이언트가 event라는 이름으로 데이터를 전송할 때 호출되는 이벤트 리스너입니다.
    // 수신한 데이터를 처리하기 위해 handleEvent 함수를 호출합니다.
    // 이 함수는 이벤트의 종류에 따라 적절한 처리를 수행합니다.

    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    // 클라이언트가 연결을 끊을 때 호출되는 이벤트 리스너입니다.
    // 소켓 객체와 사용자 UUID를 인자로 하여 연결 해제 처리를 수행합니다.
  });
};

export default registerHandler;

// registerHandler 함수를 기본으로 내보내어
// 다른 모듈에서 이 함수를 호출하여
// 소켓 이벤트 핸들러를 등록할 수 있도록 합니다.
