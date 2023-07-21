import {IMessageListenerDisposer} from '../interfaces/IMessageListenerDisposer'
import {IUserContext} from '../interfaces/IUserContext'

export type TMessageListenerContext<C extends IUserContext> = IMessageListenerDisposer & C
