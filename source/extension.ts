import * as vscode from 'vscode';
export let decorationEnabled = false;
export const updateDecoration = (editor: vscode.TextEditor): void =>
{

};
export const updateDecorationByDocument = (document: vscode.TextDocument): void =>
    vscode.window.visibleTextEditors
        .filter(i => i.document === document)
        .forEach(i => updateDecoration(i));
export const clearDecorationCache = (): void =>
{

};
export const onDidChangeActiveTextEditor = (): void =>
{
    clearDecorationCache();
    if (vscode.window.activeTextEditor)
    {
        updateDecorationByDocument(vscode.window.activeTextEditor.document);
    }
};
export const onDidOpenTextDocument = (document: vscode.TextDocument): void =>
    updateDecorationByDocument(document);
export const onDidChangeTextDocument = (document: vscode.TextDocument): void =>
{
    clearDecorationCache();
    updateDecorationByDocument(document);
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
