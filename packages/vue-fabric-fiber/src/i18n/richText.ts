import type { RichText, RichTextSegment } from '@/types/docs'

export function text(value: string): RichTextSegment {
  return {
    type: 'text',
    value,
  }
}

export function code(value: string): RichTextSegment {
  return {
    type: 'code',
    value,
  }
}

export function richText(...segments: RichTextSegment[]): RichText {
  return segments
}

export function plainRichText(value: string): RichText {
  return richText(text(value))
}
