import { Table } from '@/components/table';
import { getApi } from '@/utils/api';
import { auth } from '@/utils/config';
import Spinner from 'ink-spinner';
import React, { useEffect, useState } from 'react';
import zod from 'zod';

export const options = zod.object({});

type Props = {
	options: zod.infer<typeof options>;
};

export default function ReleaseSteps({ options }: Props) {
	const [response, setResponseData] = useState<any>();
	const api = getApi();
	const authJson = auth();

	useEffect(() => {
		api
			.get(`/${authJson.slug}/release-steps`)
			.then((res) => {
				setResponseData(res.data);
			})
			.catch((err) => {
				setResponseData({ error: err.message });
			});
	}, []);

	if (!response) {
		return <Spinner type="dots6" />;
	}

	if (!response.data) {
		throw new Error(response.error);
	}

	return (
		<>
			<Table
				columns={[
					'id',
					'releaseId',
					'releaseStrategyStepId',
					'status',
					'createdAt',
					'modifiedAt',
				]}
				data={response.data}
			/>
		</>
	);
}
