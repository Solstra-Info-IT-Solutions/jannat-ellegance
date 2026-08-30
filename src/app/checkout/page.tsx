'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck } from 'lucide-react';

import { useAuth } from '@/context/AuthProvider';
import { useCart } from '@/context/CartContext';

declare global {
interface Window {
Razorpay?: new (
options: Record<string, unknown>
) => {
open: () => void;
};
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
name: '',
phone: '',
addressLine: '',
city: '',
state: '',
pincode: '',
};

const loadRazorpay = () =>
new Promise<boolean>((resolve) => {
if (window.Razorpay) {
return resolve(true);
}

const script = document.createElement('script');

script.src =
  'https://checkout.razorpay.com/v1/checkout.js';

script.onload = () =>
  resolve(Boolean(window.Razorpay));

script.onerror = () => resolve(false);

document.body.appendChild(script);

});

export default function CheckoutPage() {
const router = useRouter();

const { user, status } = useAuth();

const {
cart,
subtotal,
total,
clearCart,
} = useCart();

const [error, setError] = useState('');

const [paying, setPaying] = useState(false);

const [addresses, setAddresses] =
useState<Address[]>([]);

const [
selectedAddressId,
setSelectedAddressId,
] = useState('');

const [saveAddress, setSaveAddress] =
useState(false);

const [address, setAddress] =
useState(blankAddress);

const idempotencyKey = useRef('');


useEffect(() => {
if (status === 'unauthenticated') {
router.replace(
'/login?callbackUrl=/checkout'
);
}
}, [status, router]);

## /*

## LOAD SAVED ADDRESSES

*/

useEffect(() => {
if (!user) return;

setAddress((current) => ({
  ...current,

  name:
    current.name ||
    user.name ||
    '',

  phone:
    current.phone ||
    user.phone ||
    '',
}));

fetch('/api/addresses', {
  credentials: 'include',
})
  .then((response) =>
    response.ok
      ? response.json()
      : null
  )
  .then((data) => {
    const saved =
      data?.addresses || [];

    setAddresses(saved);

    const preferred =
      saved.find(
        (item: Address) =>
          item.isDefault
      ) || saved[0];

    if (preferred) {
      setSelectedAddressId(
        preferred.id ||
          preferred._id ||
          ''
      );
    }
  })
  .catch(() => {
    setAddresses([]);
  });

}, [user?.id]);


const selectedAddress =
addresses.find(
(item) =>
(item.id || item._id) ===
selectedAddressId
);



const startCheckout = async (
event: FormEvent
) => {
event.preventDefault();

setError('');

if (!cart.length) {
  router.replace('/shop');
  return;
}

setPaying(true);

try {
  /*
  Generate Idempotency Key
  */

  if (!idempotencyKey.current) {
    idempotencyKey.current =
      window.crypto?.randomUUID?.() ||
      `${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;
  }

  /*
  Checkout Payload
  */

  const payload =
    selectedAddressId
      ? {
          cart: cart.map(
            ({
              id,
              size,
              quantity,
            }) => ({
              id,
              size,
              quantity,
            })
          ),

          addressId:
            selectedAddressId,
        }
      : {
          cart: cart.map(
            ({
              id,
              size,
              quantity,
            }) => ({
              id,
              size,
              quantity,
            })
          ),

          address,

          saveAddress,
        };

  /*
  Create Razorpay Order
  */

  const res = await fetch(
    '/api/checkout',
    {
      method: 'POST',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',

        'Idempotency-Key':
          idempotencyKey.current,
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error ||
        'Unable to start payment'
    );
  }

  /*
  Load Razorpay
  */

  if (
    !(await loadRazorpay()) ||
    !window.Razorpay
  ) {
    throw new Error(
      'Secure payment window could not load. Please check your connection and try again.'
    );
  }

  const shippingAddress =
    selectedAddress || address;

  /*
  Open Razorpay
  */

  const razorpay =
    new window.Razorpay({
      key: data.key,

      amount: data.amount,

      currency: data.currency,

      name: 'Jannat Elegance',

      description:
        'Secure order payment',

      order_id:
        data.razorpayOrderId,

      prefill: {
        name:
          shippingAddress.name,

        email:
          user?.email,

        contact:
          shippingAddress.phone,
      },

      theme: {
        color: '#5c0620',
      },

      modal: {
        ondismiss: () =>
          setPaying(false),
      },

      handler: async (
        payment: {
          razorpay_order_id: string;

          razorpay_payment_id: string;

          razorpay_signature: string;
        }
      ) => {
        const verify =
          await fetch(
            '/api/checkout/verify',
            {
              method: 'POST',

              credentials:
                'include',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify(
                payment
              ),
            }
          );

        const verified =
          await verify.json();

        if (!verify.ok) {
          setError(
            verified.error ||
              'Payment verification failed. Please contact support.'
          );

          setPaying(false);

          return;
        }

        /*
        Clear Cart
        */

        clearCart();

        /*
        Redirect Success Page
        */

        router.replace(
          `/checkout/success?orderId=${verified.orderId}`
        );
      },
    });

  razorpay.open();
} catch (reason) {
  setError(
    reason instanceof Error
      ? reason.message
      : 'Unable to start payment'
  );

  setPaying(false);
}

};



if (status === 'loading') {
return ( <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] text-maroon-900">
Preparing secure checkout… </main>
);
}



return ( <main className="min-h-screen bg-[#fff8fa] py-10">

```
  <div className="mx-auto max-w-6xl px-4 sm:px-6">

    {/* PAGE HEADER */}

    <h1 className="font-serif text-4xl text-maroon-950">
      Secure Checkout
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      Your total and inventory are verified securely before payment.
    </p>

    {/* ERROR MESSAGE */}

    {error && (
      <p
        role="alert"
        className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
      >
        {error}
      </p>
    )}

    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">

      {/* ================================= */}
      {/* SHIPPING ADDRESS */}
      {/* ================================= */}

      <form
        onSubmit={startCheckout}
        className="rounded-3xl border border-maroon-100 bg-white p-6 sm:p-8"
      >

        <h2 className="font-serif text-2xl text-maroon-950">
          Shipping Address
        </h2>

        {/* SAVED ADDRESSES */}

        {addresses.length > 0 && (

          <div className="mt-5 rounded-2xl border border-maroon-100 bg-maroon-50/50 p-4">

            <p className="text-xs font-bold uppercase tracking-wider text-maroon-900">
              Saved Addresses
            </p>

            <div className="mt-3 space-y-2">

              {addresses.map(
                (item) => {
                  const id =
                    item.id ||
                    item._id ||
                    '';

                  return (
                    <label
                      key={id}
                      className={`block cursor-pointer rounded-xl border p-3 text-sm ${
                        selectedAddressId ===
                        id
                          ? 'border-maroon-800 bg-white'
                          : 'border-maroon-100 bg-white/70'
                      }`}
                    >

                      <input
                        type="radio"

                        checked={
                          selectedAddressId ===
                          id
                        }

                        onChange={() =>
                          setSelectedAddressId(
                            id
                          )
                        }

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
                        {item.addressLine},{' '}
                        {item.city},{' '}
                        {item.state} –{' '}
                        {item.pincode}
                        {' · '}
                        {item.phone}
                      </span>

                    </label>
                  );
                }
              )}

              {/* NEW ADDRESS */}

              <label
                className={`block cursor-pointer rounded-xl border p-3 text-sm ${
                  !selectedAddressId
                    ? 'border-maroon-800 bg-white'
                    : 'border-maroon-100 bg-white/70'
                }`}
              >

                <input
                  type="radio"

                  checked={
                    !selectedAddressId
                  }

                  onChange={() =>
                    setSelectedAddressId(
                      ''
                    )
                  }

                  className="mr-2"
                />

                Use a new delivery address

              </label>

            </div>

          </div>
        )}

        {/* NEW ADDRESS FORM */}

        {!selectedAddressId && (

          <>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              {/* NAME */}

              <input
                required

                placeholder="Full name"

                value={address.name}

                onChange={(event) =>
                  setAddress({
                    ...address,

                    name:
                      event.target.value,
                  })
                }

                className="rounded-xl border border-maroon-100 p-3 text-sm"
              />

              {/* PHONE */}

              <input
                required

                placeholder="Phone number"

                value={address.phone}

                onChange={(event) =>
                  setAddress({
                    ...address,

                    phone:
                      event.target.value
                        .replace(/\D/g, '')
                        .slice(0, 10),
                  })
                }

                className="rounded-xl border border-maroon-100 p-3 text-sm"
              />

              {/* ADDRESS */}

              <textarea
                required

                placeholder="House / street / area"

                value={
                  address.addressLine
                }

                onChange={(event) =>
                  setAddress({
                    ...address,

                    addressLine:
                      event.target.value,
                  })
                }

                className="min-h-28 rounded-xl border border-maroon-100 p-3 text-sm sm:col-span-2"
              />

              {/* CITY */}

              <input
                required

                placeholder="City"

                value={address.city}

                onChange={(event) =>
                  setAddress({
                    ...address,

                    city:
                      event.target.value,
                  })
                }

                className="rounded-xl border border-maroon-100 p-3 text-sm"
              />

              {/* STATE */}

              <input
                required

                placeholder="State"

                value={address.state}

                onChange={(event) =>
                  setAddress({
                    ...address,

                    state:
                      event.target.value,
                  })
                }

                className="rounded-xl border border-maroon-100 p-3 text-sm"
              />

              {/* PINCODE */}

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
                        .replace(/\D/g, '')
                        .slice(0, 6),
                  })
                }

                className="rounded-xl border border-maroon-100 p-3 text-sm"
              />

            </div>

            {/* SAVE ADDRESS */}

            <label className="mt-4 flex items-center gap-2 text-sm text-maroon-900">

              <input
                type="checkbox"

                checked={saveAddress}

                onChange={(event) =>
                  setSaveAddress(
                    event.target.checked
                  )
                }
              />

              Save this address to my profile

            </label>

          </>
        )}

        {/* PAYMENT BUTTON */}

        <button
          disabled={
            paying ||
            !cart.length
          }

          className="mt-7 w-full rounded-full bg-maroon-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-maroon-900 disabled:opacity-50"
        >

          {paying
            ? 'Opening Payment…'
            : `Pay ₹${total.toLocaleString(
                'en-IN'
              )}`}

        </button>

        {/* SECURITY */}

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">

          <ShieldCheck
            size={15}
            className="text-green-600"
          />

          Razorpay processes your payment securely.

        </p>

      </form>

      {/* ================================= */}
      {/* ORDER SUMMARY */}
      {/* ================================= */}

      <aside className="h-fit rounded-3xl border border-maroon-100 bg-white p-6">

        <h2 className="border-b border-maroon-100 pb-4 font-serif text-2xl text-maroon-950">
          Order Summary
        </h2>

        {/* PRODUCTS */}

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
                  Size {item.size} · Qty{' '}
                  {item.quantity}
                </p>

                <p className="mt-1 text-sm font-bold text-maroon-800">

                  ₹{(
                    item.price *
                    item.quantity
                  ).toLocaleString(
                    'en-IN'
                  )}

                </p>

              </div>

            </div>

          ))}

        </div>

        {/* PRICE DETAILS */}

        <div className="mt-3 space-y-3 border-t border-maroon-100 pt-4 text-sm">

          {/* SUBTOTAL */}

          <p className="flex justify-between text-gray-600">

            <span>
              Subtotal
            </span>

            <span>
              ₹{subtotal.toLocaleString(
                'en-IN'
              )}
            </span>

          </p>

          {/* SHIPPING */}

          <p className="flex justify-between text-gray-600">

            <span className="flex items-center gap-2">

              <Truck size={15} />

              Shipping

            </span>

            <span className="font-semibold text-green-600">
              FREE
            </span>

          </p>

        </div>

        {/* ================================= */}
        {/* DELIVERY PARTNER */}
        {/* ================================= */}

        <div className="mt-5 border-t border-maroon-100 pt-5">

          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-maroon-900">

            Delivery Partner

          </p>

          <div className="flex items-center gap-4 rounded-2xl border border-maroon-100 bg-maroon-50/50 p-4">

            {/* DTDC LOGO */}

            <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm">

              <Image
                src="/images/dtdc-logo.png"

                alt="DTDC Express"

                width={55}

                height={40}

                className="object-contain"
              />

            </div>

            {/* DTDC INFO */}

            <div>

              <p className="font-semibold text-maroon-950">

                DTDC Express

              </p>

              <p className="mt-1 text-xs leading-relaxed text-gray-500">

                Free delivery across India through our trusted delivery partner.

              </p>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* TOTAL */}
        {/* ================================= */}

        <div className="mt-5 border-t border-maroon-100 pt-4">

          <p className="flex justify-between text-lg font-bold text-maroon-950">

            <span>
              Total
            </span>

            <span>
              ₹{total.toLocaleString(
                'en-IN'
              )}
            </span>

          </p>

        </div>

      </aside>

    </div>

  </div>

</main>

);
}
