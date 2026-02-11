import type { OrderCartItem, CustomerInfo } from '@/lib/types/order';

interface OrderEmailData {
  orderId: string;
  items: OrderCartItem[];
  customer: CustomerInfo;
  total: number;
  pickupTime: string;
}

/**
 * Email template sent to the customer after placing an order
 */
export function customerConfirmationEmail(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe3; font-family: sans-serif; font-size: 14px; color: #2c1810;">
          ${item.name}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe3; font-family: sans-serif; font-size: 14px; color: #2c1810; text-align: center;">
          ${item.quantity}x
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe3; font-family: sans-serif; font-size: 14px; color: #2c1810; text-align: right;">
          &euro;${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #faf8f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background-color: #2c1810; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-family: serif; font-size: 28px; color: #ffffff; letter-spacing: 1px;">
                Wake N' Bake
              </h1>
              <p style="margin: 4px 0 0; font-family: sans-serif; font-size: 13px; color: #d4a574; text-transform: uppercase; letter-spacing: 2px;">
                come taste the difference
              </p>
            </td>
          </tr>

          <!-- Confirmation Message -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h2 style="margin: 0 0 8px; font-family: sans-serif; font-size: 22px; color: #2c1810;">
                Bedankt voor je bestelling!
              </h2>
              <p style="margin: 0; font-family: sans-serif; font-size: 15px; color: #6b5c50; line-height: 1.5;">
                Hi ${data.customer.name}, je bestelling is ontvangen en wordt voor je klaargemaakt.
              </p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 12px 20px;">
                    <span style="font-family: sans-serif; font-size: 12px; color: #6b5c50; text-transform: uppercase; letter-spacing: 1px;">Bestelnummer</span><br>
                    <span style="font-family: sans-serif; font-size: 18px; font-weight: bold; color: #2c1810;">${data.orderId}</span>
                  </td>
                  <td style="padding: 12px 20px; text-align: right;">
                    <span style="font-family: sans-serif; font-size: 12px; color: #6b5c50; text-transform: uppercase; letter-spacing: 1px;">Ophaaltijd</span><br>
                    <span style="font-family: sans-serif; font-size: 18px; font-weight: bold; color: #c0392b;">${data.pickupTime}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <h3 style="margin: 0 0 12px; font-family: sans-serif; font-size: 14px; color: #6b5c50; text-transform: uppercase; letter-spacing: 1px;">
                Je bestelling
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <th style="padding: 8px 0; border-bottom: 2px solid #2c1810; font-family: sans-serif; font-size: 12px; color: #6b5c50; text-align: left; text-transform: uppercase;">Product</th>
                  <th style="padding: 8px 0; border-bottom: 2px solid #2c1810; font-family: sans-serif; font-size: 12px; color: #6b5c50; text-align: center; text-transform: uppercase;">Aantal</th>
                  <th style="padding: 8px 0; border-bottom: 2px solid #2c1810; font-family: sans-serif; font-size: 12px; color: #6b5c50; text-align: right; text-transform: uppercase;">Prijs</th>
                </tr>
                ${itemRows}
                <tr>
                  <td colspan="2" style="padding: 16px 0 0; font-family: sans-serif; font-size: 16px; font-weight: bold; color: #2c1810;">
                    Totaal
                  </td>
                  <td style="padding: 16px 0 0; font-family: sans-serif; font-size: 18px; font-weight: bold; color: #c0392b; text-align: right;">
                    &euro;${data.total.toFixed(2)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pickup Info -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdf2e9; border-radius: 8px; border-left: 4px solid #d4a574;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px; font-family: sans-serif; font-size: 13px; font-weight: bold; color: #2c1810;">
                      Afhaallocatie
                    </p>
                    <p style="margin: 0; font-family: sans-serif; font-size: 14px; color: #6b5c50;">
                      Wake N' Bake Panificio<br>
                      Vijzelstraat 93h, Amsterdam
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #2c1810; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; font-family: sans-serif; font-size: 13px; color: #d4a574;">
                Toon dit als bewijs bij het ophalen van je bestelling.
              </p>
              <p style="margin: 8px 0 0; font-family: sans-serif; font-size: 12px; color: #8b7355;">
                Wake N' Bake Panificio &bull; Vijzelstraat 93h &bull; Amsterdam
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Email template sent to Wake N' Bake when a new order comes in
 */
export function storeNotificationEmail(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; text-align: center;">
          ${item.quantity}x
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; text-align: right;">
          &euro;${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color: #c0392b; padding: 20px 30px;">
              <h1 style="margin: 0; font-family: sans-serif; font-size: 20px; color: #ffffff;">
                NIEUWE BESTELLING
              </h1>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px; color: #666;">Bestelnummer:</td>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px; font-weight: bold;">${data.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px; color: #666;">Ophaaltijd:</td>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 16px; font-weight: bold; color: #c0392b;">${data.pickupTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px; color: #666;">Klant:</td>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px;">${data.customer.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px; color: #666;">Telefoon:</td>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px;">
                    <a href="tel:${data.customer.phone}" style="color: #2c1810;">${data.customer.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px; color: #666;">Email:</td>
                  <td style="padding: 8px 0; font-family: sans-serif; font-size: 14px;">
                    <a href="mailto:${data.customer.email}" style="color: #2c1810;">${data.customer.email}</a>
                  </td>
                </tr>
              </table>

              <!-- Items -->
              <h3 style="margin: 0 0 12px; font-family: sans-serif; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #333; padding-bottom: 8px;">
                Bestelling
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                <tr>
                  <td colspan="2" style="padding: 16px 12px 0; font-family: sans-serif; font-size: 16px; font-weight: bold;">
                    TOTAAL
                  </td>
                  <td style="padding: 16px 12px 0; font-family: sans-serif; font-size: 18px; font-weight: bold; color: #c0392b; text-align: right;">
                    &euro;${data.total.toFixed(2)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
