import { IValidatedRequest } from "../models/request/validatedRequest.model";
import { IValidatedRequestBody } from "../models/request/validatedRequestBody.model";
import { ErrorService } from "../utils/error.service";
import { ChatRepository } from "../repository/chat.repository";
import { v4 as uuidv4 } from 'uuid';
import {IChat, ICreateChat, ICreateChatParams, IRoom} from "../models/interfaces/chat.model";
import StatusCodes from "http-status-codes";
import {IValidatedRequestParams} from "../models/request/validatedRequestParams.model";

export class ChatController {
    static async create(req: IValidatedRequest<IValidatedRequestBody<ICreateChat>>, res: any) {
        try {

            const interlocutor = await ChatRepository.checkInterlocutorByEmail(req.body.interlocutorEmail);

            if (!interlocutor) return ErrorService.error(res, `User by email ${req.body.interlocutorEmail} not found!`, StatusCodes.CONFLICT);

            let response: IChat;
            // Here we check the chat for existence. If a chat exists, return that chat.
            const chat = await ChatRepository.getChat({ userId: req.userId, interlocutorId: interlocutor.id});

            if (!!chat) {
                response = {
                    interlocutor,
                    room: chat.room
                }

                return res.send(response);
            }

            const params: ICreateChatParams = {
                userId: req.userId,
                interlocutorId: interlocutor.id,
                room: uuidv4()
            };
            // Create a chat for this user and for the interlocutor
            const chatData: IRoom = await ChatRepository.createChat(params);
            if (params.userId !== params.interlocutorId) await ChatRepository.createChatForInterlocutor(params);

            response = {
                interlocutor,
                room: chatData.room
            }

            return res.send(response);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async list(req: IValidatedRequest<any>, res: any) {
        try {

            const chats = await ChatRepository.getChats(req.body.userId);

            return res.send(chats);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async getChat(req: IValidatedRequest<IValidatedRequestParams<IRoom>>, res: any) {
        try {
            const isUserChat = await ChatRepository.checkRoom(req.params.room, req.body.userId);

            if (!isUserChat.exists) return ErrorService.error(res, {}, StatusCodes.NOT_FOUND);

            const chatMessage = await ChatRepository.getChatMessages(req.params.room);

            return res.send(chatMessage);
        } catch (error) {
            return ErrorService.error(res, error);
        }
    }
}