/**
 * Объект со ссылкой на обработчик события.
 */
export interface IEventListenerRef {
	listener: (...args: any[]) => void
}
