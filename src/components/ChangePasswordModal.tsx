'use client';

import { useState } from 'react';
import {
  X,
  LockKeyhole,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
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

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    setSuccess(false);

    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage('');
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      /*
      ==========================================
      BACKEND API CALL
      ==========================================

      Expected endpoint:

      POST /api/auth/change-password

      Body:
      {
        currentPassword,
        newPassword
      }
      */

      const response = await fetch(
        '/api/auth/change-password',
        {
          method: 'POST',
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Unable to change password.'
        );
      }

      setSuccess(true);
      setMessage('Password changed successfully!');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (error) {
      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    label,
    value,
    onChange,
    show,
    toggleShow,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    toggleShow: () => void;
    placeholder: string;
  }) => (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-maroon-900">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500"
        />

        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="
            w-full
            rounded-2xl
            border
            border-maroon-100
            bg-[#fff8fa]
            py-3.5
            pl-11
            pr-12
            text-sm
            text-maroon-950
            outline-none
            transition
            placeholder:text-maroon-400
            focus:border-pink-400
            focus:ring-4
            focus:ring-pink-100
          "
        />

        <button
          type="button"
          onClick={toggleShow}
          className="
            absolute
            right-3
            top-1/2
            grid
            h-9
            w-9
            -translate-y-1/2
            place-items-center
            rounded-full
            text-maroon-500
            transition
            hover:bg-pink-100
            hover:text-maroon-900
          "
          aria-label="Toggle password visibility"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className="
          fixed
          inset-0
          z-[100]
          bg-maroon-950/60
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
            border-pink-200
            bg-[#fff8fa]
            shadow-2xl
          "
        >
          {/* Top Decoration */}
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-maroon-900 via-pink-500 to-maroon-900" />

          {/* Header */}
          <div className="flex items-start justify-between px-6 pb-4 pt-7">
            <div>
              <div
                className="
                  mb-4
                  grid
                  h-12
                  w-12
                  place-items-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-maroon-900
                  to-pink-600
                  text-white
                  shadow-lg
                "
              >
                <LockKeyhole size={21} />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-pink-600">
                Account Security
              </p>

              <h2 className="mt-2 font-serif text-3xl text-maroon-950">
                Change Password
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
                disabled:opacity-50
              "
              aria-label="Close"
            >
              <X size={19} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 px-6 pb-7"
          >
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              toggleShow={() => setShowCurrent(!showCurrent)}
              placeholder="Enter your current password"
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              toggleShow={() => setShowNew(!showNew)}
              placeholder="Create a new password"
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              toggleShow={() => setShowConfirm(!showConfirm)}
              placeholder="Confirm your new password"
            />

            {/* Message */}
            {message && (
              <div
                className={`
                  flex
                  items-start
                  gap-2
                  rounded-2xl
                  border
                  px-4
                  py-3
                  text-xs
                  ${
                    success
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }
                `}
              >
                {success ? (
                  <CheckCircle2 size={17} className="shrink-0" />
                ) : (
                  <AlertCircle size={17} className="shrink-0" />
                )}

                <span>{message}</span>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-gradient-to-r
                from-maroon-900
                to-pink-600
                px-6
                py-4
                text-xs
                font-bold
                uppercase
                tracking-[0.14em]
                text-white
                shadow-lg
                shadow-pink-200
                transition
                hover:-translate-y-0.5
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <LockKeyhole size={16} />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}