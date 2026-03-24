'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface JourneyCompleteModalProps {
  dedicationName: string;
}

export default function JourneyCompleteModal({ dedicationName }: JourneyCompleteModalProps) {
  const [open, setOpen] = useState(true);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <div className="text-center px-2 pb-2">
        <div className="mb-4 text-4xl">🤲</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Jazakallah Khayran</h2>
        <p className="text-slate-600 leading-relaxed">
          Thank you for being part of this journey. May Allah accept it on behalf of{' '}
          <span className="font-semibold text-slate-800">{dedicationName}</span> and reward
          everyone who took part.
        </p>
        <p className="mt-3 text-sm text-emerald-700 font-medium">آمين</p>
        <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
          Ameen
        </Button>
      </div>
    </Modal>
  );
}
