export type MenuLine = {
  name: string;
  price: number;
};

export type MenuLine2Prices = {
  name: string;
  regular: number;
  jumbo: number;
};

export type MenuLine3Prices = {
  name: string;
  small: number;
  medium: number;
  large: number;
};

export const fatayerShami: MenuLine[] = [
  { name: 'مشكلة', price: 8000 },
  { name: 'فراخ', price: 7000 },
  { name: 'هوت دوق', price: 6000 },
  { name: 'لحمة', price: 6000 },
];

export const fatayerSweet: MenuLine[] = [
  { name: 'مشكلة', price: 9000 },
  { name: 'قشطة عسل', price: 8000 },
  { name: 'نوتيلا عسل', price: 8000 },
  { name: 'بسبوسة', price: 8000 },
];

export const broast: MenuLine[] = [
  { name: '1 قطعة', price: 3500 },
  { name: '3 قطع', price: 10500 },
  { name: '6 قطع', price: 21000 },
  { name: '10 قطع', price: 35000 },
  { name: '12 قطعة', price: 42000 },
];

export const sandwiches: MenuLine2Prices[] = [
  { name: 'كرسبي', jumbo: 6000, regular: 4000 },
  { name: 'شاورما', jumbo: 6000, regular: 4000 },
  { name: 'هوت دوق', jumbo: 5000, regular: 3000 },
];

export const pizzas: MenuLine3Prices[] = [
  { name: 'مشكلة', large: 24000, medium: 17000, small: 15000 },
  { name: 'فراخ', large: 23000, medium: 16000, small: 14000 },
  { name: 'هوت دوق', large: 22000, medium: 15000, small: 13000 },
  { name: 'لحمة', large: 23000, medium: 16000, small: 14000 },
];

export const juices: MenuLine[] = [
  { name: 'مشكل كبير', price: 5000 },
  { name: 'مشكل صغير', price: 4000 },
  { name: 'منقة باللبن', price: 3500 },
  { name: 'منقة', price: 3000 },
  { name: 'فراولة', price: 3000 },
  { name: 'فراولة بالنوتيلا', price: 5000 },
  { name: 'فراولة باللبن', price: 3500 },
  { name: 'فراولة بالأوريو', price: 5000 },
  { name: 'موز باللبن', price: 2500 },
  { name: 'اناناس', price: 2500 },
  { name: 'قريب فروت', price: 2000 },
  { name: 'نص ضربه', price: 6000 },
  { name: 'سوبر ضربه', price: 7000 },
  { name: 'برتقال', price: 1000 },
];
