"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartContext";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}
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
  name: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};
const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const router = useRouter();
  const { user, status } = useAuth();
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  const [address, setAddress] = useState(blankAddress);
  const idempotencyKey = useRef("");
  useEffect(() => {
    if (status === "unauthenticated")
      router.replace("/login?callbackUrl=/checkout");
  }, [status, router]);
  useEffect(() => {
    if (!user) return;
    setAddress((current) => ({
      ...current,
      name: current.name || user.name || "",
      phone: current.phone || user.phone || "",
    }));
    fetch("/api/addresses", { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const saved = data?.addresses || [];
        setAddresses(saved);
        const preferred =
          saved.find((item: Address) => item.isDefault) || saved[0];
        if (preferred)
          setSelectedAddressId(preferred.id || preferred._id || "");
      })
      .catch(() => setAddresses([]));
  }, [user?.id]);
  const selectedAddress = addresses.find(
    (item) => (item.id || item._id) === selectedAddressId,
  );
  const startCheckout = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!cart.length) return router.replace("/shop");
    setPaying(true);
    try {
      if (!idempotencyKey.current)
        idempotencyKey.current =
          window.crypto?.randomUUID?.() ||
          `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const payload = selectedAddressId
        ? {
            cart: cart.map(({ id, size, quantity }) => ({
              id,
              size,
              quantity,
            })),
            addressId: selectedAddressId,
          }
        : {
            cart: cart.map(({ id, size, quantity }) => ({
              id,
              size,
              quantity,
            })),
            address,
            saveAddress,
          };
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to start payment");
      if (!(await loadRazorpay()) || !window.Razorpay)
        throw new Error(
          "Secure payment window could not load. Check your connection and try again.",
        );
      const shippingAddress = selectedAddress || address;
      const razorpay = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Jannat Elegance",
        description: "Secure order payment",
        order_id: data.razorpayOrderId,
        prefill: {
          name: shippingAddress.name,
          email: user?.email,
          contact: shippingAddress.phone,
        },
        theme: { color: "#5c0620" },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (payment: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch("/api/checkout/verify", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payment),
          });
          const verified = await verify.json();
          if (!verify.ok) {
            setError(
              verified.error ||
                "Payment verification failed. Please contact support.",
            );
            setPaying(false);
            return;
          }
          clearCart();
          router.replace(`/checkout/success?orderId=${verified.orderId}`);
        },
      });
      razorpay.open();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to start payment",
      );
      setPaying(false);
    }
  };
  if (status === "loading")
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] text-maroon-900">
        Preparing secure checkout…
      </main>
    );
  return (
    <main className="min-h-screen bg-[#fff8fa] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-serif text-4xl text-maroon-950">Secure checkout</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your total and inventory are verified by the server before payment.
        </p>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={startCheckout}
            className="rounded-3xl border border-maroon-100 bg-white p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-green-700">
                <Truck size={22} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-800">
                  Delivery partner
                </p>
                <p className="font-semibold text-maroon-950">
                  DTDC · Free Shipping
                </p>
              </div>
            </div>
            <h2 className="font-serif text-2xl text-maroon-950">
              Shipping address
            </h2>
            {addresses.length > 0 && (
              <div className="mt-5 rounded-2xl border border-maroon-100 bg-maroon-50/50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-maroon-900">
                  Saved addresses
                </p>
                <div className="mt-3 space-y-2">
                  {addresses.map((item) => {
                    const id = item.id || item._id || "";
                    return (
                      <label
                        key={id}
                        className={`block cursor-pointer rounded-xl border p-3 text-sm ${selectedAddressId === id ? "border-maroon-800 bg-white" : "border-maroon-100 bg-white/70"}`}
                      >
                        <input
                          type="radio"
                          checked={selectedAddressId === id}
                          onChange={() => setSelectedAddressId(id)}
                          className="mr-2"
                        />
                        <span className="font-semibold text-maroon-950">
                          {item.name}
                        </span>
                        {item.isDefault && (
                          <span className="ml-2 text-xs font-bold text-pink-600">
                            DEFAULT
                          </span>
                        )}
                        <span className="mt-1 block pl-5 text-xs text-gray-600">
                          {item.addressLine}, {item.city}, {item.state} –{" "}
                          {item.pincode} · {item.phone}
                        </span>
                      </label>
                    );
                  })}
                  <label
                    className={`block cursor-pointer rounded-xl border p-3 text-sm ${!selectedAddressId ? "border-maroon-800 bg-white" : "border-maroon-100 bg-white/70"}`}
                  >
                    <input
                      type="radio"
                      checked={!selectedAddressId}
                      onChange={() => setSelectedAddressId("")}
                      className="mr-2"
                    />
                    Use a new delivery address
                  </label>
                </div>
              </div>
            )}
            {!selectedAddressId && (
              <>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Full name"
                    value={address.name}
                    onChange={(event) =>
                      setAddress({ ...address, name: event.target.value })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm"
                  />
                  <input
                    required
                    placeholder="Phone number"
                    value={address.phone}
                    onChange={(event) =>
                      setAddress({
                        ...address,
                        phone: event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm"
                  />
                  <textarea
                    required
                    placeholder="House / street / area"
                    value={address.addressLine}
                    onChange={(event) =>
                      setAddress({
                        ...address,
                        addressLine: event.target.value,
                      })
                    }
                    className="min-h-28 rounded-xl border border-maroon-100 p-3 text-sm sm:col-span-2"
                  />
                  <input
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={(event) =>
                      setAddress({ ...address, city: event.target.value })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm"
                  />
                  <input
                    required
                    placeholder="State"
                    value={address.state}
                    onChange={(event) =>
                      setAddress({ ...address, state: event.target.value })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm"
                  />
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    placeholder="6-digit pincode"
                    value={address.pincode}
                    onChange={(event) =>
                      setAddress({
                        ...address,
                        pincode: event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6),
                      })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm"
                  />
                </div>
                <label className="mt-4 flex items-center gap-2 text-sm text-maroon-900">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(event) => setSaveAddress(event.target.checked)}
                  />
                  Save this address to my profile
                </label>
              </>
            )}
            <button
              disabled={paying || !cart.length}
              className="mt-7 w-full rounded-full bg-maroon-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg disabled:opacity-50"
            >
              {paying
                ? "Opening payment…"
                : `Pay ₹${total.toLocaleString("en-IN")}`}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={15} className="text-green-600" />
              Razorpay processes your payment securely.
            </p>
          </form>
          <aside className="h-fit rounded-3xl border border-maroon-100 bg-white p-6">
            <h2 className="border-b border-maroon-100 pb-4 font-serif text-2xl text-maroon-950">
              Order summary
            </h2>
            <div className="divide-y divide-maroon-50">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-3 py-4"
                >
                  <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-maroon-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-maroon-950">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size {item.size} · Qty {item.quantity}
                    </p>
                    <p className="mt-1 text-sm font-bold text-maroon-800">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2 border-t border-maroon-100 pt-4 text-sm">
              <p className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </p>
              <p className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping ? `₹${shipping}` : "Free"}</span>
              </p>
              <p className="flex justify-between text-lg font-bold text-maroon-950">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
