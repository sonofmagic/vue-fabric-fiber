/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module '*.vue?raw' {
  const content: string
  export default content
}

declare module '*.json?raw' {
  const content: string
  export default content
}

interface ImportMetaEnv {
}
