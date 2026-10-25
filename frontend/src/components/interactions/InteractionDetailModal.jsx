import { FiX } from "react-icons/fi";
import { useEffect, useRef } from "react";
import Button from "../common/Button/Button";
import Badge from "../common/Badge/Badge";

function InteractionDetailModal({ interaction, customer, onClose, onViewCustomer }) {
  const closeButton = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    closeButton.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="interaction-detail-title" className="fixed inset-0 z-2000 flex items-center justify-center bg-slate-900/70 p-4" onClick={onClose}>
      <section className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface text-text-primary shadow-xl" onClick={(event) => event.stopPropagation()}>
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <p className="mb-2 text-xs text-text-secondary">{interaction.id} · {interaction.date} · {interaction.time}</p>
            <h2 id="interaction-detail-title" className="text-xl font-semibold">{interaction.subject}</h2>
          </div>
          <button ref={closeButton} type="button" aria-label="Close" className="shrink-0 rounded-lg p-2 text-text-secondary hover:bg-surface-hover" onClick={onClose}><FiX size={20} /></button>
        </header>
        <div className="min-h-0 space-y-5 overflow-y-auto p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-text-secondary">Customer</p>
              <p className="mt-1 font-medium">
                {customer?.name || interaction.customerName || "Customer"}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {customer?.phone || interaction.customerPhone}
              </p>
            </div>
            <Badge variant="info">{interaction.channel}</Badge>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Discussion notes</h3>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-secondary">
              {interaction.notes}
            </p>
          </div>
          <p className="border-t border-border pt-4 text-sm text-text-secondary">Logged by <strong className="font-medium text-text-primary">{interaction.staff}</strong></p>
        </div>
        <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {customer && <Button onClick={onViewCustomer}>View Customer →</Button>}
        </footer>
      </section>
    </div>
  );
}

export default InteractionDetailModal;
