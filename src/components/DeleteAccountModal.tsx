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
      className="
        fixed inset-0 z-[110]
        flex items-center justify-center
        overflow-y-auto
        bg-maroon-950/70
        px-3 py-4
        backdrop-blur-sm
        sm:px-5 sm:py-8
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      {/* Click outside to close */}
      <button
        type="button"
        onClick={handleClose}
        disabled={loading}
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Close modal"
      />

      {/* ================= MODAL ================= */}

      <div
        className="
          relative z-10
          my-auto
          w-full max-w-[560px]
          overflow-hidden
          rounded-[24px]
          border border-red-100/80
          bg-[#fff8fa]
          shadow-2xl
          animate-in fade-in zoom-in-95
          duration-200
          sm:rounded-[30px]
        "
      >

        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden bg-gradient-to-br from-maroon-950 via-[#7d102d] to-[#b42345] px-5 py-6 sm:px-7 sm:py-8">

          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-red-400/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">

            <div>
              {/* Icon */}
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-red-100 backdrop-blur">
                <ShieldAlert size={21} />
              </div>

              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.24em] text-red-100/80 sm:text-[10px]">
                Danger Zone
              </p>

              <h2
                id="delete-account-title"
                className="mt-2 font-serif text-2xl text-white sm:text-3xl"
              >
                Delete Account
              </h2>

              <p className="mt-2 text-xs leading-5 text-red-50/80 sm:text-sm">
                This action is permanent and cannot be undone.
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                grid h-10 w-10 shrink-0 place-items-center
                rounded-full
                bg-white/10
                text-white
                transition
                hover:bg-white/20
                active:scale-95
                disabled:opacity-50
              "
              aria-label="Close"
            >
              <X size={19} />
            </button>

          </div>
        </div>

        {/* ================= CONTENT ================= */}

        <form
          onSubmit={handleDelete}
          className="
            max-h-[calc(100vh-180px)]
            overflow-y-auto
            px-5 py-6
            sm:max-h-none
            sm:px-7 sm:py-8
          "
        >

          {/* Warning Card */}

          <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50/80 px-4 py-4">

            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-red-800">
                Before you continue
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700/80">
                Your account and associated profile information may be
                permanently removed according to your backend configuration.
              </p>
            </div>

          </div>

          {/* Error */}

          {error && (
            <div
              className="
                mt-5
                rounded-2xl
                border border-red-200
                bg-red-50
                px-4 py-3
                text-xs
                leading-5
                text-red-700
                sm:text-sm
              "
            >
              {error}
            </div>
          )}

          {/* ================= CONFIRM INPUT ================= */}

          <label className="mt-6 block">

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-maroon-900 sm:text-[11px]">

              Type{' '}

              <strong className="mx-1 rounded-md bg-red-100 px-2 py-1 text-red-600">
                DELETE
              </strong>

              {' '}to confirm

            </span>

            <input
              value={confirmation}
              onChange={(event) => {
                setConfirmation(event.target.value);
                setError('');
              }}
              placeholder="Type DELETE here"
              autoComplete="off"
              className="
                mt-3
                h-12
                w-full
                rounded-2xl
                border border-red-200
                bg-white/60
                px-4
                text-sm font-semibold
                text-maroon-950
                outline-none
                transition
                placeholder:font-normal
                placeholder:text-gray-400
                focus:border-red-400
                focus:ring-4
                focus:ring-red-100
                sm:h-14
              "
            />

          </label>

          <p className="mt-3 text-[11px] leading-5 text-gray-500">
            Please make sure you understand that this action cannot be reversed.
          </p>

          {/* ================= ACTIONS ================= */}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">

            {/* Keep Account */}

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                flex h-12 flex-1 items-center justify-center
                rounded-full
                border border-maroon-200
                bg-transparent
                px-5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-maroon-800
                transition
                hover:bg-maroon-50
                active:scale-[0.98]
                disabled:opacity-50
                sm:h-14
              "
            >
              Keep Account
            </button>

            {/* Delete */}

            <button
              type="submit"
              disabled={loading || confirmation !== 'DELETE'}
              className="
                flex h-12 flex-1 items-center justify-center gap-2
                rounded-full
                bg-gradient-to-r
                from-red-700
                via-red-600
                to-rose-600
                px-5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
                shadow-lg shadow-red-500/20
                transition-all
                hover:-translate-y-0.5
                hover:shadow-xl
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:translate-y-0
                sm:h-14
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
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