'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CircleX, Search, Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  items: unknown[];
  total: number;
  paymentStatus: string;
  status: string;
  shippingInfo?: { courierName?: string; trackingNumber?: string };
};

const statuses = ['', 'confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'exchanged'];
const label = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
const orderLabel = (id: string) => `JE${id.slice(-8).toUpperCase()}`;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState('');

  const load = async () => {
    try {
      const response = await fetch(`/api/admin/orders?page=${page}&search=${encodeURIComponent(search)}&status=${status}&from=${from}&to=${to}`, { credentials: 'include' });
      const data = response.ok ? await response.json() : null;
      if (!data?.success) throw new Error();
      setOrders(data.orders);
      setPages(data.pages);
      setError('');
    } catch {
      setError('Unable to load orders. Please try again.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [page, search, status, from, to]);

  const cancelOrder = async (order: Order) => {
    if (!window.confirm(`Cancel ${orderLabel(order.id)}? Its paid amount will be removed from revenue and stock will be restored.`)) return;
    setWorkingId(order.id);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', sendEmail: true }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.error || 'Could not cancel this order');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to cancel this order.');
    } finally { setWorkingId(''); }
  };

  const deleteOrder = async (order: Order) => {
    if (!window.confirm(`Delete the cancelled order history for ${orderLabel(order.id)}? This cannot be undone.`)) return;
    setWorkingId(order.id);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, { method: 'DELETE', credentials: 'include' });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.error || 'Could not delete this order');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to delete this order.');
    } finally { setWorkingId(''); }
  };

  return <AdminShell title="Order Management">
    <div className="mb-5 grid gap-3 md:grid-cols-5">
      <div className="relative md:col-span-2"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-700" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Customer, email or order ID" className="w-full rounded-full border border-maroon-100 bg-white py-3 pl-10 pr-4 text-sm" /></div>
      <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-full border border-maroon-100 bg-white px-4 text-sm">{statuses.map((item) => <option key={item} value={item}>{item ? label(item) : 'All statuses'}</option>)}</select>
      <input type="date" value={from} onChange={(event) => { setFrom(event.target.value); setPage(1); }} className="rounded-full border border-maroon-100 bg-white px-4 text-sm" />
      <input type="date" value={to} onChange={(event) => { setTo(event.target.value); setPage(1); }} className="rounded-full border border-maroon-100 bg-white px-4 text-sm" />
    </div>
    {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="overflow-x-auto rounded-3xl border border-maroon-100 bg-white">
      <table className="w-full min-w-[1180px] text-left text-sm"><thead className="bg-maroon-50 text-xs uppercase text-maroon-900"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Amount</th><th className="p-4">Payment</th><th className="p-4">Order status</th><th className="p-4">Courier / Tracking</th><th className="p-4">Date</th><th className="p-4">Actions</th></tr></thead><tbody>
        {orders.map((order) => <tr key={order.id} className="border-t border-maroon-50"><td className="p-4"><Link href={`/admin/orders/${order.id}`} className="font-mono font-bold text-maroon-950">{orderLabel(order.id)}</Link></td><td className="p-4"><p className="font-semibold">{order.customerName}</p><p className="text-xs text-gray-500">{order.customerEmail}</p></td><td className="p-4 font-bold">₹{order.total.toLocaleString('en-IN')}</td><td className="p-4 capitalize">{order.paymentStatus}</td><td className="p-4"><span className="rounded-full bg-maroon-50 px-3 py-1 text-xs font-bold text-maroon-800">{label(order.status)}</span></td><td className="p-4 text-xs text-gray-600">{order.shippingInfo?.courierName || '—'}<br />{order.shippingInfo?.trackingNumber || '—'}</td><td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td><td className="p-4"><div className="flex gap-2">{order.status !== 'cancelled' && <button type="button" disabled={Boolean(workingId)} onClick={() => cancelOrder(order)} className="inline-flex items-center gap-1 rounded-lg border border-pink-200 bg-pink-50 px-2.5 py-2 text-xs font-bold text-maroon-800 transition hover:bg-pink-100 disabled:opacity-50"><CircleX size={14} />Cancel</button>}<button type="button" disabled={Boolean(workingId) || order.status !== 'cancelled'} title={order.status !== 'cancelled' ? 'Cancel the order before deleting its history' : 'Delete cancelled order history'} onClick={() => deleteOrder(order)} className="inline-flex items-center gap-1 rounded-lg border border-maroon-200 bg-white px-2.5 py-2 text-xs font-bold text-maroon-800 transition hover:bg-maroon-50 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={14} />Delete</button></div></td></tr>)}
      </tbody></table>
      {!orders.length && <p className="p-10 text-center text-sm text-gray-500">No orders match these filters.</p>}
    </div>
    <div className="mt-5 flex items-center justify-between"><p className="text-sm text-gray-500">Page {page} of {pages}</p><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full border border-maroon-100 p-2 disabled:opacity-40"><ChevronLeft size={16} /></button><button disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-full border border-maroon-100 p-2 disabled:opacity-40"><ChevronRight size={16} /></button></div></div>
  </AdminShell>;
}
