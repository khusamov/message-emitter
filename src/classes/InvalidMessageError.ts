export class InvalidMessageError extends Error {
	public constructor() {
		console.warn('Не правильный экземпляр сообщения.')
		console.warn('Возможно пропущен оператор new при создании экземпляра сообщения.')
		super('Не правильный экземпляр сообщения')
	}
}