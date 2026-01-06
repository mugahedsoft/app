# إعداد تطبيق بيتزتي

## تغيير رقم واتساب

في الملف `src/utils/whatsapp.ts:3`

```typescript
const WHATSAPP_NUMBER = '201234567890';
```

غير الرقم إلى رقمك بصيغة دولية (بدون + أو 00)
مثال: 201012345678

## تعديل المنيو

في الملف `src/data/menu.ts`

عدّل المنتجات والأسعار حسب حاجتك

## التنصيب

```bash
npm install
npm run dev
```

## البناء

```bash
npm run build
```
