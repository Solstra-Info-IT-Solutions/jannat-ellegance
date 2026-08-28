'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

type Shipping = { courierName: string; trackingNumber: string; trackingUrl: string };
type Order = {
  id: string; customerName: string; customerEmail: string; customerPhone: string; shippingAddress: string; city: string; state: string; postalCode: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; size: string; image: string }>;
  subtotal: number; shipping: number; total: number; paymentId?: string; paymentStatus: string; status: string;
  shippingInfo: Shipping; adminNotes?: string; cancelReason?: string; createdAt: string;
};

const statuses = ['confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];
const couriers = ['DTDC', 'Delhivery', 'Blue Dart', 'India Post', 'Other'];
const label = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
const validTrackingUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState('confirmed');
  const [notes, setNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [courierChoice, setCourierChoice] = useState('');
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`, { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.success) throw new Error();
        const value = data.order as Order;
        setOrder(value); setStatus(value.status); setNotes(value.adminNotes || ''); setCancelReason(value.cancelReason || '');
        setCourierName(value.shippingInfo?.courierName || '');
        setCourierChoice(couriers.includes(value.shippingInfo?.courierName) ? value.shippingInfo.courierName : value.shippingInfo?.courierName ? 'Other' : '');
        setTrackingNumber(value.shippingInfo?.trackingNumber || ''); setTrackingUrl(value.shippingInfo?.trackingUrl || '');
      })
      .catch(() => setError('Unable to load order.'));
  }, [params.id]);

  const save = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    const effectiveCourier = courierChoice === 'Other' ? courierName : courierChoice;
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes, cancelReason: status === 'cancelled' ? cancelReason : undefined, courierName: effectiveCourier, trackingNumber, trackingUrl, sendEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update order.');
      setOrder(data.order);
      setMessage(data.unchanged ? 'No order or shipping changes to save.' : data.notificationFailed ? 'Order updated successfully, but notification email could not be sent.' : sendEmail ? 'Order updated and customer notified.' : 'Order updated.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update order.');
    } finally { setSaving(false); }
  };

  return <AdminShell title="Order Detail">
    <Link href="/admin/orders" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-maroon-800"><ArrowLeft size={16} />Back to orders</Link>
    {error && <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p className="mb-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
    {!order ? <p className="p-8 text-center text-sm text-gray-500">Loading order…</p> : <div className="grid gap-7 lg:grid-cols-[1fr_380px]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-maroon-100 bg-white p-6">
          <div className="flex justify-between gap-4"><div><p className="font-mono text-sm font-bold text-maroon-950">JE{order.id.slice(-8).toUpperCase()}</p><p className="mt-1 text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p></div><div className="text-right"><p className="text-lg font-bold text-maroon-950">₹{order.total.toLocaleString('en-IN')}</p><p className="mt-1 text-xs font-bold uppercase text-maroon-700">Payment: {order.paymentStatus}</p></div></div>
          <div className="mt-5 border-t border-maroon-50 pt-4"><h2 className="font-serif text-xl text-maroon-950">Items</h2>{order.items.map((item) => <div key={item.id} className="mt-4 flex gap-3"><img src={item.image} alt="" className="h-16 w-14 rounded-lg object-cover" /><div className="flex-1"><p className="font-semibold text-maroon-950">{item.name}</p><p className="text-xs text-gray-500">Size {item.size} · Qty {item.quantity}</p></div><p className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p></div>)}</div>
        </div>
        <div className="rounded-3xl border border-maroon-100 bg-white p-6"><h2 className="font-serif text-xl text-maroon-950">Customer & delivery</h2><p className="mt-4 font-semibold">{order.customerName}</p><p className="text-sm text-gray-600">{order.customerEmail}<br />{order.customerPhone}</p><p className="mt-3 text-sm text-gray-700">{order.shippingAddress}, {order.city}, {order.state} – {order.postalCode}</p></div>
      </section>
      <aside><form onSubmit={save} className="space-y-4 rounded-3xl border border-maroon-100 bg-white p-6">
        <h2 className="font-serif text-xl text-maroon-950">Shipping & Delivery</h2>
        <label className="block text-xs font-bold uppercase text-maroon-900">Order status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1.5 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal">{statuses.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>
        <label className="block text-xs font-bold uppercase text-maroon-900">Courier name<select value={courierChoice} onChange={(event) => { setCourierChoice(event.target.value); if (event.target.value !== 'Other') setCourierName(event.target.value); }} className="mt-1.5 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal"><option value="">Select courier</option>{couriers.map((item) => <option key={item}>{item}</option>)}</select></label>
        {courierChoice === 'Other' && <label className="block text-xs font-bold uppercase text-maroon-900">Custom courier<input required value={courierName} onChange={(event) => setCourierName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>}
        <label className="block text-xs font-bold uppercase text-maroon-900">Tracking number<input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="D123456789" className="mt-1.5 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>
        <label className="block text-xs font-bold uppercase text-maroon-900">Tracking URL <span className="normal-case text-gray-500">(optional)</span><input type="url" value={trackingUrl} onChange={(event) => setTrackingUrl(event.target.value)} placeholder="https://…" className="mt-1.5 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>
        {validTrackingUrl(trackingUrl) && <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-maroon-800"><ExternalLink size={13} />Open tracking link</a>}
        {status === 'cancelled' && <label className="block text-xs font-bold uppercase text-maroon-900">Cancellation reason<textarea required value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} className="mt-1.5 min-h-24 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>}
        <label className="block text-xs font-bold uppercase text-maroon-900">Admin notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-1.5 min-h-24 w-full rounded-xl border border-maroon-100 p-3 text-sm font-normal" /></label>
        <label className="flex items-center gap-2 text-sm font-semibold text-maroon-900"><input type="checkbox" checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)} />Send status update email to customer</label>
        <button disabled={saving} className="w-full rounded-full bg-maroon-800 py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">{saving ? 'Updating…' : 'Update order'}</button>
      </form></aside>
    </div>}
  </AdminShell>;
}
