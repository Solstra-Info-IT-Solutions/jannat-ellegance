// type OrderEmail = {
//   id: string;
//   customerName: string;
//   customerEmail: string;
//   total: number;
//   status: string;
//   items: Array<{ name: string; quantity: number; price: number; size: string }>;
// };

// function escapeHtml(value: string) {
//   return value.replace(/[&<>'"]/g, (character) => ({
//     '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
//   }[character] || character));
// }

// /** Sends transactional email from the server only. Delivery failure never invalidates a paid order. */
// export async function sendOrderConfirmationEmail(order: OrderEmail) {
//   const apiKey = process.env.RESEND_API_KEY;
//   const from = process.env.EMAIL_FROM;
//   if (!apiKey || !from) {
//     console.error('Order email was not sent: Resend is not configured.');
//     return { sent: false, reason: 'not-configured' as const };
//   }

//   const itemRows = order.items.map((item) => `<li>${escapeHtml(item.name)} — ${escapeHtml(item.size)} × ${item.quantity}: ₹${item.price * item.quantity}</li>`).join('');
//   const response = await fetch('https://api.resend.com/emails', {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       'Content-Type': 'application/json',
//       'Idempotency-Key': `order-confirmation-${order.id}`,
//     },
//     body: JSON.stringify({
//       from,
//       to: [order.customerEmail],
//       subject: `Order confirmed — ${order.id}`,
//       html: `<h1>Thank you, ${escapeHtml(order.customerName)}!</h1><p>Your Jannat Elegance order <strong>${escapeHtml(order.id)}</strong> is confirmed.</p><ul>${itemRows}</ul><p><strong>Total paid: ₹${order.total.toLocaleString('en-IN')}</strong></p><p>We will email you whenever your order status changes.</p>`,
//     }),
//   });

//   if (!response.ok) {
//     console.error('Resend rejected order email:', response.status, await response.text());
//     return { sent: false, reason: 'provider-error' as const };
//   }
//   return { sent: true as const };
// }


type OrderEmailItem = {
  name: string;
  quantity: number;
  price: number;
  size: string;
  image?: string;
};

type OrderEmail = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  items: OrderEmailItem[];

  // Optional premium details
  orderDate?: string;
  subtotal?: number;
  shipping?: number;
  discount?: number;

  shippingAddress?: {
    name?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    phone?: string;
  };

  orderUrl?: string;
};

const BRAND = {
  name: "JANNAT ELEGANCE",
  tagline: "TIMELESS • ELEGANT • YOU",
  accent: "#B08D57",
  dark: "#171411",
  cream: "#F8F6F2",
  muted: "#756F68",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.jannatelegance.com",
};

function escapeHtml(value: string | number | undefined | null) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character] || character;
  });
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(date?: string) {
  if (!date) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  }

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function normalizeStatus(status: string) {
  return status
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getShippingAddress(address?: OrderEmail["shippingAddress"]) {
  if (!address) return "";

  const lines = [
    address.name,
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state, address.postalCode]
      .filter(Boolean)
      .join(", "),
    address.phone,
  ].filter(Boolean);

  return lines
    .map(
      (line) =>
        `<div style="margin:0 0 5px;">${escapeHtml(line)}</div>`
    )
    .join("");
}

/**
 * Sends a premium transactional order confirmation email.
 *
 * IMPORTANT:
 * - This function must only run server-side.
 * - Email delivery failure never invalidates a successfully paid order.
 */
export async function sendOrderConfirmationEmail(order: OrderEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.error(
      "[ORDER EMAIL] Resend is not configured. Missing RESEND_API_KEY or EMAIL_FROM."
    );

    return {
      sent: false,
      reason: "not-configured" as const,
    };
  }

  if (!order.customerEmail) {
    console.error(
      `[ORDER EMAIL] Customer email missing for order ${order.id}`
    );

    return {
      sent: false,
      reason: "missing-customer-email" as const,
    };
  }

  const calculatedSubtotal = order.items.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const subtotal =
    typeof order.subtotal === "number"
      ? order.subtotal
      : calculatedSubtotal;

  const shipping =
    typeof order.shipping === "number"
      ? order.shipping
      : 0;

  const discount =
    typeof order.discount === "number"
      ? order.discount
      : 0;

  const itemRows = order.items
    .map((item) => {
      const itemTotal =
        Number(item.price || 0) *
        Number(item.quantity || 0);

      const imageHtml = item.image
        ? `
          <td
            width="96"
            valign="top"
            style="
              width:96px;
              padding-right:18px;
            "
          >
            <img
              src="${escapeHtml(item.image)}"
              alt="${escapeHtml(item.name)}"
              width="78"
              height="96"
              style="
                display:block;
                width:78px;
                height:96px;
                object-fit:cover;
                border-radius:4px;
                background:#F2EFEA;
              "
            />
          </td>
        `
        : `
          <td
            width="96"
            valign="top"
            style="
              width:96px;
              padding-right:18px;
            "
          >
            <div
              style="
                width:78px;
                height:96px;
                background:#F2EFEA;
                border-radius:4px;
                text-align:center;
                line-height:96px;
                color:#B08D57;
                font-size:11px;
                letter-spacing:1px;
              "
            >
              JE
            </div>
          </td>
        `;

      return `
        <tr>
          <td
            style="
              padding:24px 0;
              border-bottom:1px solid #E9E4DC;
            "
          >
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              role="presentation"
            >
              <tr>

                ${imageHtml}

                <td valign="top">

                  <div
                    style="
                      color:#171411;
                      font-size:16px;
                      line-height:23px;
                      font-weight:600;
                      letter-spacing:0.1px;
                      margin-bottom:8px;
                    "
                  >
                    ${escapeHtml(item.name)}
                  </div>

                  <div
                    style="
                      color:#756F68;
                      font-size:13px;
                      line-height:20px;
                    "
                  >
                    ${item.size ? `Size: ${escapeHtml(item.size)}` : ""}
                    ${
                      item.size
                        ? `<span style="color:#C8C1B8;">&nbsp;|&nbsp;</span>`
                        : ""
                    }
                    Quantity: ${escapeHtml(item.quantity)}
                  </div>

                  <div
                    style="
                      margin-top:12px;
                      color:#171411;
                      font-size:14px;
                      font-weight:600;
                    "
                  >
                    ${formatPrice(itemTotal)}
                  </div>

                </td>

              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join("");

  const shippingAddressHtml = getShippingAddress(
    order.shippingAddress
  );

  const orderUrl =
    order.orderUrl ||
    `${BRAND.siteUrl}/orders/${encodeURIComponent(order.id)}`;

  const html = `
<!doctype html>
<html lang="en">

<head>

<meta charset="UTF-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<meta name="x-apple-disable-message-reformatting" />

<meta
  name="format-detection"
  content="telephone=no,address=no,email=no,date=no,url=no"
/>

<title>Order Confirmed | ${BRAND.name}</title>

</head>


<body
  style="
    margin:0;
    padding:0;
    width:100%;
    background-color:#EEEAE4;
    -webkit-text-size-adjust:100%;
    -ms-text-size-adjust:100%;
  "
>

<center
  style="
    width:100%;
    background-color:#EEEAE4;
  "
>

<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:100%;
    background:#EEEAE4;
  "
>

<tr>

<td align="center" style="padding:32px 12px;">

<!-- MAIN EMAIL CONTAINER -->

<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:100%;
    max-width:640px;
    margin:0 auto;
    background:#FFFFFF;
  "
>


<!-- ================================================= -->
<!-- BRAND HEADER -->
<!-- ================================================= -->

<tr>

<td
  align="center"
  style="
    background:#171411;
    padding:38px 30px 34px;
  "
>

<div
  style="
    color:#FFFFFF;
    font-family:Georgia, 'Times New Roman', serif;
    font-size:30px;
    line-height:36px;
    font-weight:400;
    letter-spacing:5px;
  "
>
  JANNAT
</div>

<div
  style="
    color:#B08D57;
    font-family:Arial, Helvetica, sans-serif;
    font-size:10px;
    line-height:18px;
    letter-spacing:6px;
    text-transform:uppercase;
    margin-top:5px;
  "
>
  ELEGANCE
</div>

<div
  style="
    width:42px;
    height:1px;
    background:#B08D57;
    margin:20px auto 0;
  "
></div>

</td>

</tr>


<!-- ================================================= -->
<!-- HERO / ORDER SUCCESS -->
<!-- ================================================= -->

<tr>

<td
  align="center"
  style="
    padding:46px 38px 30px;
    background:#FFFFFF;
  "
>

<div
  style="
    color:#B08D57;
    font-family:Arial, Helvetica, sans-serif;
    font-size:11px;
    line-height:18px;
    letter-spacing:2px;
    font-weight:700;
    text-transform:uppercase;
    margin-bottom:16px;
  "
>
  Order Successfully Placed
</div>


<h1
  style="
    margin:0;
    color:#171411;
    font-family:Georgia, 'Times New Roman', serif;
    font-size:36px;
    line-height:44px;
    font-weight:400;
    letter-spacing:-0.5px;
  "
>
  Thank You,
  ${escapeHtml(order.customerName)}.
</h1>


<p
  style="
    max-width:470px;
    margin:20px auto 0;
    color:#756F68;
    font-family:Arial, Helvetica, sans-serif;
    font-size:15px;
    line-height:25px;
  "
>
  Your order has been received and is now being carefully prepared.
  We are delighted to have you as part of the Jannat Elegance experience.
</p>

</td>

</tr>


<!-- ================================================= -->
<!-- ORDER INFORMATION -->
<!-- ================================================= -->

<tr>

<td style="padding:10px 38px 34px;">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
  style="
    border:1px solid #E8E2D9;
    background:#FCFBF9;
  "
>

<tr>

<td
  width="50%"
  valign="top"
  style="
    width:50%;
    padding:22px;
    border-right:1px solid #E8E2D9;
  "
>

<div
  style="
    color:#8B847C;
    font-family:Arial, Helvetica, sans-serif;
    font-size:10px;
    line-height:16px;
    font-weight:700;
    letter-spacing:1.8px;
    text-transform:uppercase;
  "
>
  Order Number
</div>

<div
  style="
    margin-top:8px;
    color:#171411;
    font-family:Arial, Helvetica, sans-serif;
    font-size:15px;
    line-height:22px;
    font-weight:600;
  "
>
  ${escapeHtml(order.id)}
</div>

</td>


<td
  width="50%"
  valign="top"
  style="
    width:50%;
    padding:22px;
  "
>

<div
  style="
    color:#8B847C;
    font-family:Arial, Helvetica, sans-serif;
    font-size:10px;
    line-height:16px;
    font-weight:700;
    letter-spacing:1.8px;
    text-transform:uppercase;
  "
>
  Order Date
</div>

<div
  style="
    margin-top:8px;
    color:#171411;
    font-family:Arial, Helvetica, sans-serif;
    font-size:15px;
    line-height:22px;
    font-weight:600;
  "
>
  ${escapeHtml(formatDate(order.orderDate))}
</div>

</td>

</tr>


<tr>

<td
  colspan="2"
  style="
    padding:0 22px 22px;
  "
>

<div
  style="
    color:#8B847C;
    font-family:Arial, Helvetica, sans-serif;
    font-size:10px;
    line-height:16px;
    font-weight:700;
    letter-spacing:1.8px;
    text-transform:uppercase;
  "
>
  Status
</div>

<div
  style="
    margin-top:8px;
    color:#5E765B;
    font-family:Arial, Helvetica, sans-serif;
    font-size:13px;
    line-height:20px;
    font-weight:700;
    letter-spacing:0.8px;
    text-transform:uppercase;
  "
>
  ${escapeHtml(normalizeStatus(order.status))}
</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- ================================================= -->
<!-- ORDER ITEMS -->
<!-- ================================================= -->

<tr>

<td style="padding:0 38px;">

<div
  style="
    color:#B08D57;
    font-family:Arial, Helvetica, sans-serif;
    font-size:10px;
    line-height:16px;
    font-weight:700;
    letter-spacing:2px;
    text-transform:uppercase;
    margin-bottom:10px;
  "
>
  Your Selection
</div>


<h2
  style="
    margin:0 0 8px;
    color:#171411;
    font-family:Georgia, 'Times New Roman', serif;
    font-size:27px;
    line-height:34px;
    font-weight:400;
  "
>
  Order Summary
</h2>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
>

${itemRows}

</table>

</td>

</tr>


<!-- ================================================= -->
<!-- PAYMENT SUMMARY -->
<!-- ================================================= -->

<tr>

<td style="padding:30px 38px 0;">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
  style="
    border-top:1px solid #D9D1C7;
  "
>

<tr>

<td
  style="
    padding:18px 0 6px;
    color:#756F68;
    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
  "
>
  Subtotal
</td>

<td
  align="right"
  style="
    padding:18px 0 6px;
    color:#171411;
    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
  "
>
  ${formatPrice(subtotal)}
</td>

</tr>


${
  discount > 0
    ? `
<tr>

<td
  style="
    padding:6px 0;
    color:#756F68;
    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
  "
>
  Discount
</td>

<td
  align="right"
  style="
    padding:6px 0;
    color:#5E765B;
    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
    font-weight:600;
  "
>
  − ${formatPrice(discount)}
</td>

</tr>
`
    : ""
}


<tr>

<td
  style="
    padding:6px 0;
    color:#756F68;
    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
  "
>
  Shipping
</td>

<td
  align="right"
  style="
    padding:6px 0;
    color:#171411;
    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
  "
>
  ${
    shipping === 0
      ? "Complimentary"
      : formatPrice(shipping)
  }
</td>

</tr>


<tr>

<td
  style="
    padding:20px 0 0;
    color:#171411;
    font-family:Georgia, 'Times New Roman', serif;
    font-size:21px;
    line-height:28px;
    font-weight:400;
  "
>
  Total
</td>

<td
  align="right"
  style="
    padding:20px 0 0;
    color:#171411;
    font-family:Georgia, 'Times New Roman', serif;
    font-size:24px;
    line-height:28px;
    font-weight:600;
  "
>
  ${formatPrice(order.total)}
</td>

</tr>

</table>

</td>

</tr>


<!-- ================================================= -->
<!-- SHIPPING ADDRESS -->
<!-- ================================================= -->

${
  shippingAddressHtml
    ? `
<tr>

<td style="padding:42px 38px 0;">

<div
  style="
    padding:25px;
    background:#F8F6F2;
    border-left:2px solid #B08D57;
  "
>

<div
  style="
    color:#B08D57;
    font-family:Arial, Helvetica, sans-serif;
    font-size:10px;
    line-height:16px;
    font-weight:700;
    letter-spacing:2px;
    text-transform:uppercase;
    margin-bottom:12px;
  "
>
  Delivery Address
</div>


<div
  style="
    color:#4E4943;
    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
    line-height:22px;
  "
>
  ${shippingAddressHtml}
</div>

</div>

</td>

</tr>
`
    : ""
}


<!-- ================================================= -->
<!-- WHAT HAPPENS NEXT -->
<!-- ================================================= -->

<tr>

<td
  align="center"
  style="
    padding:46px 38px 42px;
  "
>

<div
  style="
    width:40px;
    height:1px;
    background:#B08D57;
    margin:0 auto 22px;
  "
></div>


<h2
  style="
    margin:0;
    color:#171411;
    font-family:Georgia, 'Times New Roman', serif;
    font-size:28px;
    line-height:36px;
    font-weight:400;
  "
>
  What happens next?
</h2>


<p
  style="
    max-width:460px;
    margin:16px auto 0;
    color:#756F68;
    font-family:Arial, Helvetica, sans-serif;
    font-size:14px;
    line-height:24px;
  "
>
  Our team will carefully process your order and keep you informed
  as it moves through each stage of its journey to you.
</p>


<!-- CTA BUTTON -->

<table
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
  align="center"
  style="
    margin:30px auto 0;
  "
>

<tr>

<td
  align="center"
  bgcolor="#171411"
>

<a
  href="${escapeHtml(orderUrl)}"
  target="_blank"
  style="
    display:inline-block;
    padding:15px 30px;
    color:#FFFFFF;
    font-family:Arial, Helvetica, sans-serif;
    font-size:11px;
    line-height:18px;
    font-weight:700;
    letter-spacing:1.8px;
    text-decoration:none;
    text-transform:uppercase;
  "
>
  View Your Order
</a>

</td>

</tr>

</table>

</td>

</tr>


<!-- ================================================= -->
<!-- CUSTOMER SUPPORT -->
<!-- ================================================= -->

<tr>

<td
  style="
    padding:0 38px 42px;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  role="presentation"
  style="
    border-top:1px solid #E8E2D9;
  "
>

<tr>

<td
  align="center"
  style="
    padding-top:28px;
  "
>

<p
  style="
    margin:0;
    color:#756F68;
    font-family:Arial, Helvetica, sans-serif;
    font-size:13px;
    line-height:22px;
  "
>
  Need assistance with your order?
</p>


<p
  style="
    margin:6px 0 0;
    color:#171411;
    font-family:Arial, Helvetica, sans-serif;
    font-size:13px;
    line-height:22px;
    font-weight:600;
  "
>
  We are always here to help.
</p>

</td>

</tr>

</table>

</td>

</tr>


<!-- ================================================= -->
<!-- FOOTER -->
<!-- ================================================= -->

<tr>

<td
  align="center"
  style="
    background:#171411;
    padding:38px 30px;
  "
>

<div
  style="
    color:#FFFFFF;
    font-family:Georgia, 'Times New Roman', serif;
    font-size:20px;
    line-height:26px;
    letter-spacing:4px;
  "
>
  JANNAT
</div>


<div
  style="
    color:#B08D57;
    font-family:Arial, Helvetica, sans-serif;
    font-size:9px;
    line-height:16px;
    letter-spacing:5px;
    text-transform:uppercase;
    margin-top:4px;
  "
>
  ELEGANCE
</div>


<div
  style="
    width:32px;
    height:1px;
    background:#B08D57;
    margin:20px auto;
  "
></div>


<p
  style="
    margin:0;
    color:#A9A39B;
    font-family:Arial, Helvetica, sans-serif;
    font-size:11px;
    line-height:19px;
  "
>
  © ${new Date().getFullYear()} Jannat Elegance.
  All rights reserved.
</p>


<p
  style="
    margin:10px 0 0;
    color:#807A73;
    font-family:Arial, Helvetica, sans-serif;
    font-size:10px;
    line-height:18px;
  "
>
  A little elegance, delivered with love.
</p>

</td>

</tr>


</table>

</td>

</tr>

</table>

</center>

</body>

</html>
`;

  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",

          // Prevents duplicate emails for the same order.
          "Idempotency-Key": `order-confirmation-${order.id}`,
        },

        body: JSON.stringify({
          from,

          to: [order.customerEmail],

          subject: `Your order is confirmed ✦ ${BRAND.name}`,

          html,

          tags: [
            {
              name: "category",
              value: "order-confirmation",
            },
            {
              name: "order_id",
              value: String(order.id),
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        `[ORDER EMAIL] Resend rejected email for order ${order.id}:`,
        response.status,
        errorText
      );

      return {
        sent: false,
        reason: "provider-error" as const,
      };
    }

    const data = await response.json();

    console.log(
      `[ORDER EMAIL] Successfully sent for order ${order.id}.`,
      data
    );

    return {
      sent: true as const,
      emailId: data?.id,
    };
  } catch (error) {
    console.error(
      `[ORDER EMAIL] Unexpected error while sending email for order ${order.id}:`,
      error
    );

    return {
      sent: false,
      reason: "network-error" as const,
    };
  }
}