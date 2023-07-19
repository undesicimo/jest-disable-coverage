import * as vscode from 'vscode';

const coverageToggleTo = (isCoverageOn: boolean) => {
	return () => {
		const [configPath, defaultConfig] = [
			vscode.workspace
				.getConfiguration()
				.get<string>('jest-coverage-disabler.jestConfigPath'),
			vscode.workspace
				.getConfiguration()
				.get<string>('jest-coverage-disabler.configDefault', ''),
		];
		const workspaceFolders = vscode.workspace.workspaceFolders;

		workspaceFolders?.forEach(folder => {
			const jestConfigPath = vscode.Uri.file(
				`${folder.uri.path}/${configPath}`
			);
			vscode.workspace.fs.readFile(jestConfigPath).then(readData => {
				const jestConfigData = readData.toString();
				//ここでcollectCoverageをfalse
				const newJestConfig = jestConfigData.replace(
					isCoverageOn ? 'collectCoverage: false' : defaultConfig,
					isCoverageOn ? defaultConfig : 'collectCoverage: false'
				);
				vscode.workspace.fs.writeFile(
					jestConfigPath,
					Buffer.from(newJestConfig)
				);
			});
		});
		isCoverageOn
			? vscode.window.showInformationMessage(`カバレッジ取るよ🥩,${configPath}`)
			: vscode.window.showInformationMessage('カバレッジ取らないよ🍕');
	};
};

export const activateCommands = () => {
	const disableCoverage = vscode.commands.registerCommand(
		'jest-coverage-disabler.disable',
		coverageToggleTo(false)
	);
	const enableCoverage = vscode.commands.registerCommand(
		'jest-coverage-disabler.enable',
		coverageToggleTo(true)
	);
	return { disableCoverage, enableCoverage };
};
