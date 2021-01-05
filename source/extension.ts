import * as vscode from 'vscode';
export let decorationEnabled = false;
export let decoration: vscode.TextEditorDecorationType | undefined;
export const regExpExecToArray = (regexp: RegExp, text: string) =>
{
    const result: RegExpExecArray[] = [];
    while(true)
    {
        const match = regexp.exec(text);
        if (null === match)
        {
            break;
        }
        result.push(match);
    }
    return result;
};
export const updateDecoration = (document: vscode.TextDocument): void =>
{
    const editor = vscode.window.activeTextEditor;
    if (editor?.document === document)
    {
        clearDecorationCache();
        decoration = vscode.window.createTextEditorDecorationType
        ({
            isWholeLine: true,
            //color,
        });
        const options: vscode.DecorationOptions[] = [];
        const color = "#888888";
        const text = document.getText();
        regExpExecToArray(/^.*$/gum, text)
        .map
        (
            match => options.push
            ({
                range: new vscode.Range
                (
                    document.positionAt(match.index),
                    document.positionAt(match.index +match[0].length)
                ),
                renderOptions:
                {
                    after:
                    {
                        contentText: match[0],
                        color,
                    }
                }
            })
        );
        editor.setDecorations
        (
            decoration,
            options
        );
    }
};
export const clearDecorationCache = (): void =>
{
    decoration?.dispose();
    decoration = undefined;
};
export const onDidChangeActiveTextEditor = (): void =>
{
    clearDecorationCache();
    if (vscode.window.activeTextEditor)
    {
        updateDecoration(vscode.window.activeTextEditor.document);
    }
};
export const onDidOpenTextDocument = (document: vscode.TextDocument): void =>
    updateDecoration(document);
export const onDidChangeTextDocument = (document: vscode.TextDocument): void =>
{
    clearDecorationCache();
    updateDecoration(document);
};

export const activate = (context: vscode.ExtensionContext) =>
{
    context.subscriptions.push
    (
        vscode.commands.registerCommand('decorationPerformanceTest.start', () => {
            vscode.window.showInformationMessage('Hello World from vscode-decoration-performance-test!(start)');
        }),
        vscode.commands.registerCommand('decorationPerformanceTest.stop', () => {
            vscode.window.showInformationMessage('Hello World from vscode-decoration-performance-test!(stop)');
        }),
        vscode.workspace.onDidChangeTextDocument(event => onDidChangeTextDocument(event.document)),
        vscode.workspace.onDidOpenTextDocument(document => onDidOpenTextDocument(document)),
        vscode.window.onDidChangeActiveTextEditor(() => onDidChangeActiveTextEditor()),
    );
};
export const deactivate = () => { };
