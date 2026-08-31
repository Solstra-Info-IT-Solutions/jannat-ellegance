'use client';

import { useState } from 'react';
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  X,
} from 'lucide-react';

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({
  isOpen,
  onClose,
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    console.log({
      currentPassword,
      newPassword,
    });

    // API integration later
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-maroon-950/50 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-8">

      {/* Overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      {/* Modal */}
      <div
        className="
          relative
          z-10
          my-auto
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-[24px]
          border
          border-maroon-100
          bg-[#fff8fa]
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
          duration-200
          sm:rounded-[30px]
        "
      >

        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden bg-gradient-to-br from-maroon-950 via-[#7d102d] to-rose-900 px-5 py-6 sm:px-7 sm:py-8">

          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-400/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">

            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-pink-200 backdrop-blur">

                <KeyRound size={21} />

              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-pink-300 sm:text-[10px]">
                Account Security
              </p>

              <h2 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                Change Password
              </h2>

              <p className="mt-2 text-xs leading-5 text-pink-100/80 sm:text-sm">
                Keep your Jannat Elegance account secure.
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="
                grid
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-full
                bg-white/10
                text-white
                transition
                hover:bg-white/20
                active:scale-95
              "
              aria-label="Close"
            >
              <X size={19} />
            </button>

          </div>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-180px)] overflow-y-auto px-5 py-6 sm:max-h-none sm:px-7 sm:py-8"
        >

          {/* Current Password */}

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-maroon-900 sm:text-xs">
              Current Password
            </label>

            <div className="flex items-center rounded-2xl border border-pink-200 bg-white/50 px-4 transition focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-pink-100">

              <Lock
                size={18}
                className="shrink-0 text-pink-400"
              />

              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Enter your current password"
                className="
                  h-12
                  min-w-0
                  flex-1
                  bg-transparent
                  px-3
                  text-sm
                  text-maroon-950
                  outline-none
                  placeholder:text-gray-400
                  sm:h-13
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(!showCurrentPassword)
                }
                className="shrink-0 text-gray-400 transition hover:text-maroon-800"
              >
                {showCurrentPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* New Password */}

          <div className="mt-5">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-maroon-900 sm:text-xs">
              New Password
            </label>

            <div className="flex items-center rounded-2xl border border-pink-200 bg-white/50 px-4 transition focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-pink-100">

              <Lock
                size={18}
                className="shrink-0 text-pink-400"
              />

              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Create a new password"
                className="
                  h-12
                  min-w-0
                  flex-1
                  bg-transparent
                  px-3
                  text-sm
                  text-maroon-950
                  outline-none
                  placeholder:text-gray-400
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(!showNewPassword)
                }
                className="shrink-0 text-gray-400 transition hover:text-maroon-800"
              >
                {showNewPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* Confirm Password */}

          <div className="mt-5">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-maroon-900 sm:text-xs">
              Confirm New Password
            </label>

            <div className="flex items-center rounded-2xl border border-pink-200 bg-white/50 px-4 transition focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-pink-100">

              <Lock
                size={18}
                className="shrink-0 text-pink-400"
              />

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your new password"
                className="
                  h-12
                  min-w-0
                  flex-1
                  bg-transparent
                  px-3
                  text-sm
                  text-maroon-950
                  outline-none
                  placeholder:text-gray-400
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="shrink-0 text-gray-400 transition hover:text-maroon-800"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            <p className="mt-3 text-[11px] leading-5 text-gray-500 sm:text-xs">
              Use at least 6 characters for your new password.
            </p>
          </div>

          {/* ================= ACTION BUTTONS ================= */}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-12
                flex-1
                items-center
                justify-center
                rounded-full
                border
                border-pink-200
                bg-transparent
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-maroon-900
                transition
                hover:bg-pink-50
                sm:h-13
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                flex
                h-12
                flex-1
                items-center
                justify-center
                rounded-full
                bg-gradient-to-r
                from-maroon-950
                via-rose-900
                to-pink-600
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
                shadow-lg
                shadow-rose-900/20
                transition-all
                hover:-translate-y-0.5
                hover:shadow-xl
                active:scale-[0.98]
                sm:h-13
              "
            >
              Update Password
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}