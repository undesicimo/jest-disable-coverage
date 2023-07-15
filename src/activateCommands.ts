import * as vscode from 'vscode';

const coverageToggle = (isCoverageOn: boolean) => {
	return () => {
		const workspace = vscode.workspace.workspaceFolders;
		workspace?.forEach(folder => {
			const jestConfigPath = vscode.Uri.file(
				// NOTE: いまのところworkhub-backend/v2_core-apiに使う想定なので、直描き。。
				// TODO: 他のrepoに使えるように拡張する
				`${folder.uri.path}/packages/v2_core-api/jest.common.config.js`
			);
			vscode.workspace.fs.readFile(jestConfigPath).then(readData => {
				const jestConfigData = readData.toString();
				//ここでcollectCoverageをfalse
				const newJestConfig = jestConfigData.replace(
					// HACK: ここも直書き。。
					//上書き処理
					isCoverageOn
						? 'collectCoverage: false'
						: "collectCoverage: process.env.DISABLE_COVERAGE === 'true' ? false : true",
					isCoverageOn
						? "collectCoverage: process.env.DISABLE_COVERAGE === 'true' ? false : true"
						: 'collectCoverage: false'
				);
				vscode.workspace.fs.writeFile(
					jestConfigPath,
					Buffer.from(newJestConfig)
				);
			});
		});
		isCoverageOn
			? vscode.window.showInformationMessage('カバレッジ取るよ🥩')
			: vscode.window.showInformationMessage('カバレッジ取らないよ🍕');
	};
};

export const activateCommands = () => {
	const disableCoverage = vscode.commands.registerCommand(
		'jest-coverage-disabler.disable',
		coverageToggle(false)
	);
	const enableCoverage = vscode.commands.registerCommand(
		'jest-coverage-disabler.enable',
		coverageToggle(true)
	);
	return { disableCoverage, enableCoverage };
};
