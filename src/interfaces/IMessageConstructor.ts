import {IMessage} from './IMessage'

/**
 * Класс сообщения.
 */
export interface IMessageConstructor<M extends IMessage> {
	new(...parameters: any[]): M
}
