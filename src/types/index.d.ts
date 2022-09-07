
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
  action: (args?: any | any[], helper?: any) => boolean | Promise<boolean> | void
}
export interface CommandsInterface extends AnswerInterface {
  description?: string
}
export interface Path {
  [path: string]: string | Path
}

export type InfiniteArray<T> = Array<InfiniteArray<T>|T>

export interface FileAction {
  file: string
  action: (args?: any | any[], helper?: any) => boolean | Promise<boolean>
}

export interface User {
  username: string
  password: string
  auth?: {
    commands?: string[],
    dirs?: string[] 
  }
}

export interface authParams {
  user: string | User
  directory?: string | string[]
  command?: string
}

type MessageTypes = "default" | "warning" | "error"