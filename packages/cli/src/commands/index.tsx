import { Header } from '@/components/header';
import { Text } from 'ink';
import Gradient from 'ink-gradient';
import React from 'react';
import zod from 'zod';

export const options = zod.object({});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({ options }: Props) {
	return (
		<>
			<Header />
			<Text color="green">
				Run <Gradient name="mind">versioning help</Gradient> to see available
			</Text>
		</>
	);
}
