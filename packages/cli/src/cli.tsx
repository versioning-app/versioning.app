#!/usr/bin/env node
import Pastel from 'pastel';
import { setup } from '@/utils/setup';

const app = new Pastel({
	importMeta: import.meta,
});

setup();

await app.run();
