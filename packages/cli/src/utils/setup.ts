import epipebomb from 'epipebomb';

import { isError } from '@/utils/error';

const checkCwdExists = () => {
	try {
		// Test to see if cwd has been deleted before
		// importing 3rd party packages that might need cwd.
		process.cwd();
	} catch (err: unknown) {
		if (isError(err) && err.message.includes('uv_cwd')) {
			// eslint-disable-next-line no-console
			console.error('Error: The current working directory does not exist.');
			process.exit(1);
		}
	}
};

export const setup = () => {
	// Fix for EPIPE errors when piping output to other commands
	// Taken from vercel cli
	epipebomb();

	checkCwdExists();
};
