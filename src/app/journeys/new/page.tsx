import { Metadata } from 'next';
import JourneyForm from '@/components/journey/JourneyForm';

export const metadata: Metadata = {
  title: 'Create Journey — QuranTogether',
};

export default function NewJourneyPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Start a New Journey</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a shared recitation journey and invite others to participate.
        </p>
      </div>
      <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
        <JourneyForm />
      </div>
    </div>
  );
}
