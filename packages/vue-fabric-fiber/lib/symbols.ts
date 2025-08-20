import type { InjectionKey } from 'vue'
import type { Context } from './types'

export const ContextKey = Symbol('ContextKey') as InjectionKey<Context>
