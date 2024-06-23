import JSONparse from 'json-parse-better-errors';
import { readFileSync } from 'fs';

export function readJSONFile<T>(file: string): T | undefined {
	const content = readFileSafe(file);

	// If the file doesn't exist, return undefined
	if (content === undefined || content === null) {
		return undefined;
	}

	try {
		const json = JSONparse(content);
		return json || undefined;
	} catch (error) {
		throw new Error(`Can't parse JSON file: ${file}\n${error}`);
	}
}

function readFileSafe(file: string) {
	try {
		return readFileSync(file, 'utf8');
	} catch (_) {
		return undefined;
	}
}
