import type { MessageSchema } from '@/i18n'

import 'vue-i18n'

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}
