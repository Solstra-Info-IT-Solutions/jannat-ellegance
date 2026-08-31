'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Loader2,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

type DeleteAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;

    setConfirmation('');
    setMessage('');

    onClose();
  };

  const handleDelete = async () => {
    if (confirmation !== 'DELETE') {
      setMessage('Please type DELETE exactly to continue.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      /*
      =====================================
      BACKEND API

      Expected endpoint:

      DELETE /api/auth/delete-account
      */

      const response = await fetch(
        '/api/auth/delete-account',
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Unable to delete your account.'
        );
      }

      await logout();

      router.push('/');

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className="
          fixed
          inset-0
          z-[100]
          bg-maroon-950/70
          backdrop-blur-sm
        "
      />

      {/* Modal */}
      <div
        className="
          fixed
          inset-0
          z-[101]
          flex
          items-center
          justify-center
          px-4
          py-6
        "
      >
        <div
          className="
            relative
            w-full
            max-w-md
            overflow-hidden
            rounded-[30px]
            border
            border-red-200
            bg-[#fff8fa]
            shadow-2xl
          "
        >
          {/* Top Danger Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-700 via-rose-500 to-red-700" />

          <div className="px-6 pb-7 pt-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="
                    mb-4
                    grid
                    h-14
                    w-14
                    place-items-center
                    rounded-2xl
                    bg-red-50
                    text-red-600
                    shadow-sm
                  "
                >
                  <Trash2 size={24} />
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                  Dangerous Action
                </p>

                <h2 className="mt-2 font-serif text-3xl text-maroon-950">
                  Delete Account
                </h2>
              </div>

              <button
                onClick={handleClose}
                disabled={loading}
                className="
                  grid
                  h-10
                  w-10
                  place-items-center
                  rounded-full
                  bg-pink-100/70
                  text-maroon-800
                  transition
                  hover:bg-pink-200
                "
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* Warning Box */}
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
              "
            >
              <div className="flex gap-3">
                <AlertTriangle
                  size={20}
                  className="shrink-0 text-red-600"
                />

                <div>
                  <p className="text-sm font-bold text-red-800">
                    This action cannot be undone.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700/80">
                    Your account and associated personal account data
                    will be permanently removed.
                  </p>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="mt-5 flex gap-3 rounded-2xl border border-maroon-100 bg-pink-50/60 p-4">
              <ShieldAlert
                size={19}
                className="shrink-0 text-maroon-700"
              />

              <p className="text-xs leading-5 text-maroon-900/70">
                Before deleting your account, please make sure you have
                reviewed your order history and saved any information you
                may need.
              </p>
            </div>

            {/* Confirmation */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-maroon-900">
                Type{' '}
                <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-600">
                  DELETE
                </span>{' '}
                to confirm
              </label>

              <input
                type="text"
                value={confirmation}
                onChange={(event) =>
                  setConfirmation(event.target.value)
                }
                placeholder="Type DELETE here"
                disabled={loading}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-maroon-100
                  bg-[#fff8fa]
                  px-4
                  py-3.5
                  text-sm
                  text-maroon-950
                  outline-none
                  transition
                  placeholder:text-maroon-400
                  focus:border-red-400
                  focus:ring-4
                  focus:ring-red-100
                "
              />
            </div>

            {/* Error */}
            {message && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="
                  rounded-full
                  border
                  border-maroon-200
                  bg-transparent
                  px-4
                  py-3.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-maroon-900
                  transition
                  hover:bg-pink-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading || confirmation !== 'DELETE'}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-gradient-to-r
                  from-red-700
                  to-rose-600
                  px-4
                  py-3.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  shadow-lg
                  transition
                  hover:-translate-y-0.5
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}