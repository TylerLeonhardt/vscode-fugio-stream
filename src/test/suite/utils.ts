import { CancellationToken, commands } from "vscode";

export async function waitForInQuickPick(token: CancellationToken) {
	while (!token.isCancellationRequested) {
		const result = await commands.executeCommand('getContextKeyInfo') as Array<{ key: string }>;
		if (result.find((item) => item.key === 'inQuickOpen')) {
			// Workaround the fact that the quick pick is not yet visible
			await new Promise((resolve) => setTimeout(resolve, 100));
			break;
		}
		// Don't spam the API
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}
