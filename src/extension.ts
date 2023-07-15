import * as vscode from 'vscode';
import { activateCommands } from './activateCommands';

export function activate(context: vscode.ExtensionContext) {
	const { disableCoverage, enableCoverage } = activateCommands();
	context.subscriptions.push(disableCoverage, enableCoverage);
}
