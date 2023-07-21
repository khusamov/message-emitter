Передатчик сообщений MessageEmitter
-----------------------------------

Класс MessageEmitter создан для замены штатного EventEmitter.

Подходит для Node.js и для браузера. Поддерживается TypeScript.

Идея заключается в передаче сообщения не в виде не известного набора параметров, 
а в виде экземпляра заранее известного класса. То есть подписываемся на по имени события, 
а по ссылке на класс события.

Есть возможность задать пользовательский контекст для всех слушателей.
Слушатель должен реализовать интерфейс IMessageListener.

Установка
---------

```bash
yarn add khusamov-message-emitter
```

Пример
------

```typescript
import {EventEmitter} from 'events'
import {MessageEmitter, IMessage, IUserContext} from 'khusamov-message-emitter'

// Определение пользовательского контекста. Не обязательно.
interface IMyContext extends IUserContext {
	contextParam1: number
}

// Заполнение пользовательского контекста.
const userContext: IMyContext = {
	contextParam1: 12345
}

const messageEmitter = new MessageEmitter(new EventEmitter, userContext)

// Пользовательское сообщение.
class UserMessage implements IMessage {
	public constructor(
		public readonly param1: string
	) {}
}

// Подписка на сообщения класса UserMessage.
const dispose = messageEmitter.on(UserMessage, ({param1, contextParam1, dispose}) => {
	// Внутри слушателя получаем поля класса UserMessage, поля пользовательского 
	// контекста и метод dispose().
	// То есть param1 === 'message1'.
	// То есть contextParam1 === 12345.
	// Слушатель может себя отключить при помощи вызова dispose().
})

// Отправление сообщения.
messageEmitter.emit(new UserMessage('message1'))

// Удаление слушателя сообщений UserMessage.
dispose()

// Удаление всех слушателей.
messageEmitter.dispose()
```
