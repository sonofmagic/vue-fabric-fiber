export type RichTextSegment
  = | {
    type: 'text'
    value: string
  }
  | {
    type: 'code'
    value: string
  }

export type RichText = RichTextSegment[]

export interface DocsSection {
  id: string
  title: string
  description: RichText
  points: RichText[]
  apiList?: string[]
  codeTitle?: string
  code?: string
  codeLang?: string
  footnotes?: RichText[]
}
