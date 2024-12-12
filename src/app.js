import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

// 서버를 생성하기 위한 모듈을 가져옵니다.
// 소켓 초기화 및 게임 자산 로드를 위한 사용자 정의 모듈도 가져옵니다.

const app = express();
const server = createServer(app);

// express 애플리케이션 인스턴스를 생성하고, HTTP 서버를 초기화 합니다.

const PORT = 3000;

//포트를 설정합니다.

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Public 폴더의 정적 파일을 제공하는 미들웨어를 설정합니다.
// JSON 및 URL 인코딩된 데이터 처리를 위한 미들웨어를 설정합니다.

initSocket(server);
//소켓 기능을 초기화 합니다. 이 기능은 실시간 통신을 가능하게 합니다.

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

// 기본 루트 경로에 대한 GET 요청을 처리하여 Hello World라는 HTML 응답을 반환합니다.

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets loaded successfully');
  } catch (error) {
    console.error('Failed to load game assets:', error);
  }
});

// 설정된 포트에서 서버를 시작하고 게임 자산을 비동기적으로 로드합니다.
// 자산 로드 성공 여부에 따라 로그를 출력하며 에러 발생시 에러 메시지를 출력합니다.
