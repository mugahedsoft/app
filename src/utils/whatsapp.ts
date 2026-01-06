import { CartItem, CustomerInfo } from '../types';

const WHATSAPP_NUMBER = '+249900318100';

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/[^\d]/g, '');
}

export function generateWhatsAppMessage(
  items: CartItem[],
  customer: CustomerInfo,
  total: number
): string {
  const now = new Date();
  const date = now.toLocaleDateString('ar-EG');
  const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  const itemsList = items
    .map(item => `- ${item.product.name} × ${item.quantity}${item.notes ? ` (${item.notes})` : ''}`)
    .join('\n');

  const message = `📌 *طلب جديد – بيتزتي* 🍕
━━━━━━━━━━━━

👤 الاسم: ${customer.name}
📞 الهاتف: ${customer.phone}
📍 العنوان: ${customer.area}

━━━━━━━━━━━━
🧾 *الطلب:*
${itemsList}

${customer.deliveryNotes ? `📝 ملاحظات:\n${customer.deliveryNotes}\n` : ''}━━━━━━━━━━━━
💰 *الإجمالي:* ${total} جنيه

📅 التاريخ: ${date}
⏰ الوقت: ${time}`;

  return message;
}

export function sendToWhatsApp(message: string): void {
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = normalizeWhatsAppNumber(WHATSAPP_NUMBER);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}
