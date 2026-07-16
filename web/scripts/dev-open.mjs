import { spawn } from "node:child_process";

/**
 * Wraps `next dev` so it auto-opens the browser once ready, using the
 * port Next actually printed (it falls back to 3001+ if 3000 is busy)
 * instead of assuming 3000.
 */
function openBrowser(url) {
	const command =
		process.platform === "win32" ? `start "" "${url}"` : process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`;
	spawn(command, { shell: true, stdio: "ignore", detached: true }).unref();
}

const child = spawn("next dev", {
	shell: true,
	stdio: ["inherit", "pipe", "inherit"],
});

let opened = false;
child.stdout.on("data", (chunk) => {
	const text = chunk.toString();
	process.stdout.write(text);
	if (!opened) {
		const match = text.match(/Local:\s+(http:\/\/localhost:\d+)/);
		if (match) {
			opened = true;
			openBrowser(match[1]);
		}
	}
});

child.on("exit", (code) => process.exit(code ?? 0));
