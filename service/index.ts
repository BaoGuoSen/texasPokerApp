import type { Room, CreateParams, GameRes } from "@/types";
import type { ActionType, User } from "texas-poker-core";

import http from "@/utils/http";
import AsyncStorage from '@react-native-async-storage/async-storage';

const createGame = async (params: CreateParams) => {

  const { data } = await http<{ roomId: string; }>(
    'room/create',
    params
  )

  return data
}

const getAllRooms = async () => {
  const { data } = await http<Room[]>(
    'room/all'
  )

  return data
}

const getRoomInfo = async (params: Pick<Room, 'id'>) => {
  const { data } = await http<{ playersOnSeat: Room['owner'][]; playersHang: Room['owner'][]; }>(
    `room/allPlayers/${params.id}`
  )

  return data
}

const joinRoom = async (params: Pick<Room, 'id'> & { userId: number; }) => {
  const { data } = await http(
    `room/join/${params.id}`,
    {
      userId: params.userId
    }
  )

  return data;
}

const deleteRoom = async (params: Pick<Room, 'id'>) => {
  const { data } = await http(
    `room/delete/${params.id}`
  )

  return data;
}

/**
 * 准备游戏，仅限房主调用
 */
const readyGame = async (params: Pick<Room, 'id'>) => {
  await http(
    `game/ready/${params.id}`
  )
}

/**
 * 开始发牌，每一轮开始 角色为 button 玩家调用
 */
const startGame = async (params: Pick<Room, 'id'>) => {
  await http(
    `game/start/${params.id}`
  )
}

/**
 * 执行动作
 */
const doAction = async (params: {
  amount?: number;
  matchId: number;
  roomId: string;
  actionType: ActionType;
}) => {
  await http(
    `action/take`,
    params
  )
}

const endGame = async (params: Pick<Room, 'id'>) => {
  const { data } = await http<GameRes>(
    `game/end/${params.id}`
  )

  return data;
}

const quitRoom = async (params: Pick<Room, 'id'>) => {
  const { data } = await http(
    `room/quit/${params.id}`
  )

  return data;
}

const login = async (params: { name: string; }) => {
  const { data } = await http<{ token: string; }>(
    'user/sign',
    params
  )

  await AsyncStorage.setItem('userToken', data.token);
}

const getUser = async () => {
  const { data } = await http<User>(
    `user/info`
  )

  return data
}

export {
  createGame,
  getAllRooms,
  login,
  getRoomInfo,
  joinRoom,
  deleteRoom,
  getUser,
  quitRoom,
  startGame,
  readyGame,
  endGame,
  doAction
};