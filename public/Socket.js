import { CLIENT_VERSION } from './Constants.js';

// 클라이언트 버전 정보를 가져옵니다.

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});
// Socket.IO 클라이언트를 생성하여 서버에 연결합니다.
let userId = null;
// userId를 초기화 합니다.
socket.on('response', (data) => {
  console.log(data);
});
// 서버로 부터 response 이벤트를 수신할 때 실행되는 콜백 함수를 정의합니다.
// 서버에서 전달된 데이터를 콘솔에 출력합니다.

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});
// 서버와 연결이 완료되었을 때 실행되는 콜백 함수를 정의합니다.
// 서버에서 전달된 데이터에서 사용자 ID를 추출하여 userId 변수에 저장합니다.
// 해당 ID는 이벤트 전송시 사용됩니다.

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

// 특정 이벤트를 서버로 전송하는 함수입니다.
// 처리할 이벤트의 ID와 이벤트와 함께 전송할 데이터 payload 가 있습니다.
// 서버에 event 라는 이름으로 데이터를 전송합니다.
// 전송되는 데이터는 사용자 ID 클라이언트 버전, 핸들러 ID 및 데이터 payload가 있습니다.

export { sendEvent };

// sendEvent 함수를 다른 모듈에서 사용할 수 있도록 내보냅니다.
// Socre.js 에서 점수를 보내는데 사용되고 있습니다.
