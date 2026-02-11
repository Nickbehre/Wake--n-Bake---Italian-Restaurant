'use client';

import { useOrderStore } from '@/lib/store/order-store';

interface CartSummaryProps {
  showLineItems?: boolean;
}

export default function CartSummary({ showLineItems = true }: CartSummaryProps) {
  const getCartSummary = useOrderStore((state) => state.getCartSummary);
  const summary = getCartSummary();

  if (summary.itemCount === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="font-lato text-espresso/60">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-espresso text-white p-4">
        <h3 className="font-oswald text-xl font-bold uppercase tracking-wide">
          Order Summary
        </h3>
      </div>

      <div className="p-6">
        {/* Line Items */}
        {showLineItems && (
          <div className="space-y-4 mb-6">
            {summary.lineItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start pb-4 border-b border-espresso/10 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-montserrat font-semibold text-espresso">
                    {item.productName}
                  </p>
                  <p className="font-lato text-sm text-espresso/60">
                    {item.quantity}x €{item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <span className="font-oswald font-bold text-espresso">
                  €{item.lineTotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        <div className="space-y-3 pt-4 border-t border-espresso/10">
          <div className="flex justify-between text-sm">
            <span className="font-lato text-espresso/70">
              Subtotal ({summary.itemCount} items)
            </span>
            <span className="font-oswald text-espresso">
              €{summary.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-espresso/10">
            <span className="font-oswald text-xl font-bold text-espresso uppercase">
              Total
            </span>
            <span className="font-oswald text-2xl font-bold text-crust">
              €{summary.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
