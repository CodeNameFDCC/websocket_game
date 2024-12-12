const users = [];
// 현재 연결된 사용자의 정보를 저장하는 배열입니다.
// 각 사용자 객체는 일반적으로 소켓 ID와 사용자 관련 데이터를 포함합니다.

export const addUser = (user) => {
  users.push(user);
};
// 새로운 사용자 객체를 인자로 받아 users 배열에 추가하는 함수입니다.
// 사용자가 연결될 때 호출되어 해당 사용자의 정보를 배열에 저장합니다.

export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
// 주어진 소켓 ID에 해당하는 사용자를 users 배열에서 제거하는 함수입니다.
// findIndex 메서드를 사용하여 배열에서 해당 소켓 ID와 일치하는 사용자 객체의 인덱스를 찾습니다.
// 인덱스가 유효한 경우 splice 메서드를 사용하여 해당 사용자를 배열에서 제거하고
// 제거된 사용자 객체를 반환합니다.

export const getUsers = () => {
  return users;
};
// 현재 저장된 사용자 목록을 반환하는 함수입니다.
// 이 함수를 호출하면 현재 연결된 모든 사용자의 정보를 담고 있는 배열을 받을 수 있습니다.
