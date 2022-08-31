
export type Writeable<T extends {[x: string]: any}> = {
  -readonly [P in keyof T]: T[P]
}

export interface TerminalInterface {
  target: HTMLElement
  style?: Partial<CSSStyleDeclaration>
}

export interface CreateNodeProps {
  tag?: string
  className?: string | string[]
  id?: string
  src?: string
  attributes?: [string, string][]
  textContent?: string
  subNodes?: CreateNodeProps | CreateNodeProps[]
  onClick?: () => void
  style?: Partial<CSSStyleDeclaration>
}

export interface EventsInterface { [T: string]: { pointer: number, actions: Function[] } }

export type ElementTypes = "print" | "input"

export interface AnswerInterface {
  answer: string
  action: (args?: any | any[], helper?: any) => boolean | Promise<boolean>
}
export interface Path {
  [path: string]: string | Path
}

export type InfiniteArray<T> = Array<InfiniteArray<T>|T>

export interface FileAction {
  file: string
  action: (args?: any | any[], helper?: any) => boolean | Promise<boolean>
}