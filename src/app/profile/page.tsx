'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Pencil, Trash2, UserRound } from 'lucide-react';
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
        Loading profile…
      </main>
    );
  }

  const initials = (user.name || user.email).slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen bg-[#fff8fa] py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-pink-600">Jannat Elegance</p>
        <h1 className="mt-2 font-serif text-4xl text-maroon-950">My Profile</h1>
        <p className="mt-2 text-sm text-gray-500">
          Keep your contact details and saved delivery addresses up to date.
        </p>

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>
        )}

        <div className="mt-8 grid gap-7 lg:grid-cols-[340px_1fr]">
          {/* Avatar / Account summary card */}
          <aside className="h-fit rounded-3xl border border-maroon-100 bg-white p-7 text-center shadow-sm">
            <div className="relative mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-3xl font-serif text-white">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <label className="relative -mt-8 mb-2 mx-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-maroon-850 text-white shadow-lg transition hover:bg-maroon-900">
              <Camera size={16} />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={uploadAvatar}
                className="hidden"
                disabled={uploading}
              />
            </label>

            <h2 className="mt-3 font-serif text-2xl text-maroon-950">{user.name || 'Your account'}</h2>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            <p className="mt-1 text-sm text-gray-500">{user.phone || 'No phone number yet'}</p>

            <p className="mt-5 text-xs text-gray-400">
              {uploading ? 'Uploading photo…' : 'JPG, PNG or WebP · max 5 MB'}
            </p>

            {user.avatarUrl && (
              <button
                onClick={removeAvatar}
                className="mt-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 transition"
              >
                Remove profile photo
              </button>
            )}
          </aside>

          {/* Right column: profile details + addresses */}
          <section className="space-y-7">
            {/* Profile details form */}
            <form
              onSubmit={saveProfile}
              className="rounded-3xl border border-maroon-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="flex items-center gap-2 font-serif text-2xl text-maroon-950">
                <UserRound size={22} />
                Profile details
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon-900">
                  Full name
                  <input
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal outline-none focus:ring-2 focus:ring-maroon-200"
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
                    className="mt-2 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal outline-none focus:ring-2 focus:ring-maroon-200"
                  />
                </label>
              </div>

              <p className="mt-4 text-sm text-gray-500">Email: {user.email}</p>

              <button
                disabled={saving}
                className="mt-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </form>

            {/* Saved addresses */}
            <section className="rounded-3xl border border-maroon-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-maroon-950">
                <MapPin size={22} />
                Saved addresses
              </h2>

              {addresses.length ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {addresses.map((item) => {
                    const id = item.id || item._id || '';
                    return (
                      <article
                        key={id}
                        className="flex flex-col justify-between rounded-2xl border border-maroon-100 bg-maroon-50/50 p-4"
                      >
                        <div>
                          <p className="font-semibold text-maroon-950">
                            {item.name}
                            {item.isDefault && (
                              <span className="ml-2 rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-600">
                                DEFAULT
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-gray-600">
                            {item.addressLine}
                            {item.landmark ? `, ${item.landmark}` : ''}
                            <br />
                            {item.city}, {item.state} – {item.pincode}
                            <br />
                            {item.phone}
                          </p>
                        </div>

                        <div className="mt-3 flex gap-4">
                          <button
                            onClick={() => beginEdit(item)}
                            className="flex items-center gap-1 text-xs font-bold text-maroon-800 hover:text-maroon-950 transition"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => removeAddress(id)}
                            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition"
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
                <p className="mt-4 text-sm text-gray-500">No saved address yet.</p>
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
                      className="text-xs font-bold text-maroon-800 hover:text-maroon-950 transition"
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
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none focus:ring-2 focus:ring-maroon-200"
                  />
                  <input
                    required
                    placeholder="Phone number"
                    value={address.phone}
                    onChange={(event) =>
                      setAddress({ ...address, phone: event.target.value.replace(/\D/g, '').slice(0, 10) })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none focus:ring-2 focus:ring-maroon-200"
                  />
                  <input
                    required
                    placeholder="House / street / area"
                    value={address.addressLine}
                    onChange={(event) => setAddress({ ...address, addressLine: event.target.value })}
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none focus:ring-2 focus:ring-maroon-200 sm:col-span-2"
                  />
                  <input
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={(event) => setAddress({ ...address, city: event.target.value })}
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none focus:ring-2 focus:ring-maroon-200"
                  />
                  <input
                    required
                    placeholder="State"
                    value={address.state}
                    onChange={(event) => setAddress({ ...address, state: event.target.value })}
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none focus:ring-2 focus:ring-maroon-200"
                  />
                  <input
                    required
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(event) =>
                      setAddress({ ...address, pincode: event.target.value.replace(/\D/g, '').slice(0, 6) })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none focus:ring-2 focus:ring-maroon-200"
                  />
                  <input
                    placeholder="Landmark (optional)"
                    value={address.landmark}
                    onChange={(event) => setAddress({ ...address, landmark: event.target.value })}
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none focus:ring-2 focus:ring-maroon-200"
                  />
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm text-maroon-900">
                  <input
                    type="checkbox"
                    checked={address.isDefault}
                    onChange={(event) => setAddress({ ...address, isDefault: event.target.checked })}
                  />
                  Make this my default delivery address
                </label>

                <button className="mt-5 rounded-full border border-maroon-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-maroon-800 transition hover:bg-maroon-800 hover:text-white">
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