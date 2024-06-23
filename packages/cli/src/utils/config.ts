import {
	DEFAULT_AUTH,
	DEFAULT_CONFIG,
	GLOBAL_AUTH_PATH,
	GLOBAL_CONFIG_DIR,
	GLOBAL_CONFIG_PATH,
	VersioningAppAuth,
	VersioningAppConfig,
	isVersioningAppAuth,
	isVersioningAppConfig,
} from '@/constants/config';
import { readJSONFile } from '@/utils/read-json-file';
import fs from 'fs';

// Returns whether a directory exists
export const isDirectory = (path: string): boolean => {
	try {
		return fs.lstatSync(path).isDirectory();
	} catch (_) {
		// We don't care which kind of error occured, it isn't a directory anyway.
		return false;
	}
};

export const ensureConfigExists = () => {
	ensureConfigDirExists();

	config();
	auth();
};

export const ensureConfigDirExists = () => {
	if (!isDirectory(GLOBAL_CONFIG_DIR)) {
		fs.mkdirSync(GLOBAL_CONFIG_DIR, { recursive: true });
	}

	return GLOBAL_CONFIG_DIR;
};

let cachedConfig: VersioningAppConfig;
let cachedAuth: VersioningAppAuth;

export const config = () => {
	if (cachedConfig) {
		return cachedConfig;
	}

	const configPath = GLOBAL_CONFIG_PATH;

	let config = readJSONFile(configPath);

	if (config === undefined) {
		fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
		config = DEFAULT_CONFIG;
	}

	if (!isVersioningAppConfig(config)) {
		throw new Error(`Invalid config found at ${configPath}`);
	}

	cachedConfig = config;

	return config;
};

export const auth = () => {
	if (cachedAuth) {
		return cachedAuth;
	}

	const authPath = GLOBAL_AUTH_PATH;

	let auth = readJSONFile(authPath);

	if (auth === undefined) {
		fs.writeFileSync(authPath, JSON.stringify(DEFAULT_AUTH, null, 2));
		auth = DEFAULT_AUTH;
	}

	if (!isVersioningAppAuth(auth)) {
		throw new Error(`Invalid auth found at ${auth}`);
	}

	cachedAuth = auth;

	return auth;
};
