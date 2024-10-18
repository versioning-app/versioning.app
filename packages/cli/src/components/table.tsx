import { Box, Text } from 'ink';
import React from 'react';

export function Table({
	columns,
	data,
}: {
	columns: string[];
	data: Record<string, string>[];
}) {
	return (
		<Box flexDirection="column" columnGap={1}>
			<Box>
				{columns.map((column) => (
					<Box key={column} width={`${100 / columns.length}%`}>
						<Text bold={true} color={'yellow'}>
							{column.toUpperCase()}
						</Text>
					</Box>
				))}
			</Box>
			{data.map((row, index) => (
				<Box key={index}>
					{columns.map((column, colIndex) => (
						<Box key={column} width={`${100 / columns.length}%`}>
							<Text color={colIndex === 0 ? 'green' : 'magenta'}>
								{row[column]}
							</Text>
						</Box>
					))}
				</Box>
			))}
		</Box>
	);
}
