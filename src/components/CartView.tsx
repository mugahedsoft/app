import { useEffect, useState } from 'react';
import { Minus, Plus, Trash2, X, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onClear: () => void;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartView({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClear,
  onClose,
  onCheckout,
}: CartViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setIsOpen(true), 10);
    return () => window.clearTimeout(t);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    window.setTimeout(onClose, 160);
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subtotal = total;

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-50">
        <button
          type="button"
          onClick={handleClose}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="إغلاق السلة"
        />

        <aside
          className={`absolute inset-y-0 left-0 w-full max-w-md bg-smoke-950/55 backdrop-blur-xl border-r border-fire-500/20 shadow-glow-fire transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-fire-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart size={22} className="text-fire-400" />
                <h2 className="text-xl font-bold text-white">سلة الطلبات</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white hover:bg-smoke-900/40 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
                aria-label="إغلاق"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="text-center py-16">
                <ShoppingCart size={64} className="mx-auto text-fire-400/70 mb-4" />
                <p className="text-white/70">السلة فارغة</p>
              </div>
            </div>

            <div className="p-5 border-t border-fire-500/10">
              <button
                onClick={handleClose}
                className="w-full bg-smoke-900/35 text-white/90 border border-fire-500/15 rounded-2xl py-3 font-bold hover:bg-smoke-850/45 transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
              >
                الرجوع للمنيو
              </button>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={handleClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-label="إغلاق السلة"
      />

      <aside
        className={`absolute inset-y-0 left-0 w-full max-w-md bg-smoke-950/55 backdrop-blur-xl border-r border-fire-500/20 shadow-glow-fire transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-fire-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart size={22} className="text-fire-400" />
              <h2 className="text-xl font-bold text-white">سلة الطلبات</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClear}
                className="px-3 py-2 bg-smoke-900/35 text-white/85 border border-fire-500/15 rounded-xl hover:bg-smoke-850/45 transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
              >
                تفريغ
              </button>
              <button
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white hover:bg-smoke-900/40 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
                aria-label="إغلاق"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-smoke-950/40 border border-fire-500/10 p-4 rounded-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white">{item.product.name}</h3>
                    {item.notes && (
                      <p className="text-white/60 text-sm mt-1">ملاحظات: {item.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-2 text-fire-300 hover:text-fire-200 hover:bg-fire-900/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
                    aria-label="حذف"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-smoke-950/45 border border-fire-500/15 rounded-2xl p-1">
                    <button
                      onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center bg-smoke-900/40 text-white rounded-xl hover:bg-smoke-850/55 transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
                      aria-label="إنقاص الكمية"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-10 text-center font-bold text-lg text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center bg-smoke-900/40 text-white rounded-xl hover:bg-smoke-850/55 transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
                      aria-label="زيادة الكمية"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <p className="text-fire-400 font-bold text-lg">
                    {item.product.price * item.quantity} ج
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-fire-500/10">
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-white/80">
                <span>المجموع</span>
                <span className="font-bold text-white">{subtotal} ج</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>التوصيل</span>
                <span className="font-bold text-white">0 ج</span>
              </div>
              <div className="h-px bg-fire-500/10" />
              <div className="flex items-center justify-between text-xl font-black">
                <span className="text-white">الإجمالي</span>
                <span className="text-fire-400">{total} ج</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-fire-700 via-fire-600 to-fire-500 text-white py-4 rounded-2xl font-bold text-lg shadow-glow-fire hover:shadow-glow-fire-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-fire-500/40"
            >
              متابعة الطلب
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
