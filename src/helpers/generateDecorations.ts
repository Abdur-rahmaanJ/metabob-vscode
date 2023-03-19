import * as vscode from 'vscode'
import { Problem } from '../types'

const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: new vscode.ThemeColor('diffEditor.removedTextBackground'),
  isWholeLine: true,
  overviewRulerLane: 7,
  overviewRulerColor: 'red'
})

export function GenerateDecorations(results: Problem[], editor: vscode.TextEditor) {
  const decorations: vscode.DecorationOptions[] = results.map(vulnerability => {
    const range = new vscode.Range(
      vulnerability.startLine - 1,
      0,
      vulnerability.endLine - 1,
      editor.document.lineAt(vulnerability.endLine - 1).text.length
    )

    const hoverDiscardMessageURI = encodeURI(
      JSON.stringify({
        id: vulnerability.id,
        path: vulnerability.path
      })
    )
    const endorseSuggestionURI = encodeURI(
      JSON.stringify({
        id: vulnerability.id
      })
    )

    const viewDescriptionURI = encodeURI(
      JSON.stringify({
        filepath: vulnerability.path,
        id: vulnerability.id
      })
    )

    const hoverDiscardMessage = `**[Discard](command:metabob.discardSuggestion?${hoverDiscardMessageURI})**`
    const hoverEndorseMessage = `**[Endorse](command:metabob.endorseSuggestion?${endorseSuggestionURI})**`
    const hoverViewDescriptionMessage = `**[Ask Question](command:recommendation-panel-webview.focus?${viewDescriptionURI})**`
    const hoverMessage = new vscode.MarkdownString(
      `### **CATEGORY:** ${vulnerability.category}\n\n${vulnerability.summary}\n\n${hoverDiscardMessage} |\r${hoverEndorseMessage} |\r${hoverViewDescriptionMessage}`
    )
    hoverMessage.isTrusted = true

    return {
      range,
      hoverMessage,
      renderOptions: {
        after: {
          contentText: '×',
          color: 'red'
        }
      }
    } satisfies vscode.DecorationOptions
  })

  return {
    decorationType,
    decorations
  }
}
