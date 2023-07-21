import {EventEmitter} from 'events'
import {IMessage} from '../interfaces/IMessage'
import {IUserContext} from '../interfaces/IUserContext'
import {MessageEmitter} from './MessageEmitter'

describe('MessageEmitter', () => {
	test('on', () => {
		const messageEmitter = new MessageEmitter(new EventEmitter)
		class UserMessage implements IMessage {}
		const disposer = messageEmitter.on(UserMessage, () => {})
		expect(typeof disposer === 'function').toEqual(true)
		expect(disposer).toHaveProperty('dispose')
		expect(typeof disposer.dispose === 'function').toEqual(true)
	})
	test('emit', () => {
		const listener1 = jest.fn()
		const listener2 = jest.fn()
		const messageEmitter = new MessageEmitter(new EventEmitter)
		class UserMessage implements IMessage {}
		messageEmitter.on(UserMessage, message => {
			listener1(message)
			listener2(typeof message.dispose === 'function')
		})
		const message = new UserMessage
		messageEmitter.emit(message)
		expect(listener1).toBeCalledWith(message)
		expect(listener2).lastCalledWith(true)
	})
	test('emit with params', () => {
		const listener = jest.fn()
		const messageEmitter = new MessageEmitter(new EventEmitter)
		class UserMessage implements IMessage {
			public constructor(public readonly message: string) {}
		}
		messageEmitter.on(UserMessage, ({message}) => listener(message))
		messageEmitter.emit(new UserMessage('message1'))
		expect(listener).toBeCalledWith('message1')
	})
	test('multi on', () => {
		const listener = jest.fn()
		const messageEmitter = new MessageEmitter(new EventEmitter)
		class UserMessage implements IMessage {}
		messageEmitter.on(UserMessage, listener)
		messageEmitter.emit(new UserMessage)
		messageEmitter.emit(new UserMessage)
		messageEmitter.emit(new UserMessage)
		expect(listener).toBeCalledTimes(3)
	})
	test('once', () => {
		const listener = jest.fn()
		const messageEmitter = new MessageEmitter(new EventEmitter)
		class UserMessage implements IMessage {}
		messageEmitter.once(UserMessage, listener)
		messageEmitter.emit(new UserMessage)
		messageEmitter.emit(new UserMessage)
		messageEmitter.emit(new UserMessage)
		expect(listener).toBeCalledTimes(1)
	})
	test('dispose', () => {
		const listener = jest.fn()
		const messageEmitter = new MessageEmitter(new EventEmitter)
		class UserMessage implements IMessage {}
		const disposer = messageEmitter.on(UserMessage, listener)
		messageEmitter.emit(new UserMessage)
		messageEmitter.emit(new UserMessage)
		disposer.dispose()
		messageEmitter.emit(new UserMessage)
		messageEmitter.emit(new UserMessage)
		expect(listener).toBeCalledTimes(2)
	})
	test('context', () => {
		const listener = jest.fn()
		interface IMyContext extends IUserContext {
			param1: number
		}
		const context: IMyContext = {param1: 100}
		const messageEmitter = new MessageEmitter<IMyContext>(new EventEmitter, context)
		class UserMessage implements IMessage {}
		messageEmitter.on(UserMessage, ({param1}) => listener(param1))
		messageEmitter.emit(new UserMessage)
		expect(listener).toBeCalledWith(100)
	})
})
