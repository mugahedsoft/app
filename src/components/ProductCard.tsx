import { Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, notes: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleAdd = () => {
    if (quantity > 0) {
      onAddToCart(product, quantity, notes);
      setQuantity(1);
      setNotes('');
      setShowNotes(false);
    }
  };

  return (
    <div className="bg-smoke-950/35 backdrop-blur-xl border border-fire-500/15 rounded-2xl shadow-glow-fire p-5 hover:shadow-glow-fire-lg transition-shadow">
      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
      <p className="text-white/70 text-sm mb-3">{product.description}</p>

      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold text-fire-400">{product.price} ج</span>

        <div className="flex items-center gap-3 bg-smoke-950/45 border border-fire-500/15 rounded-xl p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center bg-smoke-900/40 text-white rounded-lg hover:bg-smoke-850/55 transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
          >
            <Minus size={18} />
          </button>
          <span className="w-8 text-center font-bold text-lg text-white">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-smoke-900/40 text-white rounded-lg hover:bg-smoke-850/55 transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {showNotes && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ملاحظات إضافية (اختياري)"
          className="w-full p-3 bg-smoke-950/45 border border-fire-500/15 rounded-xl mb-3 text-right resize-none text-white placeholder:text-white/40 outline-none focus:border-fire-400 focus:ring-2 focus:ring-fire-500/30"
          rows={2}
        />
      )}

      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="flex-1 bg-gradient-to-r from-fire-700 via-fire-600 to-fire-500 text-white py-3 rounded-xl font-bold shadow-glow-fire hover:shadow-glow-fire-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-fire-500/40"
        >
          إضافة للسلة
        </button>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="px-4 py-3 bg-smoke-900/35 text-white/90 border border-fire-500/15 rounded-xl hover:border-fire-400/50 hover:bg-smoke-850/45 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-fire-500/40"
        >
          {showNotes ? 'إخفاء' : 'ملاحظات'}
        </button>
      </div>
    </div>
  );
}
