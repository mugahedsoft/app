import { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Pizza } from 'lucide-react';
import { CartView } from './components/CartView';
import { CustomerForm } from './components/CustomerForm';
import { storage } from './utils/storage';
import { loadMenuData } from './utils/menuStorage';
import { generateWhatsAppMessage, sendToWhatsApp } from './utils/whatsapp';
import { CartItem, Product, CustomerInfo } from './types';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartPulse, setCartPulse] = useState(false);

  useEffect(() => {
    setCart(storage.getCart());
  }, []);

  useEffect(() => {
    storage.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    if (!cartPulse) return;
    const t = window.setTimeout(() => setCartPulse(false), 350);
    return () => window.clearTimeout(t);
  }, [cartPulse]);

  const handleAddToCart = (product: Product, quantity: number, notes: string) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      if (notes) {
        newCart[existingIndex].notes = notes;
      }
      setCart(newCart);
    } else {
      setCart([...cart, { product, quantity, notes }]);
    }

    setCartPulse(true);
  };

  const addQuickItem = (name: string, price: number, category: string) => {
    handleAddToCart(
      {
        id: `${category}:${name}:${price}`,
        name,
        description: '',
        price,
        category,
      },
      1,
      ''
    );
  };

  const matchesSearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return () => true;
    return (value: string) => value.toLowerCase().includes(q);
  }, [searchQuery]);

  const menuData = useMemo(() => loadMenuData(), []);

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    setCart(prev => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], quantity: Math.max(1, quantity) };
      return next;
    });
  };

  const handleClearCart = () => {
    storage.clearCart();
    setCart([]);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCustomerForm(true);
  };

  const handleSubmitOrder = (customer: CustomerInfo) => {
    storage.saveCustomer(customer);

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const message = generateWhatsAppMessage(cart, customer, total);

    sendToWhatsApp(message);

    storage.clearCart();
    setCart([]);
    setShowCustomerForm(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen app-bg">
      <header className="sticky top-0 z-40 bg-smoke-950/40 backdrop-blur-xl border-b border-fire-500/15 shadow-glow-fire">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">

              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2 font-display">
                  <span>بيتزتي</span>
                  <span className="accent-dot" aria-hidden="true" />
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowCart(true)}
              className={`relative bg-smoke-900/45 text-fire-400 p-3 rounded-full border border-fire-500/25 hover:border-fire-400/60 hover:bg-smoke-850/50 transition-colors shadow-glow-fire focus:outline-none focus:ring-2 focus:ring-fire-500/40 ${cartPulse ? 'scale-105' : ''}`}
            >
              <ShoppingCart size={28} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-fire-700 via-fire-600 to-fire-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-glow-fire">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <section className="mb-7">
          <div className="surface rounded-3xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2 font-display">
                  <span>المنيو</span>
                  <span className="accent-dot" aria-hidden="true" />
                </h2>
                <p className="text-white/70 mt-2">اختر الصنف واضغط على السعر لإضافته إلى السلة.</p>
              </div>
              <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-smoke-950/40 border border-fire-500/10">
                <Pizza className="text-fire-400" />
              </div>
            </div>

            <div className="mt-5">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المنيو..."
                className="input-base"
              />
            </div>
          </div>
        </section>

        <div className="menu-board grid-cols-1 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="menu-panel">
              <div className="text-center mb-4">
                <span className="menu-title">الفطائر</span>
              </div>
              {menuData.fatayerShami.filter(i => matchesSearch(i.name)).map((item) => (
                <div key={`fatayer-shami-${item.name}`} className="menu-row">
                  <span className="menu-name">فطائر شامية {item.name}</span>
                  <button
                    className="price-pill"
                    onClick={() => addQuickItem(`فطائر شامية ${item.name}`, item.price, 'فطائر')}
                  >
                    {item.price.toLocaleString('en-US')}
                  </button>
                </div>
              ))}

              <div className="h-px bg-white/35 my-4" />
              <div className="text-center mb-3">
                <span className="menu-title">فطائر حلوه</span>
              </div>
              {menuData.fatayerSweet.filter(i => matchesSearch(i.name)).map((item) => (
                <div key={`fatayer-sweet-${item.name}`} className="menu-row">
                  <span className="menu-name">{item.name}</span>
                  <button
                    className="price-pill"
                    onClick={() => addQuickItem(`فطائر حلوة ${item.name}`, item.price, 'فطائر')}
                  >
                    {item.price.toLocaleString('en-US')}
                  </button>
                </div>
              ))}
            </div>

            <div className="menu-panel">
              <div className="text-center mb-4">
                <span className="menu-title">البروست</span>
              </div>
              {menuData.broast.filter(i => matchesSearch(i.name)).map((item) => (
                <div key={`broast-${item.name}`} className="menu-row">
                  <span className="menu-name">{item.name}</span>
                  <button
                    className="price-pill"
                    onClick={() => addQuickItem(`بروست ${item.name}`, item.price, 'بروست')}
                  >
                    {item.price.toLocaleString('en-US')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="menu-panel">
              <div className="text-center mb-4">
                <span className="menu-title">السندويتشات</span>
              </div>

              <div className="menu-head">
                <span className="w-1/3" />
                <span className="w-1/3 text-center">عادي</span>
                <span className="w-1/3 text-center">جامبو</span>
              </div>

              {menuData.sandwiches.filter(i => matchesSearch(i.name)).map((item) => (
                <div key={`sand-${item.name}`} className="flex items-center justify-between gap-3 py-2">
                  <span className="menu-name w-1/3">{item.name}</span>
                  <div className="w-1/3 text-center">
                    <button
                      className="price-pill"
                      onClick={() => addQuickItem(`سندويتش ${item.name} عادي`, item.regular, 'سندويتشات')}
                    >
                      {item.regular.toLocaleString('en-US')}
                    </button>
                  </div>
                  <div className="w-1/3 text-center">
                    <button
                      className="price-pill"
                      onClick={() => addQuickItem(`سندويتش ${item.name} جامبو`, item.jumbo, 'سندويتشات')}
                    >
                      {item.jumbo.toLocaleString('en-US')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="menu-panel">
              <div className="text-center mb-4">
                <span className="menu-title">البيتزا</span>
              </div>

              <div className="menu-head">
                <span className="w-1/4" />
                <span className="w-1/4 text-center">صغيره</span>
                <span className="w-1/4 text-center">وسط</span>
                <span className="w-1/4 text-center">كبيره</span>
              </div>

              {menuData.pizzas.filter(i => matchesSearch(i.name)).map((item) => (
                <div key={`pizza-${item.name}`} className="flex items-center justify-between gap-3 py-2">
                  <span className="menu-name w-1/4">{item.name}</span>
                  <div className="w-1/4 text-center">
                    <button
                      className="price-pill"
                      onClick={() => addQuickItem(`بيتزا ${item.name} صغيرة`, item.small, 'بيتزا')}
                    >
                      {item.small.toLocaleString('en-US')}
                    </button>
                  </div>
                  <div className="w-1/4 text-center">
                    <button
                      className="price-pill"
                      onClick={() => addQuickItem(`بيتزا ${item.name} وسط`, item.medium, 'بيتزا')}
                    >
                      {item.medium.toLocaleString('en-US')}
                    </button>
                  </div>
                  <div className="w-1/4 text-center">
                    <button
                      className="price-pill"
                      onClick={() => addQuickItem(`بيتزا ${item.name} كبيرة`, item.large, 'بيتزا')}
                    >
                      {item.large.toLocaleString('en-US')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="menu-panel">
              <div className="text-center mb-4">
                <span className="menu-title">العصائر</span>
              </div>

              {menuData.juices.filter(i => matchesSearch(i.name)).map((item) => (
                <div key={`juice-${item.name}`} className="menu-row">
                  <span className="menu-name">{item.name}</span>
                  <button
                    className="price-pill"
                    onClick={() => addQuickItem(`عصير ${item.name}`, item.price, 'عصائر')}
                  >
                    {item.price.toLocaleString('en-US')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="mt-6 text-center text-white/55 text-sm">
            للعودة لعرض كل الأصناف، امسح البحث.
          </div>
        )}
      </div>

      {showCart && (
        <CartView
          items={cart}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onClear={handleClearCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}

      {showCustomerForm && (
        <CustomerForm
          onSubmit={handleSubmitOrder}
          onClose={() => setShowCustomerForm(false)}
          initialData={storage.getCustomer()}
        />
      )}
    </div>
  );
}

export default App;
