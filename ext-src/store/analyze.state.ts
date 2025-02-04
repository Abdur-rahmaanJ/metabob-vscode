import * as vscode from 'vscode'
import { CONSTANTS } from '../constants'
import { ExtensionState, ExtensionStateValue } from './base.state'

export type IAnalyzeState = {
  [filepathAndProblemId: string]: {
    id: string
    path: string
    startLine: number
    endLine: number
    category: string
    summary: string
    description: string
    isDiscarded?: boolean
  }
}

// Whenever the user Analyze the file, we will store the response of the request in
// a store, so user will be able to see decorations upon changing files.
export class AnalyzeState extends ExtensionState<IAnalyzeState> {
  constructor(context: vscode.ExtensionContext) {
    super(context, CONSTANTS.analyze)
  }

  get(): ExtensionStateValue<IAnalyzeState> | undefined {
    return this.context.globalState.get<ExtensionStateValue<IAnalyzeState>>(this.key)
  }

  set(value: IAnalyzeState): Thenable<void> {
    const stateValue = { key: this.key, value }

    return this.context.globalState.update(this.key, stateValue)
  }

  update(callback: (value: IAnalyzeState) => IAnalyzeState): Thenable<void | undefined> {
    const currentValue = this.get()?.value ?? {}
    const updatedValue = callback(currentValue)
    
    return this.set(updatedValue)
  }

  clear(): void {
    this.context.globalState.update(this.key, undefined);
  }
}
