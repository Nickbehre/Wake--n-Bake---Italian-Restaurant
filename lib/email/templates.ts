import type { OrderCartItem, CustomerInfo } from '@/lib/types/order';

interface OrderItemExtra {
  id?: string;
  name: string;
  price: number;
}

type OrderEmailItem = OrderCartItem & { extras?: OrderItemExtra[] };

export interface OrderEmailData {
  orderId: string;
  items: OrderEmailItem[];
  customer: CustomerInfo;
  total: number;
  pickupTime: string;
}

// Brand palette — mirrors tailwind.config.ts
const FLOUR = '#F9F7F2';
const ESPRESSO = '#2C2C2C';
const TOMATO = '#CE2029';
const CRUST = '#D4A056';
const INK_SOFT = '#6b6b6b';

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Lato', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wakenbake.nl';

// Real webfonts where supported (Apple Mail/iOS); Gmail/Outlook fall back to the stacks above.
const FONT_IMPORT = `<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,700&family=Lato:wght@400;700&display=swap');
  </style>`;

const ADDRESS_LINE = "Wake N' Bake Panificio &bull; Vijzelstraat 93H &bull; 1017 HH Amsterdam";

function euro(amount: number): string {
  return `&euro;${amount.toFixed(2)}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


function brandHeader(): string {
  return `
          <tr>
            <td style="background-color: ${ESPRESSO}; border-radius: 16px 16px 0 0; padding: 32px 40px 28px; text-align: center;">
              <img src="${SITE_URL}/assets/logo.png" width="132" height="132" alt="Wake n' Bake" style="display: block; margin: 0 auto; border: 0; font-family: ${SERIF}; font-size: 28px; color: ${FLOUR};">
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin: 14px auto 0;">
                <tr>
                  <td style="width: 32px; border-top: 2px solid ${CRUST}; font-size: 0; line-height: 0;">&nbsp;</td>
                  <td style="padding: 0 12px; font-family: ${SANS}; font-size: 11px; color: ${CRUST}; text-transform: uppercase; letter-spacing: 3px; white-space: nowrap;">
                    Come Taste The Difference
                  </td>
                  <td style="width: 32px; border-top: 2px solid ${CRUST}; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function brandFooter(note: string): string {
  return `
          <tr>
            <td style="background-color: ${ESPRESSO}; border-radius: 0 0 16px 16px; padding: 26px 40px; text-align: center;">
              <p style="margin: 0; font-family: ${SANS}; font-size: 13px; color: ${FLOUR}; line-height: 1.5;">
                ${note}
              </p>
              <p style="margin: 12px 0 0; font-family: ${SANS}; font-size: 11px; color: ${CRUST}; letter-spacing: 0.5px;">
                ${ADDRESS_LINE}
              </p>
            </td>
          </tr>`;
}

function itemRows(items: OrderEmailItem[]): string {
  return items
    .map((item) => {
      const extras = (item.extras ?? [])
        .map(
          (extra) => `
                <tr>
                  <td colspan="2" style="padding: 2px 0 2px 26px; font-family: ${SANS}; font-size: 13px; color: ${INK_SOFT};">
                    + ${escapeHtml(extra.name)}
                  </td>
                  <td style="padding: 2px 0; font-family: ${SANS}; font-size: 13px; color: ${INK_SOFT}; text-align: right;">
                    ${euro(extra.price * item.quantity)}
                  </td>
                </tr>`
        )
        .join('');

      return `
                <tr>
                  <td style="padding: 12px 8px 12px 0; font-family: ${SANS}; font-size: 14px; font-weight: bold; color: ${TOMATO}; white-space: nowrap; vertical-align: top; width: 34px;">
                    ${item.quantity}&times;
                  </td>
                  <td style="padding: 12px 8px 12px 0; font-family: ${SANS}; font-size: 15px; color: ${ESPRESSO}; vertical-align: top;">
                    ${escapeHtml(item.name)}${item.size === 'large' ? ` <span style="font-size: 12px; color: ${INK_SOFT};">(groot)</span>` : ''}
                  </td>
                  <td style="padding: 12px 0; font-family: ${SANS}; font-size: 15px; color: ${ESPRESSO}; text-align: right; vertical-align: top; white-space: nowrap;">
                    ${euro(item.price * item.quantity)}
                  </td>
                </tr>${extras}
                <tr>
                  <td colspan="3" style="border-bottom: 1px solid #eee8dc; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>`;
    })
    .join('');
}

/**
 * Email template sent to the customer after placing an order
 */
export function customerConfirmationEmail(data: OrderEmailData): string {
  const name = escapeHtml(data.customer.name);

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${FONT_IMPORT}
  <title>Orderbevestiging - Wake 'n Bake</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${FLOUR};">
  <div style="display: none; max-height: 0; overflow: hidden;">Grazie ${name}! Je bestelling is bevestigd &mdash; ophalen om ${escapeHtml(data.pickupTime)}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${FLOUR};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
${brandHeader()}

          <!-- Body card -->
          <tr>
            <td style="background-color: #ffffff; padding: 36px 40px 8px;">
              <h2 style="margin: 0 0 10px; font-family: ${SERIF}; font-size: 26px; color: ${ESPRESSO};">
                Grazie, ${name}!
              </h2>
              <p style="margin: 0; font-family: ${SANS}; font-size: 15px; color: ${INK_SOFT}; line-height: 1.6;">
                Je bestelling is ontvangen en wordt met liefde voor je klaargemaakt.
                Hieronder vind je alle details.
              </p>
            </td>
          </tr>

          <!-- Pickup card -->
          <tr>
            <td style="background-color: #ffffff; padding: 24px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid ${CRUST}; border-radius: 12px; background-color: ${FLOUR};">
                <tr>
                  <td style="padding: 20px 24px; text-align: center;">
                    <p style="margin: 0 0 4px; font-family: ${SANS}; font-size: 11px; color: ${INK_SOFT}; text-transform: uppercase; letter-spacing: 2px;">
                      Ophaaltijd
                    </p>
                    <p style="margin: 0; font-family: ${SERIF}; font-size: 26px; font-weight: bold; color: ${TOMATO};">
                      ${escapeHtml(data.pickupTime)}
                    </p>
                    <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin: 14px auto 0;">
                      <tr>
                        <td style="background-color: ${ESPRESSO}; border-radius: 999px; padding: 6px 16px; font-family: ${SANS}; font-size: 12px; color: ${FLOUR}; letter-spacing: 1px;">
                          Bestelnummer&nbsp;&nbsp;<span style="color: ${CRUST}; font-weight: bold;">${escapeHtml(data.orderId)}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background-color: #ffffff; padding: 28px 40px 4px;">
              <p style="margin: 0 0 6px; font-family: ${SANS}; font-size: 11px; color: ${INK_SOFT}; text-transform: uppercase; letter-spacing: 2px;">
                Je bestelling
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid ${CRUST};">
${itemRows(data.items)}
                <tr>
                  <td colspan="2" style="padding: 18px 0 4px; font-family: ${SERIF}; font-size: 18px; font-weight: bold; color: ${ESPRESSO};">
                    Totaal
                  </td>
                  <td style="padding: 18px 0 4px; font-family: ${SERIF}; font-size: 22px; font-weight: bold; color: ${TOMATO}; text-align: right; white-space: nowrap;">
                    ${euro(data.total)}
                  </td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 0 0 8px; font-family: ${SANS}; font-size: 12px; color: ${INK_SOFT}; text-align: right;">
                    incl. BTW &bull; betalen bij afhalen
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Location -->
          <tr>
            <td style="background-color: #ffffff; padding: 16px 40px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${FLOUR}; border-left: 4px solid ${TOMATO}; border-radius: 0 10px 10px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px; font-family: ${SANS}; font-size: 13px; font-weight: bold; color: ${ESPRESSO};">
                      Afhaallocatie
                    </p>
                    <p style="margin: 0; font-family: ${SANS}; font-size: 14px; color: ${INK_SOFT}; line-height: 1.5;">
                      Wake N' Bake Panificio<br>
                      Vijzelstraat 93H, 1017 HH Amsterdam
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

${brandFooter('Toon deze email aan onze medewerkers bij het ophalen van je bestelling.')}

          <tr>
            <td style="padding: 18px 10px 0; text-align: center; font-family: ${SANS}; font-size: 11px; color: #b3ab9d;">
              Vragen over je bestelling? Antwoord op deze email of bel ons in de winkel.
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
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${FONT_IMPORT}
  <title>Nieuwe bestelling - Wake 'n Bake</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${FLOUR};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${FLOUR};">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="background-color: ${TOMATO}; border-radius: 14px 14px 0 0; padding: 22px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: ${SANS}; font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: 1px;">
                    NIEUWE BESTELLING
                  </td>
                  <td style="font-family: ${SANS}; font-size: 14px; color: #ffffff; text-align: right;">
                    ${escapeHtml(data.orderId)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pickup banner -->
          <tr>
            <td style="background-color: ${ESPRESSO}; padding: 14px 32px; text-align: center;">
              <span style="font-family: ${SANS}; font-size: 12px; color: ${CRUST}; text-transform: uppercase; letter-spacing: 2px;">Ophalen</span>
              <span style="font-family: ${SANS}; font-size: 20px; font-weight: bold; color: ${FLOUR}; padding-left: 12px;">${escapeHtml(data.pickupTime)}</span>
            </td>
          </tr>

          <!-- Customer -->
          <tr>
            <td style="background-color: #ffffff; padding: 24px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; font-family: ${SANS}; font-size: 13px; color: ${INK_SOFT}; width: 110px;">Klant</td>
                  <td style="padding: 6px 0; font-family: ${SANS}; font-size: 15px; font-weight: bold; color: ${ESPRESSO};">${escapeHtml(data.customer.name)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-family: ${SANS}; font-size: 13px; color: ${INK_SOFT};">Telefoon</td>
                  <td style="padding: 6px 0; font-family: ${SANS}; font-size: 15px;">
                    <a href="tel:${escapeHtml(data.customer.phone)}" style="color: ${TOMATO}; text-decoration: none; font-weight: bold;">${escapeHtml(data.customer.phone)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-family: ${SANS}; font-size: 13px; color: ${INK_SOFT};">Email</td>
                  <td style="padding: 6px 0; font-family: ${SANS}; font-size: 15px;">
                    <a href="mailto:${escapeHtml(data.customer.email)}" style="color: ${ESPRESSO}; text-decoration: underline;">${escapeHtml(data.customer.email)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background-color: #ffffff; padding: 16px 32px 28px; border-radius: 0 0 14px 14px;">
              <p style="margin: 0 0 6px; font-family: ${SANS}; font-size: 11px; color: ${INK_SOFT}; text-transform: uppercase; letter-spacing: 2px;">
                Bestelling
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid ${CRUST};">
${itemRows(data.items)}
                <tr>
                  <td colspan="2" style="padding: 16px 0 0; font-family: ${SANS}; font-size: 16px; font-weight: bold; color: ${ESPRESSO};">
                    TOTAAL
                  </td>
                  <td style="padding: 16px 0 0; font-family: ${SANS}; font-size: 20px; font-weight: bold; color: ${TOMATO}; text-align: right; white-space: nowrap;">
                    ${euro(data.total)}
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
