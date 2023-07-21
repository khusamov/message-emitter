import {TMessageListenerContext} from '../types/TMessageListenerContext'
import {IMessage} from './IMessage'
import {IUserContext} from './IUserContext'

/**
 * Обработчик сообщения.
 */
export interface IMessageListener<M extends IMessage, C extends IUserContext> {
	(message: M, context: TMessageListenerContext<C>): void
}
