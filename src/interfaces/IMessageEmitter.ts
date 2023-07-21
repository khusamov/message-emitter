import {IDisposable} from './IDisposable'
import {IMessage} from './IMessage'
import {IMessageConstructor} from './IMessageConstructor'
import {IMessageListener} from './IMessageListener'
import {IUserContext} from './IUserContext'

export interface IMessageEmitter<C extends IUserContext = {}> extends IDisposable {
	on<M extends IMessage>(MessageClass: IMessageConstructor<M>, messageListener: IMessageListener<M, C>): IDisposable
	once<M extends IMessage>(MessageClass: IMessageConstructor<M>, messageListener: IMessageListener<M, C>): IDisposable
	emit(message: IMessage): void
}
