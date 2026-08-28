type OrderEmail = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  items: Array<{ name: string; quantity: number; price: number; size: string }>;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character] || character));
}

/** Sends transactional email from the server only. Delivery failure never invalidates a paid order. */
export async function sendOrderConfirmationEmail(order: OrderEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.error('Order email was not sent: Resend is not configured.');
    return { sent: false, reason: 'not-configured' as const };
  }

  const itemRows = order.items.map((item) => `<li>${escapeHtml(item.name)} — ${escapeHtml(item.size)} × ${item.quantity}: ₹${item.price * item.quantity}</li>`).join('');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `order-confirmation-${order.id}`,
    },
    body: JSON.stringify({
      from,
      to: [order.customerEmail],
      subject: `Order confirmed — ${order.id}`,
      html: `<h1>Thank you, ${escapeHtml(order.customerName)}!</h1><p>Your Jannat Elegance order <strong>${escapeHtml(order.id)}</strong> is confirmed.</p><ul>${itemRows}</ul><p><strong>Total paid: ₹${order.total.toLocaleString('en-IN')}</strong></p><p>We will email you whenever your order status changes.</p>`,
    }),
  });

  if (!response.ok) {
    console.error('Resend rejected order email:', response.status, await response.text());
    return { sent: false, reason: 'provider-error' as const };
  }
  return { sent: true as const };
}
