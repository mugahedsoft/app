import { useMemo, useState } from 'react';
import {
 defaultMenuData,
 loadMenuData,
 resetMenuData,
 saveMenuData,
 type MenuData,
} from '../../utils/menuStorage';

type CategoryKey = keyof MenuData;

const categoryLabels: Record<CategoryKey, string> = {
 fatayerShami: 'فطائر شامي',
 fatayerSweet: 'فطائر حلوة',
 broast: 'البروست',
 sandwiches: 'السندويتشات',
 pizzas: 'البيتزا',
 juices: 'العصائر',
};

function FieldLabel({ children }: { children: string }) {
 return <div className="text-white/80 text-sm font-bold mb-2">{children}</div>;
}

function TextInput({
 value,
 onChange,
 placeholder,
}: {
 value: string;
 onChange: (v: string) => void;
 placeholder?: string;
}) {
 return (
  <input
   value={value}
   onChange={(e) => onChange(e.target.value)}
   placeholder={placeholder}
   className="w-full p-3 bg-smoke-950/40 border border-fire-500/15 rounded-2xl text-right text-white placeholder:text-white/35 outline-none focus:border-fire-400 focus:ring-2 focus:ring-fire-500/30"
  />
 );
}

function NumberInput({
 value,
 onChange,
 placeholder,
}: {
 value: number;
 onChange: (v: number) => void;
 placeholder?: string;
}) {
 return (
  <input
   value={Number.isFinite(value) ? String(value) : ''}
   onChange={(e) => {
    const next = e.target.value.trim();
    onChange(next ? Number(next) : 0);
   }}
   placeholder={placeholder}
   inputMode="numeric"
   className="w-full p-3 bg-smoke-950/40 border border-fire-500/15 rounded-2xl text-right text-white placeholder:text-white/35 outline-none focus:border-fire-400 focus:ring-2 focus:ring-fire-500/30"
  />
 );
}

export function AdminApp() {
 const [unlocked, setUnlocked] = useState(false);
 const [pin, setPin] = useState('');
 const [pinError, setPinError] = useState<string | null>(null);

 const initial = useMemo(() => loadMenuData(), []);
 const [data, setData] = useState<MenuData>(initial);
 const [activeCategory, setActiveCategory] = useState<CategoryKey>('fatayerShami');

 const [saveError, setSaveError] = useState<string | null>(null);
 const [saveOk, setSaveOk] = useState<string | null>(null);

 const handleUnlock = () => {
  if (pin.trim() !== '2001') {
   setPinError('رمز الحماية غير صحيح');
   return;
  }
  setPinError(null);
  setUnlocked(true);
 };

 const handleSave = () => {
  setSaveError(null);
  setSaveOk(null);

  try {
   saveMenuData(data);
   setSaveOk('تم الحفظ بنجاح');
  } catch (e) {
   setSaveError('تعذر الحفظ');
  }
 };

 const handleReset = () => {
  resetMenuData();
  const d = defaultMenuData;
  setData(d);
  setSaveOk('تمت إعادة الضبط إلى المنيو الافتراضي');
 };

 const updateLine = (
  key: CategoryKey,
  index: number,
  updater: (prev: MenuData[CategoryKey][number]) => MenuData[CategoryKey][number]
 ) => {
  setData((prev) => {
   const list = prev[key];
   const next = [...list];
   if (!next[index]) return prev;
   next[index] = updater(next[index]);
   return { ...prev, [key]: next } as MenuData;
  });
 };

 const deleteLine = (key: CategoryKey, index: number) => {
  setData((prev) => {
   const list = prev[key];
   return { ...prev, [key]: list.filter((_, i) => i !== index) } as MenuData;
  });
 };

 const addLine = (key: CategoryKey) => {
  setData((prev) => {
   const list = prev[key];
   const next = [...list];

   if (key === 'sandwiches') {
    next.push({ name: 'جديد', regular: 0, jumbo: 0 } as MenuData[CategoryKey][number]);
   } else if (key === 'pizzas') {
    next.push({ name: 'جديد', small: 0, medium: 0, large: 0 } as MenuData[CategoryKey][number]);
   } else {
    next.push({ name: 'جديد', price: 0 } as MenuData[CategoryKey][number]);
   }

   return { ...prev, [key]: next } as MenuData;
  });
 };

 if (!unlocked) {
  return (
   <div className="min-h-screen app-bg">
    <div className="container mx-auto px-4 py-10">
     <div className="surface-strong rounded-3xl p-8 max-w-xl mx-auto">
      <div className="text-white font-black text-2xl mb-2">لوحة الإدارة</div>
      <div className="text-white/70 mb-6">أدخل رمز الحماية للدخول</div>
      <input
       value={pin}
       onChange={(e) => setPin(e.target.value)}
       placeholder="رمز الحماية"
       className="input-base"
       inputMode="numeric"
      />
      {pinError && <div className="text-red-200 mt-3 font-bold">{pinError}</div>}
      <button className="btn-primary mt-4" onClick={handleUnlock}>
       دخول
      </button>
      <div className="text-white/55 text-xs mt-4">
       هذه الصفحة غير مرتبطة من الموقع الرئيسي.
      </div>
     </div>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen app-bg">
   <header className="sticky top-0 z-40 bg-smoke-950/40 backdrop-blur-xl border-b border-fire-500/15 shadow-glow-fire">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
     <div>
      <div className="text-white font-black text-xl">إدارة المنتجات</div>
      <div className="text-white/60 text-sm">الحفظ يتم داخل الجهاز (localStorage)</div>
     </div>
     <div className="flex items-center gap-3">
      <button className="btn-secondary px-5" onClick={handleReset}>
       إعادة ضبط
      </button>
      <button className="btn-primary px-6" onClick={handleSave}>
       حفظ
      </button>
     </div>
    </div>
   </header>

   <div className="container mx-auto px-4 py-6 space-y-6">
    {saveError && <div className="surface-strong rounded-2xl p-4 text-red-200 font-bold">{saveError}</div>}
    {saveOk && <div className="surface-strong rounded-2xl p-4 text-emerald-200 font-bold">{saveOk}</div>}

    <div className="surface rounded-3xl p-4">
     <div className="flex flex-wrap gap-2">
      {(Object.keys(categoryLabels) as CategoryKey[]).map((k) => (
       <button
        key={k}
        className={`chip ${activeCategory === k ? 'chip-active' : 'chip-idle'}`}
        onClick={() => setActiveCategory(k)}
       >
        {categoryLabels[k]}
       </button>
      ))}
     </div>
    </div>

    <div className="surface-strong rounded-3xl p-6">
     <div className="flex items-center justify-between gap-4 mb-4">
      <div className="text-white font-black text-xl">{categoryLabels[activeCategory]}</div>
      <button className="btn-secondary px-5" onClick={() => addLine(activeCategory)}>
       إضافة عنصر
      </button>
     </div>

     <div className="space-y-4">
      {data[activeCategory].map((row, index) => {
       if (activeCategory === 'sandwiches') {
        const r = row as MenuData['sandwiches'][number];
        return (
         <div key={`row-${index}`} className="surface rounded-3xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
           <div className="md:col-span-2">
            <FieldLabel>الاسم</FieldLabel>
            <TextInput
             value={r.name}
             onChange={(v) => updateLine('sandwiches', index, (p) => ({ ...(p as typeof r), name: v }))}
            />
           </div>
           <div>
            <FieldLabel>عادي</FieldLabel>
            <NumberInput
             value={r.regular}
             onChange={(v) => updateLine('sandwiches', index, (p) => ({ ...(p as typeof r), regular: v }))}
            />
           </div>
           <div>
            <FieldLabel>جامبو</FieldLabel>
            <NumberInput
             value={r.jumbo}
             onChange={(v) => updateLine('sandwiches', index, (p) => ({ ...(p as typeof r), jumbo: v }))}
            />
           </div>
          </div>
          <div className="mt-4 flex justify-end">
           <button className="btn-secondary px-5" onClick={() => deleteLine('sandwiches', index)}>
            حذف
           </button>
          </div>
         </div>
        );
       }

       if (activeCategory === 'pizzas') {
        const r = row as MenuData['pizzas'][number];
        return (
         <div key={`row-${index}`} className="surface rounded-3xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
           <div className="md:col-span-2">
            <FieldLabel>الاسم</FieldLabel>
            <TextInput
             value={r.name}
             onChange={(v) => updateLine('pizzas', index, (p) => ({ ...(p as typeof r), name: v }))}
            />
           </div>
           <div>
            <FieldLabel>صغيرة</FieldLabel>
            <NumberInput
             value={r.small}
             onChange={(v) => updateLine('pizzas', index, (p) => ({ ...(p as typeof r), small: v }))}
            />
           </div>
           <div>
            <FieldLabel>وسط</FieldLabel>
            <NumberInput
             value={r.medium}
             onChange={(v) => updateLine('pizzas', index, (p) => ({ ...(p as typeof r), medium: v }))}
            />
           </div>
           <div>
            <FieldLabel>كبيرة</FieldLabel>
            <NumberInput
             value={r.large}
             onChange={(v) => updateLine('pizzas', index, (p) => ({ ...(p as typeof r), large: v }))}
            />
           </div>
          </div>
          <div className="mt-4 flex justify-end">
           <button className="btn-secondary px-5" onClick={() => deleteLine('pizzas', index)}>
            حذف
           </button>
          </div>
         </div>
        );
       }

       const r = row as MenuData['fatayerShami'][number];
       const key = activeCategory as Exclude<CategoryKey, 'sandwiches' | 'pizzas'>;
       return (
        <div key={`row-${index}`} className="surface rounded-3xl p-5">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
           <FieldLabel>الاسم</FieldLabel>
           <TextInput
            value={r.name}
            onChange={(v) => updateLine(key, index, (p) => ({ ...(p as typeof r), name: v }))}
           />
          </div>
          <div>
           <FieldLabel>السعر</FieldLabel>
           <NumberInput
            value={r.price}
            onChange={(v) => updateLine(key, index, (p) => ({ ...(p as typeof r), price: v }))}
           />
          </div>
         </div>
         <div className="mt-4 flex justify-end">
          <button className="btn-secondary px-5" onClick={() => deleteLine(key, index)}>
           حذف
          </button>
         </div>
        </div>
       );
      })}
     </div>
    </div>
   </div>
  </div>
 );
}
