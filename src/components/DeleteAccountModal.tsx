'use client';

import { FormEvent, useState } from 'react';
import {
  AlertTriangle,
  Loader2,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';

type DeleteAccountModalProps = {
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

export default function DeleteAccountModal({
  open,
  onClose,
  onDeleted,
}: DeleteAccountModalProps) {
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleClose = () => {
    if (loading) return;

    setConfirmation('');
    setError('');
    onClose();
  };

  const handleDelete = async (event: FormEvent) => {
    event.preventDefault();

    setError('');

    if (confirmation !== 'DELETE') {
      setError('Please type DELETE exactly to continue.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmation: 'DELETE',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete your account.');
      }

      onDeleted();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to delete your account.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      {/* Overlay */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-maroon-950/70 backdrop-blur-sm"
        aria-label="Close modal"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-red-100 bg-[#fff8fa] shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#6d0f24] via-[#8d1730] to-[#b42345] px-6 py-7">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>

          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-red-100">
            <ShieldAlert size={24} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.25em] text-red-100/80">
            Danger Zone
          </p>

          <h2
            id="delete-account-title"
            className="mt-2 font-serif text-3xl text-white"
          >
            Delete Account
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-50/80">
            This action is permanent and cannot be undone.
          </p>
        </div>

        <form onSubmit={handleDelete} className="p-6 sm:p-7">
          <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div>
              <p className="text-sm font-bold text-red-800">
                Before you continue
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700/80">
                Your account and associated profile information may be
                permanently removed according to your backend configuration.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="mt-6 block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-maroon-900">
              Type{' '}
              <strong className="rounded bg-red-100 px-1.5 py-0.5 text-red-600">
                DELETE
              </strong>{' '}
              to confirm
            </span>

            <input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="Type DELETE here"
              autoComplete="off"
              className="mt-2 w-full rounded-2xl border border-red-200 bg-white px-4 py-3.5 text-sm font-semibold text-maroon-950 outline-none transition placeholder:font-normal placeholder:text-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100"
            />
          </label>

          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 rounded-full border border-maroon-200 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-maroon-800 transition hover:bg-maroon-50 disabled:opacity-50"
            >
              Keep Account
            </button>

            <button
              type="submit"
              disabled={loading || confirmation !== 'DELETE'}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Delete Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}