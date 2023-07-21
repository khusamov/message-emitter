Передатчик сообщений MessageEmitter
-----------------------------------

Класс MessageEmitter создан для замены штатного EventEmitter.

Идея заключается в передаче сообщения не в виде не известного набора параметров, 
а в виде экземпляра заранее известного класса.

То есть подписываемся на по имени события, а по ссылке на класс события.

Есть возможность задать пользовательский контекст для всех слушателей.
Слушатель должен реализовать интерфейс IMessageListener.

```typescript
const messageEmitter = new MessageEmitter(new EventEmitter)

class UserMessage implements IMessage {
	public constructor(
		public readonly param1: string
	) {}
}

// Подписка на сообщения класса UserMessage.
const dispose = messageEmitter.on(UserMessage, ({param1, dispose}) => {
	// Внутри слушателя получаем поля класса UserMessage и метод dispose().
	// То есть param1 === 'message1'.
	// Слушатель может себя отключить при помощи вызова dispose().
	
})

// Отправление сообщения.
messageEmitter.emit(new UserMessage('message1'))

// Удаление слушателя сообщений UserMessage.
dispose()

// Удаление всех слушателей.
messageEmitter.dispose()
```
