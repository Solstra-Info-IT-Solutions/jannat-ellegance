'use client';

import { FormEvent, useState } from 'react';
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  X,
} from 'lucide-react';

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

export default function ChangePasswordModal({
  open,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setError(
        'Your new password must contain at least 8 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        'Your new password must be different from your current password.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        '/api/auth/change-password',
        {
          method: 'PATCH',

          credentials: 'include',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to change password.'
        );
      }

      resetForm();

      onSuccess(
        data.message ||
          'Password updated successfully.'
      );

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
      aria-labelledby="change-password-title"
    >
      <button
        type="button"
        onClick={handleClose}
        disabled={loading}
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Close modal"
      />

      <div
        className="
          relative z-10
          my-auto
          w-full max-w-[560px]
          overflow-hidden
          rounded-[24px]
          border border-maroon-100
          bg-[#fff8fa]
          shadow-2xl
          animate-in fade-in zoom-in-95
          duration-200
          sm:rounded-[30px]
        "
      >
        <div
          className="
            relative overflow-hidden
            bg-gradient-to-br
            from-maroon-950
            via-[#7d102d]
            to-rose-900
            px-5 py-6
            sm:px-7 sm:py-8
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-pink-400/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div
                className="
                  grid h-11 w-11 place-items-center
                  rounded-2xl
                  border border-white/10
                  bg-white/10
                  text-pink-200
                  backdrop-blur
                "
              >
                <KeyRound size={21} />
              </div>

              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.24em] text-pink-300 sm:text-[10px]">
                Account Security
              </p>

              <h2
                id="change-password-title"
                className="mt-2 font-serif text-2xl text-white sm:text-3xl"
              >
                Change Password
              </h2>

              <p className="mt-2 text-xs leading-5 text-pink-100/80 sm:text-sm">
                Keep your Jannat Elegance account secure.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
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
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            max-h-[calc(100vh-180px)]
            overflow-y-auto
            px-5 py-6
            sm:max-h-none
            sm:px-7 sm:py-8
          "
        >
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700 sm:text-sm">
              {error}
            </div>
          )}

          {/* CURRENT PASSWORD */}

          <div>
            <label
              htmlFor="current-password"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-maroon-900 sm:text-xs"
            >
              Current Password
            </label>

            <div className="flex items-center rounded-2xl border border-pink-200 bg-white/50 px-4 transition focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-pink-100">
              <Lock
                size={18}
                className="shrink-0 text-pink-400"
              />

              <input
                id="current-password"
                required
                type={
                  showCurrentPassword
                    ? 'text'
                    : 'password'
                }
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setError('');
                }}
                placeholder="Enter your current password"
                autoComplete="current-password"
                className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-maroon-950 outline-none placeholder:text-gray-400 sm:h-14"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
                className="shrink-0 text-gray-400 transition hover:text-maroon-800"
                aria-label="Toggle current password visibility"
              >
                {showCurrentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}

          <div className="mt-5">
            <label
              htmlFor="new-password"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-maroon-900 sm:text-xs"
            >
              New Password
            </label>

            <div className="flex items-center rounded-2xl border border-pink-200 bg-white/50 px-4 transition focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-pink-100">
              <Lock
                size={18}
                className="shrink-0 text-pink-400"
              />

              <input
                id="new-password"
                required
                minLength={8}
                type={
                  showNewPassword
                    ? 'text'
                    : 'password'
                }
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setError('');
                }}
                placeholder="Create a new password"
                autoComplete="new-password"
                className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-maroon-950 outline-none placeholder:text-gray-400 sm:h-14"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(!showNewPassword)
                }
                className="shrink-0 text-gray-400 transition hover:text-maroon-800"
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="mt-5">
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-maroon-900 sm:text-xs"
            >
              Confirm New Password
            </label>

            <div className="flex items-center rounded-2xl border border-pink-200 bg-white/50 px-4 transition focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-pink-100">
              <Lock
                size={18}
                className="shrink-0 text-pink-400"
              />

              <input
                id="confirm-password"
                required
                minLength={8}
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError('');
                }}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-maroon-950 outline-none placeholder:text-gray-400 sm:h-14"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="shrink-0 text-gray-400 transition hover:text-maroon-800"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-gray-500 sm:text-xs">
              Use at least 8 characters for your new password.
            </p>
          </div>

          {/* ACTIONS */}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center rounded-full border border-pink-200 bg-transparent text-xs font-bold uppercase tracking-wider text-maroon-900 transition hover:bg-pink-50 active:scale-[0.98] disabled:opacity-50 sm:h-14"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-maroon-950 via-rose-900 to-pink-600 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:h-14"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}