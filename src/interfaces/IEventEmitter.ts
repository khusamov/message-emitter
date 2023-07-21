import {EventEmitter} from 'events'

type TEventEmitterPickedMethods =
	'on' |
	'once' |
	'off' |
	'emit' |
	'removeAllListeners' |
	'setMaxListeners' |
	'getMaxListeners'

export interface IEventEmitter extends Pick<EventEmitter, TEventEmitterPickedMethods> {}