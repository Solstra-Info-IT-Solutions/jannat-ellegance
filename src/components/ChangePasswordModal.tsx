'use client';

import { FormEvent, useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2, LockKeyhole, X } from 'lucide-react';

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
};

export default function ChangePasswordModal({
  open,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleClose = () => {
    if (loading) return;

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');

    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Your new password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to change password.');
      }

      onSuccess?.('Password changed successfully.');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      onClose();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to change password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
    >
      {/* Overlay */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-maroon-950/60 backdrop-blur-sm"
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-pink-100 bg-[#fff8fa] shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-maroon-950 via-rose-900 to-maroon-950 px-6 py-7">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-400/20 blur-2xl" />

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="relative">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-pink-200">
              <KeyRound size={22} />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-300">
              Account Security
            </p>

            <h2
              id="change-password-title"
              className="mt-2 font-serif text-3xl text-white"
            >
              Change Password
            </h2>

            <p className="mt-2 text-sm leading-6 text-pink-100/75">
              Keep your Jannat Elegance account secure.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Current Password */}
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-maroon-900">
              Current Password
            </span>

            <div className="relative mt-2">
              <LockKeyhole
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-400"
              />

              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                placeholder="Enter your current password"
                className="w-full rounded-2xl border border-maroon-100 bg-white/70 py-3.5 pl-11 pr-12 text-sm text-maroon-950 outline-none transition placeholder:text-gray-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />

              <button
                type="button"
                onClick={() => setShowCurrent((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-maroon-800"
              >
                {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {/* New Password */}
          <label className="mt-5 block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-maroon-900">
              New Password
            </span>

            <div className="relative mt-2">
              <LockKeyhole
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-400"
              />

              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Create a new password"
                className="w-full rounded-2xl border border-maroon-100 bg-white/70 py-3.5 pl-11 pr-12 text-sm text-maroon-950 outline-none transition placeholder:text-gray-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />

              <button
                type="button"
                onClick={() => setShowNew((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-maroon-800"
              >
                {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {/* Confirm Password */}
          <label className="mt-5 block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-maroon-900">
              Confirm New Password
            </span>

            <div className="relative mt-2">
              <LockKeyhole
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-400"
              />

              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your new password"
                className="w-full rounded-2xl border border-maroon-100 bg-white/70 py-3.5 pl-11 pr-12 text-sm text-maroon-950 outline-none transition placeholder:text-gray-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />

              <button
                type="button"
                onClick={() => setShowConfirm((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-maroon-800"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <p className="mt-3 text-xs leading-5 text-gray-400">
            Use at least 6 characters for your new password.
          </p>

          {/* Actions */}
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 rounded-full border border-maroon-200 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-maroon-800 transition hover:bg-maroon-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-900 to-pink-600 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}