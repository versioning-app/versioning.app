import { Header } from '@/components/header';
import { Table } from '@/components/table';
import { GLOBAL_CONFIG_PATH } from '@/constants/config';
import { auth, config } from '@/utils/config';
import React from 'react';
import zod from 'zod';

export const options = zod.object({});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Info(_: Props) {
	const configJson = config();
	const authJson = auth();

	return (
		<>
			<Header />
			<Table
				columns={['key', 'value']}
				data={[
					{
						key: 'Global Config Location',
						value: GLOBAL_CONFIG_PATH,
					},
					{
						key: 'API Endpoint',
						value: configJson.apiEndpoint,
					},
					{
						key: 'API Key',
						value: authJson.apiKey ?? 'Not Set',
					},
				]}
			></Table>
		</>
	);
}
