import { Header } from '@/components/header';
import { getApi } from '@/utils/api';
import { auth } from '@/utils/config';
import { Text } from 'ink';
import Spinner from 'ink-spinner';
import React, { useEffect, useState } from 'react';
import zod from 'zod';

export const options = zod.object({
	type: zod.enum(['ping']),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Webhooks({ options }: Props) {
	const [response, setResponseData] = useState<any>();
	const api = getApi();
	const authJson = auth();

	useEffect(() => {
		api
			.post(`/webhooks/${authJson.slug}`, {
				type: options.type,
			})
			.then((res) => {
				setResponseData(res.data);
			})
			.catch((err) => {
				setResponseData({ error: err.message });
			});
	}, []);

	return (
		<>
			<Header />
			{!response ? <Spinner type="dots6" /> : null}
			{response ? <Text>{JSON.stringify(response, null, 2)}</Text> : null}
		</>
	);
}
