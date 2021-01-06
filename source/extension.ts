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
    clearDecorationCache();
    const editor = vscode.window.activeTextEditor;
    if (editor?.document === document)
    {
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
                    document.positionAt(match.index +match[0].length -1)
                ),
                renderOptions:
                {
                    after:
                    {
                        contentText: match[0].trim(),
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
    if (vscode.window.activeTextEditor)
    {
        updateDecoration(vscode.window.activeTextEditor.document);
    }
    else
    {
        clearDecorationCache();
    }
};
export const onDidOpenTextDocument = (document: vscode.TextDocument): void =>
    updateDecoration(document);
export const onDidChangeTextDocument = (document: vscode.TextDocument): void =>
{
    updateDecoration(document);
};

export const activate = (context: vscode.ExtensionContext) =>
{
    context.subscriptions.push
    (
        vscode.commands.registerCommand('decorationPerformanceTest.start', () => {
            decorationEnabled = true;
            onDidChangeActiveTextEditor();
        }),
        vscode.commands.registerCommand('decorationPerformanceTest.stop', () => {
            decorationEnabled = false;
            onDidChangeActiveTextEditor();
        }),
        vscode.workspace.onDidChangeTextDocument(event => onDidChangeTextDocument(event.document)),
        vscode.workspace.onDidOpenTextDocument(document => onDidOpenTextDocument(document)),
        vscode.window.onDidChangeActiveTextEditor(() => onDidChangeActiveTextEditor()),
    );
};
export const deactivate = () => { };
