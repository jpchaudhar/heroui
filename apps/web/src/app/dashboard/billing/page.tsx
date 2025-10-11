"use client";
import { startCheckout, openPortal } from "./actions";

export default function BillingPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Billing</h2>
      <div className="flex gap-3">
        <button
          className="rounded bg-black text-white px-4 py-2"
          onClick={async () => {
            const url = await startCheckout("pro");
            window.location.href = url;
          }}
        >
          Subscribe Pro ($29/mo)
        </button>
        <button
          className="rounded border px-4 py-2"
          onClick={async () => {
            const url = await startCheckout("firm");
            window.location.href = url;
          }}
        >
          Subscribe Firm ($99/mo)
        </button>
        <button
          className="rounded border px-4 py-2"
          onClick={async () => {
            const url = await openPortal();
            window.location.href = url;
          }}
        >
          Manage Subscription
        </button>
      </div>
    </div>
  );
}
