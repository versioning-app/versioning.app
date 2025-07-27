'use client';

import type { CardProps } from '@nextui-org/react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spacer,
} from '@nextui-org/react';
import React from 'react';

interface CardFieldProps extends CardProps {
  fieldName: string;
  description?: string;
}

export default function CardField({
  fieldName,
  description,
  ...props
}: CardFieldProps) {
  const [value, setValue] = React.useState<string>('');

  return (
    <Card className="w-full max-w-[500px]" {...props}>
      <CardHeader className="px-6 pb-0 pt-6">
        <div className="flex flex-col items-start">
          <h4 className="text-large">{fieldName}</h4>
          <p className="text-small text-default-500">{description}</p>
        </div>
      </CardHeader>
      <Spacer y={2} />
      <CardBody className="px-4"></CardBody>
      <Spacer y={2} />
      <Divider />
      <CardFooter className="flex-wrap-reverse justify-between gap-2 px-4 md:flex-wrap">
        {/* <p className="text-small text-default-400">
          Max. 50 characters.{' '}
          <span className="text-default-500">{orgName.length}/50</span>
        </p> */}
        <div className="flex items-center gap-2">
          <Button variant="bordered">Cancel</Button>
          <Button color="primary">Save Changes</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
