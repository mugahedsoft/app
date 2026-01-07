import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CustomerInfo } from '../types';

interface CustomerFormProps {
  onSubmit: (customer: CustomerInfo) => void;
  onClose: () => void;
  initialData?: CustomerInfo | null;
}

export function CustomerForm({ onSubmit, onClose, initialData }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    orderType: 'delivery',
    area: '',
    deliveryNotes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const normalizePhone = (value: string) => value.replace(/[\s\-()]/g, '').replace(/^\+/, '');

  const validate = (data: CustomerInfo) => {
    const nextErrors: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!data.name.trim()) nextErrors.name = 'الاسم مطلوب';
    if (data.orderType === 'delivery' && !data.area.trim()) nextErrors.area = 'الموقع / العنوان مطلوب للتوصيل';

    const phoneNormalized = normalizePhone(data.phone);
    if (!phoneNormalized) {
      nextErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\d{8,15}$/.test(phoneNormalized)) {
      nextErrors.phone = 'رقم الهاتف غير صحيح';
    }

    setErrors(nextErrors);
    return { isValid: Object.keys(nextErrors).length === 0, phoneNormalized };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { isValid, phoneNormalized } = validate(formData);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit({
        ...formData,
        phone: phoneNormalized,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="surface-strong rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">إكمال الطلب</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-smoke-900/40 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fire-500/40"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-right font-bold mb-2 text-white">طريقة الطلب *</label>
            <select
              value={formData.orderType}
              onChange={(e) => {
                const next = e.target.value as CustomerInfo['orderType'];
                setFormData({
                  ...formData,
                  orderType: next,
                  area: next === 'pickup' ? '' : formData.area,
                });
                if (errors.area) setErrors(prev => ({ ...prev, area: undefined }));
              }}
              className="input-base"
            >
              <option value="delivery">توصيل</option>
              <option value="pickup">استلام</option>
            </select>
          </div>

          <div>
            <label className="block text-right font-bold mb-2 text-white">الاسم *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className="input-base"
              placeholder="أدخل اسمك"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-fire-300 text-right">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-right font-bold mb-2 text-white">رقم الهاتف *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
              }}
              className="input-base"
              placeholder="مثال: 2499xxxxxxx"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-fire-300 text-right">{errors.phone}</p>
            )}
          </div>

          {formData.orderType === 'delivery' && (
            <div>
              <label className="block text-right font-bold mb-2 text-white">الموقع / العنوان *</label>
              <input
                type="text"
                required
                value={formData.area}
                onChange={(e) => {
                  setFormData({ ...formData, area: e.target.value });
                  if (errors.area) setErrors(prev => ({ ...prev, area: undefined }));
                }}
                className="input-base"
                placeholder="مثال: الفادني - شارع كذا - بالقرب من..."
              />
              {errors.area && (
                <p className="mt-2 text-sm text-fire-300 text-right">{errors.area}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-right font-bold mb-2 text-white">ملاحظات التوصيل</label>
            <textarea
              value={formData.deliveryNotes}
              onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
              className="input-base resize-none"
              rows={3}
              placeholder="أي ملاحظات إضافية (اختياري)"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال الطلب عبر واتساب'}
          </button>
        </form>
      </div>
    </div>
  );
}
