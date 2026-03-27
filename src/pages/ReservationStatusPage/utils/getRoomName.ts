export function getRoomName(rooms: { id: string; name: string }[], roomId: string) {
    return rooms.find((room) => room.id === roomId)?.name ?? roomId;
  }