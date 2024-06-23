import path from 'path';
import { homedir } from 'os';

export const GLOBAL_CONFIG_DIR = path.join(homedir(), '.config/versioning.app');
export const GLOBAL_CONFIG_PATH = path.join(GLOBAL_CONFIG_DIR, 'config.json');
export const GLOBAL_AUTH_PATH = path.join(GLOBAL_CONFIG_DIR, 'auth.json');

export type VersioningAppConfig = {
	'versioning.app': true;
	type: 'config';
	apiEndpoint: string;
};

export type VersioningAppAuth = {
	'versioning.app': true;
	type: 'auth';
	slug?: string;
	apiKey?: string;
};

export const DEFAULT_CONFIG = {
	'versioning.app': true,
	type: 'config',
	apiEndpoint: 'https://versioning.app/api/v1',
} satisfies VersioningAppConfig;

export const DEFAULT_AUTH = {
	'versioning.app': true,
	type: 'auth',
	apiKey: undefined,
} satisfies VersioningAppAuth;

export const isVersioningAppConfig = (
	config: any,
): config is VersioningAppConfig => {
	return (
		config &&
		config['versioning.app'] === true &&
		typeof config.type === 'string' &&
		config.type === 'config'
	);
};

export const isVersioningAppAuth = (auth: any): auth is VersioningAppAuth => {
	return (
		auth &&
		auth['versioning.app'] === true &&
		typeof auth.type === 'string' &&
		auth.type === 'auth'
	);
};
