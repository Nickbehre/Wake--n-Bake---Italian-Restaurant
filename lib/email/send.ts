import { Resend } from 'resend';
import type { OrderCartItem, CustomerInfo } from '@/lib/types/order';
import { customerConfirmationEmail, storeNotificationEmail } from './templates';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = 'order@wakenbake.nl';
const FROM_NAME = "Wake N' Bake Panificio";
const STORE_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'info@wakenbake.nl';

interface SendOrderEmailsParams {
  orderId: string;
  items: OrderCartItem[];
  customer: CustomerInfo;
  total: number;
  pickupTime: string;
}

/**
 * Send order confirmation to customer + notification to store
 */
export async function sendOrderEmails(params: SendOrderEmailsParams) {
  const { orderId, items, customer, total, pickupTime } = params;

  const emailData = { orderId, items, customer, total, pickupTime };

  const resend = getResend();

  const results = await Promise.allSettled([
    // Email 1: Customer confirmation
    resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: customer.email,
      subject: `Orderbevestiging ${orderId} - Wake N' Bake`,
      html: customerConfirmationEmail(emailData),
    }),

    // Email 2: Store notification
    ...(STORE_EMAIL
      ? [
          resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: STORE_EMAIL,
            subject: `NIEUWE BESTELLING ${orderId} - Ophalen ${pickupTime}`,
            html: storeNotificationEmail(emailData),
          }),
        ]
      : []),
  ]);

  const customerResult = results[0];
  const storeResult = results[1];

  return {
    customerEmail:
      customerResult.status === 'fulfilled'
        ? { success: true, id: customerResult.value.data?.id }
        : { success: false, error: customerResult.reason },
    storeEmail: storeResult
      ? storeResult.status === 'fulfilled'
        ? { success: true, id: storeResult.value.data?.id }
        : { success: false, error: storeResult.reason }
      : { success: false, error: 'No store email configured' },
  };
}
