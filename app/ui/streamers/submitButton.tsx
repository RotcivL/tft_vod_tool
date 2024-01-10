'use client';

import { useFormStatus } from 'react-dom';
import Button from '../button';

export function SubmitButton() {
  const { pending } = useFormStatus();
  console.log(pending);

  return (
    <Button type="submit">{pending ? 'loading...' : 'Add Streamer'}</Button>
  );
}

