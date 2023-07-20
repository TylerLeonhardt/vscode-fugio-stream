import * as assert from 'assert';

import * as vscode from 'vscode';
import { waitForInQuickPick } from './utils';
import { getProvider } from '../../quickPicks';
import { beforeEach, afterEach } from 'mocha';

import * as sinon from 'sinon';

suite('QuickPick Test Suite', () => {
	const sandbox = sinon.createSandbox();

    beforeEach(function () {
        sandbox.spy(vscode.window, 'showErrorMessage');
    });

    afterEach(function () {
        sandbox.restore();
    });

	test('happy path', async () => {
		const qp = vscode.window.createQuickPick();
		const resultPromise = getProvider([{
			label: 'github',
		}], qp);

		const source = new vscode.CancellationTokenSource();
		await waitForInQuickPick(source.token);

		await vscode.commands.executeCommand('workbench.action.focusQuickOpen');
		await vscode.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		const result = await resultPromise;
		assert.strictEqual(result.label, 'github');
	});

	test('error case', async () => {
		const qp = vscode.window.createQuickPick();
		const resultPromise = getProvider([{
			label: 'github-enterprise',
			requiredSetting: 'github-enterprise.uri',
		}], qp);

		const source = new vscode.CancellationTokenSource();
		await waitForInQuickPick(source.token);

		await vscode.commands.executeCommand('workbench.action.focusQuickOpen');
		await vscode.commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		assert.rejects(resultPromise, 'The setting github-enterprise.uri is required to use this provider');
		assert(
			(vscode.window.showErrorMessage as sinon.SinonSpy)
				.calledOnceWith(
					'The setting github-enterprise.uri is required to use this provider'
				)
		);
	});
});
