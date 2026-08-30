'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Pencil, Trash2, UserRound, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

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
  const { user, status, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState(blankAddress);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadAddresses = () =>
    fetch('/api/addresses', { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setAddresses(data?.addresses || []))
      .catch(() => setAddresses([]));

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login?callbackUrl=/profile');
  }, [status, router]);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setPhone(user.phone || '');
    void loadAddresses();
  }, [user?.id]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update profile');
      updateUser(data.user);
      setMessage('Profile updated.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      return setError('Choose a JPG, PNG, or WebP image up to 5 MB.');
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
      if (!response.ok) throw new Error(data.error || 'Unable to upload profile photo');
      updateUser(data.user);
      setMessage('Profile photo updated.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to upload profile photo');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeAvatar = async () => {
    const response = await fetch('/api/profile/avatar', { method: 'DELETE', credentials: 'include' });
    const data = await response.json();
    if (!response.ok) return setError(data.error || 'Unable to remove profile photo');
    updateUser(data.user);
    setMessage('Profile photo removed.');
  };

  const saveAddress = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const endpoint = editingId ? `/api/addresses/${editingId}` : '/api/addresses';
    const response = await fetch(endpoint, {
      method: editingId ? 'PATCH' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || 'Unable to save address');
    setAddress(blankAddress);
    setEditingId('');
    await loadAddresses();
    setMessage(editingId ? 'Address updated.' : 'Address saved.');
  };

  const beginEdit = (item: Address) => {
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
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const removeAddress = async (id: string) => {
    const response = await fetch(`/api/addresses/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!response.ok) return setError('Unable to remove address');
    await loadAddresses();
    setMessage('Address removed.');
  };

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

  const initials = (user.name || user.email).slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-[#fff8fa] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Page header */}
        <div className="flex items-center gap-2 text-pink-600">
          <span className="h-px w-8 bg-pink-300" />
          <p className="text-xs font-bold uppercase tracking-[.25em]">Jannat Elegance</p>
        </div>
        <h1 className="mt-3 font-serif text-4xl text-maroon-950 sm:text-5xl">My Profile</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
          Keep your contact details and saved delivery addresses up to date, so your orders always find their way home.
        </p>

        {/* Toast-style feedback */}
        {error && (
          <p
            role="alert"
            className="mt-6 flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {message && (
          <p className="mt-6 flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <div className="mt-9 grid gap-7 lg:grid-cols-[340px_1fr]">
          {/* ============ Avatar / Account summary card ============ */}
          <aside className="h-fit overflow-hidden rounded-[28px] border border-maroon-100 bg-white shadow-sm">
            {/* Decorative header strip */}
            <div className="relative h-20 bg-gradient-to-r from-maroon-950 via-maroon-850 to-maroon-950">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_1px,transparent_1px),radial-gradient(circle_at_80%_60%,white_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <div className="px-7 pb-8 text-center">
              {/* Avatar with signature ring */}
              <div className="relative mx-auto -mt-12 h-28 w-28">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 via-rose-400 to-maroon-800 p-[3px]">
                  <div className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-white">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-serif text-3xl text-maroon-800">{initials}</span>
                    )}
                  </div>
                </div>

                <label className="absolute -bottom-1 -right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-maroon-850 text-white shadow-md transition hover:scale-105 hover:bg-maroon-900">
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

              <h2 className="mt-5 font-serif text-2xl text-maroon-950">{user.name || 'Your account'}</h2>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
              <p className="mt-0.5 text-sm text-gray-500">{user.phone || 'No phone number yet'}</p>

              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Sparkles size={12} className="text-pink-400" />
                {uploading ? 'Uploading photo…' : 'JPG, PNG or WebP · max 5 MB'}
              </div>

              {user.avatarUrl && (
                <button
                  onClick={removeAvatar}
                  className="mt-4 text-xs font-bold uppercase tracking-wider text-red-500 transition hover:text-red-700"
                >
                  Remove profile photo
                </button>
              )}
            </div>
          </aside>

          {/* ============ Right column ============ */}
          <section className="space-y-7">
            {/* Profile details form */}
            <form
              onSubmit={saveProfile}
              className="rounded-[28px] border border-maroon-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                  <UserRound size={18} />
                </span>
                <h2 className="font-serif text-2xl text-maroon-950">Profile details</h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon-900">
                  Full name
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm font-normal text-gray-800 outline-none transition focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100"
                  />
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-maroon-900">
                  Phone number
                  <input
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className="mt-2 w-full rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm font-normal text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100"
                  />
                </label>
              </div>

              <p className="mt-5 text-sm text-gray-400">Email: <span className="text-gray-600">{user.email}</span></p>

              <button
                disabled={saving}
                className="mt-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-pink-200 transition hover:shadow-md hover:shadow-pink-200 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </form>

            {/* Saved addresses */}
            <section className="rounded-[28px] border border-maroon-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                  <MapPin size={18} />
                </span>
                <h2 className="font-serif text-2xl text-maroon-950">Saved addresses</h2>
              </div>

              {addresses.length ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {addresses.map((item) => {
                    const id = item.id || item._id || '';
                    return (
                      <article
                        key={id}
                        className="flex flex-col justify-between rounded-2xl border border-maroon-100 bg-maroon-50/40 p-4 transition hover:border-maroon-200 hover:bg-maroon-50/70"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-maroon-950">{item.name}</p>
                            {item.isDefault && (
                              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pink-600">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs leading-5 text-gray-600">
                            {item.addressLine}
                            {item.landmark ? `, ${item.landmark}` : ''}
                            <br />
                            {item.city}, {item.state} – {item.pincode}
                            <br />
                            {item.phone}
                          </p>
                        </div>

                        <div className="mt-3 flex gap-4 border-t border-maroon-100/70 pt-3">
                          <button
                            onClick={() => beginEdit(item)}
                            className="flex items-center gap-1 text-xs font-bold text-maroon-800 transition hover:text-maroon-950"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => removeAddress(id)}
                            className="flex items-center gap-1 text-xs font-bold text-red-500 transition hover:text-red-700"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-maroon-200 bg-maroon-50/30 px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">No saved address yet — add one below for faster checkout.</p>
                </div>
              )}

              {/* Add / edit address form */}
              <form onSubmit={saveAddress} className="mt-7 border-t border-maroon-100 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-maroon-900">
                    {editingId ? 'Edit delivery address' : 'Add a delivery address'}
                  </p>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId('');
                        setAddress(blankAddress);
                      }}
                      className="text-xs font-bold text-maroon-800 transition hover:text-maroon-950"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Full name"
                    value={address.name}
                    onChange={(event) => setAddress({ ...address, name: event.target.value })}
                    className="rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100"
                  />
                  <input
                    required
                    placeholder="Phone number"
                    value={address.phone}
                    onChange={(event) =>
                      setAddress({ ...address, phone: event.target.value.replace(/\D/g, '').slice(0, 10) })
                    }
                    className="rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100"
                  />
                  <input
                    required
                    placeholder="House / street / area"
                    value={address.addressLine}
                    onChange={(event) => setAddress({ ...address, addressLine: event.target.value })}
                    className="rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100 sm:col-span-2"
                  />
                  <input
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={(event) => setAddress({ ...address, city: event.target.value })}
                    className="rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100"
                  />
                  <input
                    required
                    placeholder="State"
                    value={address.state}
                    onChange={(event) => setAddress({ ...address, state: event.target.value })}
                    className="rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100"
                  />
                  <input
                    required
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(event) =>
                      setAddress({ ...address, pincode: event.target.value.replace(/\D/g, '').slice(0, 6) })
                    }
                    className="rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100"
                  />
                  <input
                    placeholder="Landmark (optional)"
                    value={address.landmark}
                    onChange={(event) => setAddress({ ...address, landmark: event.target.value })}
                    className="rounded-xl border border-maroon-100 bg-[#fffbfc] p-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-maroon-300 focus:bg-white focus:ring-2 focus:ring-maroon-100"
                  />
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-maroon-900">
                  <input
                    type="checkbox"
                    checked={address.isDefault}
                    onChange={(event) => setAddress({ ...address, isDefault: event.target.checked })}
                    className="h-4 w-4 rounded border-maroon-200 text-maroon-800 focus:ring-maroon-200"
                  />
                  Make this my default delivery address
                </label>

                <button className="mt-5 rounded-full border border-maroon-800 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-maroon-800 transition hover:bg-maroon-800 hover:text-white">
                  {editingId ? 'Update address' : 'Save address'}
                </button>
              </form>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}