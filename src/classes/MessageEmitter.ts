import {IEventEmitter} from '../interfaces/IEventEmitter'
import {IMessageConstructor} from '../interfaces/IMessageConstructor'
import {IMessageEmitter} from '../interfaces/IMessageEmitter'
import {IMessageListener} from '../interfaces/IMessageListener'
import {IEventListenerRef} from '../interfaces/IEventListenerRef'
import {IMessage} from '../interfaces/IMessage'
import {IMessageListenerDisposer} from '../interfaces/IMessageListenerDisposer'
import {IUserContext} from '../interfaces/IUserContext'
import {TMessageListenerContext} from '../types/TMessageListenerContext'
import {InvalidMessageError} from './InvalidMessageError'

const emptyFunction = () => {}

/**
 * Замена штатного EventEmitter.
 * В качестве ключа используется не строка, а имя класса экземпляра сообщения.
 * Есть возможность задать пользовательский контекст для всех слушателей.
 * Слушатель должен реализовать интерфейс IMessageListener.
 */
export class MessageEmitter<C extends IUserContext> implements IMessageEmitter<C> {
	public constructor(
		/**
		 * Объект, реализующий интерфейс IEventEmitter. Например EventEmitter из модуля events.
		 */
		private readonly eventEmitter: IEventEmitter,
		/**
		 * Пользовательский контекст для всех слушателей.
		 */
		private readonly context: C = Object()
	) {}

	public on<M extends IMessage>(MessageClass: IMessageConstructor<M>, messageListener: IMessageListener<M, C>): IMessageListenerDisposer {
		return this.addListener('on', MessageClass, messageListener)
	}

	public once<M extends IMessage>(MessageClass: IMessageConstructor<M>, messageListener: IMessageListener<M, C>): IMessageListenerDisposer {
		return this.addListener('once', MessageClass, messageListener)
	}

	public emit(message: IMessage): void {
		if (message.constructor.name === 'Function') {
			throw new InvalidMessageError
		}
		this.eventEmitter.emit(message.constructor.name, message)
	}

	/**
	 * Освобождение ресурсов MessageEmitter.
	 * Удаляются все слушатели.
	 */
	public dispose(): void {
		this.eventEmitter.removeAllListeners()
	}

	/**
	 * Добавить слушателя.
	 * @param method Метод добавления: on - обычная подписка, once - одноразовая подписка.
	 * @param MessageClass Ссылка на класс сообщений, на которые подписываемся.
	 * @param messageListener Обработчик сообщения.
	 * @private
	 */
	private addListener<M extends IMessage>(
		method: 'on' | 'once',
		MessageClass: IMessageConstructor<M>,
		messageListener: IMessageListener<M, C>
	): IMessageListenerDisposer {
		const eventListenerRef: IEventListenerRef = {
			listener: emptyFunction
		}
		const dispose = () => this.eventEmitter.off(MessageClass.name, eventListenerRef.listener)
		const disposer: IMessageListenerDisposer = Object.assign(() => dispose(), {dispose})
		const messageListenerContext: TMessageListenerContext<C> = Object.assign(disposer, this.context)
		eventListenerRef.listener = (message: M) => messageListener(Object.assign(message, messageListenerContext))
		this.eventEmitter[method](MessageClass.name, eventListenerRef.listener)
		return disposer
	}
}
