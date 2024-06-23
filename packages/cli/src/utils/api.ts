import { auth, config } from '@/utils/config';
import axios from 'axios';
import https from 'https';

export const getApi = () => {
	const configJson = config();
	const authJson = auth();

	if (!authJson.apiKey) {
		throw new Error('API Key not set');
	}

	let agent;

	if (configJson.apiEndpoint.startsWith('https://localhost')) {
		agent = new https.Agent({
			rejectUnauthorized: false,
		});
	}

	return axios.create({
		baseURL: configJson.apiEndpoint,
		headers: {
			'X-Api-Key': authJson.apiKey,
		},
		httpsAgent: agent,
	});
};
