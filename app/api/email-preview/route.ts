import { NextResponse } from 'next/server';
import {
  customerConfirmationEmail,
  storeNotificationEmail,
  type OrderEmailData,
} from '@/lib/email/templates';

// Dev-only preview of the order email templates:
//   /api/email-preview          → customer confirmation
//   /api/email-preview?type=store → store notification
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const sampleData: OrderEmailData = {
    orderId: 'WNB-MDL2K9-X4F7',
    customer: {
      name: 'Sofia van Dijk',
      email: 'sofia@example.com',
      phone: '+31 6 12 34 56 78',
    },
    pickupTime: 'vrijdag 18 juli om 12:30',
    total: 34.5,
    items: [
      {
        id: 'focaccia-mortadella',
        productId: 'focaccia-mortadella',
        name: 'Focaccia Mortadella',
        description: '',
        price: 12.5,
        quantity: 2,
        categoryId: 'focaccia',
        extras: [{ name: 'Extra burrata', price: 2.5 }],
      },
      {
        id: 'maritozzo',
        productId: 'maritozzo',
        name: 'Maritozzo Pistache',
        description: '',
        price: 4.5,
        quantity: 1,
        categoryId: 'dolci',
        size: 'large',
      },
    ],
  };

  const { searchParams } = new URL(request.url);
  const html =
    searchParams.get('type') === 'store'
      ? storeNotificationEmail(sampleData)
      : customerConfirmationEmail(sampleData);

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
