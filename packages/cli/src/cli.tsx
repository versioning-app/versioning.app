#!/usr/bin/env node
import { setup } from '@/utils/setup';
import Pastel from 'pastel';

const app = new Pastel({
	importMeta: import.meta,
});

setup();

await app.run();
