import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
try {
await dbConnect();

const body = await request.json();

const {
  orderId,
  productId,
  rating,
  comment,
} = body;

/* ===============================
   BASIC VALIDATION
=============================== */

if (
  !orderId ||
  typeof orderId !== 'string'
) {
  return NextResponse.json(
    {
      error: 'Invalid order ID.',
    },
    {
      status: 400,
    }
  );
}

if (
  !productId ||
  typeof productId !== 'string'
) {
  return NextResponse.json(
    {
      error: 'Invalid product ID.',
    },
    {
      status: 400,
    }
  );
}

const numericRating =
  Number(rating);

if (
  !Number.isInteger(
    numericRating
  ) ||
  numericRating < 1 ||
  numericRating > 5
) {
  return NextResponse.json(
    {
      error:
        'Please select a rating between 1 and 5 stars.',
    },
    {
      status: 400,
    }
  );
}

if (
  !comment ||
  typeof comment !== 'string'
) {
  return NextResponse.json(
    {
      error:
        'Please write your review.',
    },
    {
      status: 400,
    }
  );
}

const cleanComment =
  comment.trim();

if (
  cleanComment.length < 10
) {
  return NextResponse.json(
    {
      error:
        'Review must contain at least 10 characters.',
    },
    {
      status: 400,
    }
  );
}

if (
  cleanComment.length > 1000
) {
  return NextResponse.json(
    {
      error:
        'Review cannot exceed 1000 characters.',
    },
    {
      status: 400,
    }
  );
}

/* ===============================
   FIND ORDER
=============================== */

const order =
  await Order.findById(orderId);

if (!order) {
  return NextResponse.json(
    {
      error:
        'Order not found.',
    },
    {
      status: 404,
    }
  );
}

/* ===============================
   DELIVERED ORDER CHECK
=============================== */

if (
  order.status !== 'delivered'
) {
  return NextResponse.json(
    {
      error:
        'You can submit a review only after your order has been delivered.',
    },
    {
      status: 400,
    }
  );
}

/* ===============================
   VERIFY PRODUCT
=============================== */

const orderedProduct =
  order.items.find(
    (
      item: {
        productId: string;
      }
    ) =>
      String(
        item.productId
      ) ===
      String(productId)
  );

if (!orderedProduct) {
  return NextResponse.json(
    {
      error:
        'This product does not belong to this order.',
    },
    {
      status: 403,
    }
  );
}

/* ===============================
   DUPLICATE CHECK
=============================== */

const existingReview =
  await Review.findOne({
    orderId,
    productId,
  });

if (existingReview) {
  return NextResponse.json(
    {
      error:
        'You have already submitted a review for this product.',
    },
    {
      status: 409,
    }
  );
}

/* ===============================
   CREATE REVIEW
=============================== */

const review =
  await Review.create({
    orderId,
    productId,

    productName:
      orderedProduct.name,

    customerName:
      order.customerName,

    customerEmail:
      order.customerEmail,

    rating:
      numericRating,

    comment:
      cleanComment,

    status:
      'pending',
  });

return NextResponse.json(
  {
    success: true,

    message:
      'Thank you! Your review has been submitted for approval.',

    review,
  },
  {
    status: 201,
  }
);

} catch (error) {
console.error(
'Review submission error:',
error
);

/* MongoDB Duplicate Index */

if (
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (
    error as {
      code?: number;
    }
  ).code === 11000
) {
  return NextResponse.json(
    {
      error:
        'You have already submitted a review for this product.',
    },
    {
      status: 409,
    }
  );
}

return NextResponse.json(
  {
    error:
      'Unable to submit review. Please try again.',
  },
  {
    status: 500,
  }
);

}
}
