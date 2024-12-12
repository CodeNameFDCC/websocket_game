import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// fs 파일 시스템 모듈로 파일 읽기 및 쓰기 기능을 제공합니다.
// path 파일 및 디렉토리 경로를 다루기 위한 유틸리티 모듈입니다.
// fileURLTOPath URL 형식의 파일 경로를 파일 시스템의 경로로 변환합니다.

const __filename = fileURLToPath(import.meta.url);
// 현재 파일의 절대 경로를 저장합니다.
const __dirname = path.dirname(__filename);
// 파일 및 디렉토리 경로를 다루기 위한 유틸리티 모듈입니다.
const basePath = path.join(__dirname, '../../assets');
// URL  형식의 파일 경로를 파일 시스템의 경로로 변환합니다.
let gameAssets = {};
// 전역 함수로 선언

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};
// 주어진 파일 이름을 사용하여 파일을 비동기적으로 읽고 JSON 형식으로 파싱하여 반환하는 함수입니다.
// 파일 읽기 중 에러가 발생하면 reject를 호출하고, 성공하면 resolve를 호출하여 파싱된 데이터를 반환합니다.

export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (error) {
    throw new Error('Failed to load game assets: ' + error.message);
  }
};
// 비동기 함수로 여러 JSON 파일 을 병렬로 읽어와서 GAMEaSSETS에 저장합니다.
// 파일 읽기 중 에러가 발생하면 새 에러를 던져 호출자에게 알립니다.

export const getGameAssets = () => {
  return gameAssets;
};

// 현재 로드된 게임 자산을 반환하는 함수입니다.
