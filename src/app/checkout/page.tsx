"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartContext";

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

export default function CheckoutPage() {
  const router = useRouter();

  const { user, status } = useAuth();
  const { cart, subtotal, shipping, total, clearCart } = useCart();

  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [saveAddress, setSaveAddress] = useState(false);

  const [address, setAddress] = useState(blankAddress);

  const idempotencyKey = useRef("");

  /* ----------------------------------
     AUTH CHECK
  ---------------------------------- */

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  /* ----------------------------------
     LOAD USER ADDRESS
  ---------------------------------- */

  useEffect(() => {
    if (!user) return;

    setAddress((current) => ({
      ...current,
      name: current.name || user.name || "",
      phone: current.phone || user.phone || "",
    }));

    fetch("/api/addresses", {
      credentials: "include",
    })
      .then((response) =>
        response.ok ? response.json() : null,
      )
      .then((data) => {
        const saved = data?.addresses || [];

        setAddresses(saved);

        const preferred =
          saved.find((item: Address) => item.isDefault) ||
          saved[0];

        if (preferred) {
          setSelectedAddressId(
            preferred.id || preferred._id || "",
          );
        }
      })
      .catch(() => {
        setAddresses([]);
      });
  }, [user?.id]);

  /* ----------------------------------
     SELECTED ADDRESS
  ---------------------------------- */

  const selectedAddress = addresses.find(
    (item) =>
      (item.id || item._id) === selectedAddressId,
  );

  /* ----------------------------------
     PLACE COD ORDER
  ---------------------------------- */

  const startCheckout = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    setError("");

    if (!cart.length) {
      router.replace("/shop");
      return;
    }

    setPlacingOrder(true);

    try {
      /* ------------------------------
         IDEMPOTENCY KEY
      ------------------------------ */

      if (!idempotencyKey.current) {
        idempotencyKey.current =
          window.crypto?.randomUUID?.() ||
          `${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}`;
      }

      /* ------------------------------
         BUILD PAYLOAD
      ------------------------------ */

      const basePayload = {
        cart: cart.map(({ id, size, quantity }) => ({
          id,
          size,
          quantity,
        })),

        paymentMethod: "COD",

        // You can use this in your backend
        paymentStatus: "PENDING",
      };

      const payload = selectedAddressId
        ? {
            ...basePayload,

            addressId: selectedAddressId,
          }
        : {
            ...basePayload,

            address,

            saveAddress,
          };

      /* ------------------------------
         CREATE ORDER
      ------------------------------ */

      const res = await fetch("/api/checkout", {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",

          "Idempotency-Key":
            idempotencyKey.current,
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Unable to place your order",
        );
      }

      /* ------------------------------
         SUCCESS
      ------------------------------ */

      clearCart();

      router.replace(
        `/checkout/success?orderId=${data.orderId}`,
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to place your order",
      );

      setPlacingOrder(false);
    }
  };

  /* ----------------------------------
     LOADING
  ---------------------------------- */

  if (status === "loading") {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] text-maroon-900">
        Preparing secure checkout…
      </main>
    );
  }

  /* ----------------------------------
     PAGE
  ---------------------------------- */

  return (
    <main className="min-h-screen bg-[#fff8fa] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* HEADER */}

        <h1 className="font-serif text-4xl text-maroon-950">
          Secure checkout
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Review your delivery details and confirm your order.
        </p>

        {/* ERROR */}

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ==============================
              CHECKOUT FORM
          ============================== */}

          <form
            onSubmit={startCheckout}
            className="rounded-3xl border border-maroon-100 bg-white p-6 sm:p-8"
          >

            {/* DELIVERY */}

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

            {/* SHIPPING ADDRESS */}

            <h2 className="font-serif text-2xl text-maroon-950">
              Shipping address
            </h2>

            {/* SAVED ADDRESSES */}

            {addresses.length > 0 && (

              <div className="mt-5 rounded-2xl border border-maroon-100 bg-maroon-50/50 p-4">

                <p className="text-xs font-bold uppercase tracking-wider text-maroon-900">
                  Saved addresses
                </p>

                <div className="mt-3 space-y-2">

                  {addresses.map((item) => {
                    const id =
                      item.id || item._id || "";

                    return (

                      <label
                        key={id}
                        className={`block cursor-pointer rounded-xl border p-3 text-sm transition ${
                          selectedAddressId === id
                            ? "border-maroon-800 bg-white shadow-sm"
                            : "border-maroon-100 bg-white/70 hover:border-maroon-300"
                        }`}
                      >

                        <input
                          type="radio"
                          checked={
                            selectedAddressId === id
                          }
                          onChange={() =>
                            setSelectedAddressId(id)
                          }
                          className="mr-2 accent-maroon-800"
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
                          {item.addressLine},{" "}
                          {item.city},{" "}
                          {item.state} –{" "}
                          {item.pincode} ·{" "}
                          {item.phone}
                        </span>

                      </label>
                    );
                  })}

                  {/* NEW ADDRESS */}

                  <label
                    className={`block cursor-pointer rounded-xl border p-3 text-sm transition ${
                      !selectedAddressId
                        ? "border-maroon-800 bg-white shadow-sm"
                        : "border-maroon-100 bg-white/70 hover:border-maroon-300"
                    }`}
                  >

                    <input
                      type="radio"
                      checked={!selectedAddressId}
                      onChange={() =>
                        setSelectedAddressId("")
                      }
                      className="mr-2 accent-maroon-800"
                    />

                    Use a new delivery address

                  </label>

                </div>
              </div>
            )}

            {/* ==============================
                NEW ADDRESS FORM
            ============================== */}

            {!selectedAddressId && (

              <>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <input
                    required
                    placeholder="Full name"
                    value={address.name}
                    onChange={(event) =>
                      setAddress({
                        ...address,
                        name: event.target.value,
                      })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none transition focus:border-maroon-700"
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
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none transition focus:border-maroon-700"
                  />

                  <textarea
                    required
                    placeholder="House / street / area"
                    value={address.addressLine}
                    onChange={(event) =>
                      setAddress({
                        ...address,
                        addressLine:
                          event.target.value,
                      })
                    }
                    className="min-h-28 rounded-xl border border-maroon-100 p-3 text-sm outline-none transition focus:border-maroon-700 sm:col-span-2"
                  />

                  <input
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={(event) =>
                      setAddress({
                        ...address,
                        city: event.target.value,
                      })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none transition focus:border-maroon-700"
                  />

                  <input
                    required
                    placeholder="State"
                    value={address.state}
                    onChange={(event) =>
                      setAddress({
                        ...address,
                        state: event.target.value,
                      })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none transition focus:border-maroon-700"
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

                        pincode:
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                      })
                    }
                    className="rounded-xl border border-maroon-100 p-3 text-sm outline-none transition focus:border-maroon-700"
                  />

                </div>

                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-maroon-900">

                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(event) =>
                      setSaveAddress(
                        event.target.checked,
                      )
                    }
                  />

                  Save this address to my profile

                </label>
              </>
            )}

            {/* ==============================
                PAYMENT METHOD
            ============================== */}

            <div className="mt-7">

              <p className="mb-3 text-sm font-bold text-maroon-950">
                Payment method
              </p>

              <div className="flex items-center gap-4 rounded-2xl border-2 border-maroon-800 bg-maroon-50 p-4">

                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-maroon-800 shadow-sm">
                  <Banknote size={24} />
                </span>

                <div className="flex-1">

                  <p className="font-semibold text-maroon-950">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Pay securely when your order is delivered.
                  </p>

                </div>

                <CheckCircle2
                  size={22}
                  className="text-green-600"
                />

              </div>

            </div>

            {/* ==============================
                PLACE ORDER BUTTON
            ============================== */}

            <button
              type="submit"
              disabled={
                placingOrder || !cart.length
              }
              className="mt-7 w-full rounded-full bg-maroon-800 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-maroon-950 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {placingOrder
                ? "Confirming your order…"
                : `Place COD Order · ₹${total.toLocaleString(
                    "en-IN",
                  )}`}

            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500">

              <ShieldCheck
                size={15}
                className="text-green-600"
              />

              Your order will be confirmed securely.

            </p>

          </form>

          {/* ==============================
              ORDER SUMMARY
          ============================== */}

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
                      Size {item.size} · Qty{" "}
                      {item.quantity}
                    </p>

                    <p className="mt-1 text-sm font-bold text-maroon-800">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>
              ))}

            </div>

            <div className="mt-3 space-y-2 border-t border-maroon-100 pt-4 text-sm">

              <p className="flex justify-between text-gray-600">

                <span>Subtotal</span>

                <span>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN",
                  )}
                </span>

              </p>

              <p className="flex justify-between text-gray-600">

                <span>Shipping</span>

                <span>
                  {shipping
                    ? `₹${shipping}`
                    : "Free"}
                </span>

              </p>

              <p className="flex justify-between text-lg font-bold text-maroon-950">

                <span>Total</span>

                <span>
                  ₹
                  {total.toLocaleString("en-IN")}
                </span>

              </p>

            </div>

            {/* COD NOTICE */}

            <div className="mt-5 rounded-xl bg-green-50 p-4">

              <div className="flex gap-3">

                <Banknote
                  size={20}
                  className="mt-0.5 text-green-700"
                />

                <div>

                  <p className="text-sm font-bold text-green-900">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-green-800">
                    No online payment is required.
                    Pay the amount when your order
                    arrives.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}