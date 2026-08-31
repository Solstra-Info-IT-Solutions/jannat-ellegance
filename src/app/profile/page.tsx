'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  AlertTriangle,
  Camera,
  KeyRound,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from 'lucide-react';

import { useAuth } from '@/context/AuthProvider';

import ChangePasswordModal from '@/components/ChangePasswordModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';

type Address = {
  id: string;
  _id?: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
};

const blankAddress = {
  name: '',
  phone: '',
  addressLine: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  isDefault: false,
};

export default function ProfilePage() {
  const router = useRouter();

  const {
    user,
    status,
    updateUser,
    logout,
  } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState(blankAddress);

  const [editingId, setEditingId] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  /* ================= LOAD ADDRESSES ================= */

  const loadAddresses = async () => {
    try {
      const response = await fetch('/api/addresses', {
        credentials: 'include',
      });

      if (!response.ok) {
        setAddresses([]);
        return;
      }

      const data = await response.json();

      setAddresses(data?.addresses || []);
    } catch {
      setAddresses([]);
    }
  };

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/profile');
    }
  }, [status, router]);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    if (!user) return;

    setName(user.name || '');
    setPhone(user.phone || '');

    void loadAddresses();
  }, [user?.id]);

  /* ================= AUTO HIDE MESSAGE ================= */

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage('');
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [message]);

  /* ================= SAVE PROFILE ================= */

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to update profile.');
      }

      if (data.user) {
        updateUser(data.user);
      }

      setMessage(data.message || 'Profile updated successfully.');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= UPLOAD AVATAR ================= */

  const uploadAvatar = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');
    setMessage('');

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (
      !allowedTypes.includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError('Choose a JPG, PNG, or WebP image up to 5 MB.');
      event.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const body = new FormData();

      body.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        credentials: 'include',
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to upload profile photo.'
        );
      }

      if (data.user) {
        updateUser(data.user);
      }

      setMessage(
        data.message || 'Profile photo updated successfully.'
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to upload profile photo.'
      );
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  /* ================= REMOVE AVATAR ================= */

  const removeAvatar = async () => {
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to remove profile photo.'
        );
      }

      if (data.user) {
        updateUser(data.user);
      }

      setMessage(data.message || 'Profile photo removed.');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to remove profile photo.'
      );
    }
  };

  /* ================= SAVE ADDRESS ================= */

  const saveAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setMessage('');

    try {
      const endpoint = editingId
        ? `/api/addresses/${editingId}`
        : '/api/addresses';

      const response = await fetch(endpoint, {
        method: editingId ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to save address.');
      }

      const wasEditing = Boolean(editingId);

      setAddress(blankAddress);
      setEditingId('');

      await loadAddresses();

      setMessage(
        data.message ||
          (wasEditing
            ? 'Address updated successfully.'
            : 'Address saved successfully.')
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to save address.'
      );
    }
  };

  /* ================= EDIT ADDRESS ================= */

  const beginEdit = (item: Address) => {
    setError('');
    setMessage('');

    setEditingId(item.id || item._id || '');

    setAddress({
      name: item.name,
      phone: item.phone,
      addressLine: item.addressLine,
      city: item.city,
      state: item.state,
      pincode: item.pincode,
      landmark: item.landmark || '',
      isDefault: Boolean(item.isDefault),
    });

    window.setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  /* ================= REMOVE ADDRESS ================= */

  const removeAddress = async (id: string) => {
    if (!id) return;

    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || 'Unable to remove address.'
        );
      }

      await loadAddresses();

      setMessage(
        data?.message || 'Address removed successfully.'
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to remove address.'
      );
    }
  };

  /* ================= CHANGE PASSWORD SUCCESS ================= */

  const handlePasswordSuccess = (successMessage: string) => {
    setError('');
    setMessage(successMessage);
    setChangePasswordOpen(false);
  };

  /* ================= DELETE ACCOUNT SUCCESS ================= */

  const handleAccountDeleted = async () => {
    setDeleteAccountOpen(false);

    try {
      await logout();
    } catch {
      // Account is already deleted from backend.
    } finally {
      router.replace('/');
      router.refresh();
    }
  };

  /* ================= LOADING ================= */

  if (status === 'loading' || !user) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-[#fff8fa] text-sm text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-maroon-200 border-t-maroon-800" />
          Loading profile…
        </div>
      </main>
    );
  }

  const initials = (user.name || user.email)
    .slice(0, 1)
    .toUpperCase();

  return (
    <>
      <main className="min-h-screen bg-[#fff8fa] py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          {/* HEADER */}

          <div className="flex items-center gap-2 text-pink-600">
            <span className="h-px w-8 bg-pink-300" />

            <p className="text-xs font-bold uppercase tracking-[.25em]">
              Jannat Elegance
            </p>
          </div>

          <h1 className="mt-3 font-serif text-4xl text-maroon-950 sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Manage your personal details, delivery addresses and
            account security in one place.
          </p>

          {/* ALERTS */}

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {message && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              <ShieldCheck size={17} />
              {message}
            </div>
          )}

          <div className="mt-9 grid gap-7 lg:grid-cols-[340px_1fr]">

            {/* PROFILE CARD */}

            <aside className="h-fit overflow-hidden rounded-[28px] border border-maroon-100 bg-[#fffafb] shadow-sm">

              <div className="relative h-20 bg-gradient-to-r from-maroon-950 via-rose-900 to-maroon-950">
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_1px,transparent_1px),radial-gradient(circle_at_80%_60%,white_1px,transparent_1px)] [background-size:24px_24px]" />
              </div>

              <div className="px-7 pb-8 text-center">

                <div className="relative mx-auto -mt-12 h-28 w-28">

                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 via-rose-400 to-maroon-800 p-[3px]">

                    <div className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-[#fff8fa]">

                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-serif text-3xl text-maroon-800">
                          {initials}
                        </span>
                      )}

                    </div>

                  </div>

                  <label className="absolute -bottom-1 -right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-[#fff8fa] bg-maroon-800 text-white shadow-md transition hover:scale-105 hover:bg-maroon-900">

                    <Camera size={15} />

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={uploadAvatar}
                      className="hidden"
                      disabled={uploading}
                    />

                  </label>

                </div>

                <h2 className="mt-5 font-serif text-2xl text-maroon-950">
                  {user.name || 'Your Account'}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {user.email}
                </p>

                <p className="mt-0.5 text-sm text-gray-500">
                  {user.phone || 'No phone number yet'}
                </p>

                <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">

                  <Sparkles
                    size={12}
                    className="text-pink-400"
                  />

                  {uploading
                    ? 'Uploading photo…'
                    : 'JPG, PNG or WebP · max 5 MB'}

                </div>

                {user.avatarUrl && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    disabled={uploading}
                    className="mt-4 text-xs font-bold uppercase tracking-wider text-red-500 transition hover:text-red-700 disabled:opacity-50"
                  >
                    Remove profile photo
                  </button>
                )}

              </div>

            </aside>

            {/* RIGHT CONTENT */}

            <section className="space-y-7">

              {/* PROFILE DETAILS */}

              <form
                onSubmit={saveProfile}
                className="rounded-[28px] border border-maroon-100 bg-[#fffafb] p-6 shadow-sm sm:p-8"
              >

                <div className="flex items-center gap-2.5">

                  <span className="grid h-9 w-9 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                    <UserRound size={18} />
                  </span>

                  <h2 className="font-serif text-2xl text-maroon-950">
                    Profile Details
                  </h2>

                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon-900">

                    Full Name

                    <input
                      required
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-maroon-100 bg-[#fff8fa] p-3 text-sm font-normal text-gray-800 outline-none transition focus:border-maroon-300 focus:ring-2 focus:ring-maroon-100"
                    />

                  </label>

                  <label className="block text-xs font-bold uppercase tracking-wider text-maroon-900">

                    Phone Number

                    <input
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                            .replace(/\D/g, '')
                            .slice(0, 10)
                        )
                      }
                      placeholder="10-digit number"
                      className="mt-2 w-full rounded-xl border border-maroon-100 bg-[#fff8fa] p-3 text-sm font-normal text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:ring-2 focus:ring-maroon-100"
                    />

                  </label>

                </div>

                <p className="mt-5 text-sm text-gray-400">
                  Email:{' '}
                  <span className="text-gray-600">
                    {user.email}
                  </span>
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Profile'}
                </button>

              </form>

              {/* SECURITY */}

              <section className="overflow-hidden rounded-[28px] border border-maroon-100 bg-[#fffafb] shadow-sm">

                <div className="border-b border-maroon-100 px-6 py-6 sm:px-8">

                  <div className="flex items-center gap-3">

                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-maroon-900 to-rose-800 text-white shadow-lg">
                      <ShieldCheck size={20} />
                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-600">
                        Account Protection
                      </p>

                      <h2 className="mt-1 font-serif text-2xl text-maroon-950">
                        Security & Account
                      </h2>

                    </div>

                  </div>

                </div>

                <div className="p-4 sm:p-5">

                  {/* CHANGE PASSWORD */}

                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setChangePasswordOpen(true);
                    }}
                    className="group flex w-full items-center justify-between rounded-2xl border border-maroon-100 bg-maroon-50/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50"
                  >

                    <div className="flex items-center gap-4">

                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-maroon-800 shadow-sm">
                        <KeyRound size={19} />
                      </div>

                      <div>

                        <h3 className="font-semibold text-maroon-950">
                          Change Password
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Update your password to keep your
                          account secure.
                        </p>

                      </div>

                    </div>

                    <span className="text-lg text-maroon-400 transition group-hover:translate-x-1 group-hover:text-maroon-800">
                      →
                    </span>

                  </button>

                  {/* DELETE ACCOUNT */}

                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setDeleteAccountOpen(true);
                    }}
                    className="group mt-4 flex w-full items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 p-5 text-left transition hover:border-red-300 hover:bg-red-50"
                  >

                    <div className="flex items-center gap-4">

                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-red-500 shadow-sm">
                        <AlertTriangle size={19} />
                      </div>

                      <div>

                        <h3 className="font-semibold text-red-700">
                          Delete Your Account
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-red-600/70">
                          Permanently remove your account.
                          This action cannot be undone.
                        </p>

                      </div>

                    </div>

                    <Trash2
                      size={18}
                      className="text-red-400 transition group-hover:text-red-600"
                    />

                  </button>

                </div>

              </section>

            </section>

          </div>

        </div>
      </main>

      {/* ================= CHANGE PASSWORD MODAL ================= */}

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* ================= DELETE ACCOUNT MODAL ================= */}

      <DeleteAccountModal
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        onDeleted={handleAccountDeleted}
      />
    </>
  );
}