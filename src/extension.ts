import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "json-path-extension.getPath",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;

        vscode.commands
          .executeCommand<vscode.DocumentSymbol[]>(
            "vscode.executeDocumentSymbolProvider",
            document.uri
          )
          .then((symbols) => {
            if (symbols !== undefined) {
              vscode.env.clipboard.writeText(
                findPath(symbols, editor.selection.active) + ""
              );
            }
          });
      }
    }
  );

  context.subscriptions.push(disposable);
}

function findPath(
  symbols: vscode.DocumentSymbol[],
  pos: vscode.Position
): String {
  let symbol = symbols.find(
    (symbol) =>
      symbol.range &&
      symbol.range.start.isBefore(pos) &&
      symbol.range.end.isAfter(pos)
  );
  if (symbol) {
    let child = findPath(symbol.children, pos);

    return symbol.name + (child === "" ? "" : ".") + child;
  }
  return "";
}

// this method is called when your extension is deactivated
export function deactivate() {}
