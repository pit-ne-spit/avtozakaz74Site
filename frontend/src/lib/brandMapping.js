/**
 * Mapping of Chinese/API brand names to internationally recognized names
 * Used to display correct brand names to users while maintaining API compatibility
 */

export const BRAND_NAME_MAPPING = {
  // Chinese brands - corrections
  'Harvard': 'Haval',
  'Wei Brand': 'WEY',
  'Red Flag': 'Hongqi',
  'Euler': 'Ora',
  'Dark Blue Car': 'Deepal',
  'Equation Leopard': 'Fangchengbao',
  'Look Up': 'Yangwang',
  'Leap Car': 'Leapmotor',
  'Ideal Car': 'Li Auto',
  'Xiaopeng': 'Xpeng',
  'Nezha Car': 'Neta',
  'Lantu Automobile': 'Voyah',
  'Very Kryptonian': 'Voyah', // Alternative name for Lantu/Voyah
  'Zhiji Automobile': 'IM Motors',
  
  // Geely sub-brands
  'Geely Automobile': 'Geely',
  'Geely Galaxy': 'Geely Galaxy',
  'Geely Geometry': 'Geometry',
  
  // BYD sub-brands
  'Equation Leopard': 'Fangchengbao',
  'Look Up': 'Yangwang',
  
  // Great Wall sub-brands
  'Great Wall': 'Great Wall Motors',
  'Tank': 'Tank',
  'Euler': 'Ora',
  
  // Changan sub-brands
  "Chang'An": 'Changan',
  "Chang'An Span": 'Changan Span',
  'Changan Auchan': 'Changan Auchan',
  'Changan Kaicheng': 'Changan Kaicheng',
  'Changan Qiyuan': 'Changan Qiyuan',
  'Dark Blue Car': 'Deepal',
  
  // Dongfeng sub-brands
  'Dongfeng': 'Dongfeng',
  'Dongfeng Fengshen': 'Dongfeng Aeolus',
  'Dongfeng Is Popular': 'Dongfeng Fengxing',
  'Dongfeng Nano': 'Dongfeng Nano',
  'Dongfeng Scenery': 'Dongfeng Fengguang',
  'Dongfeng Style': 'Dongfeng Forthing',
  'Dongfeng Xiaokang': 'Dongfeng Xiaokang',
  'Dongfeng Yufeng': 'Dongfeng Yufeng',
  
  // SAIC sub-brands
  'Saic Maxus': 'Maxus',
  'Roewe': 'Roewe',
  'Mg': 'MG',
  
  // GAC sub-brands
  'Gac Trumpchi': 'GAC Trumpchi',
  'Gac Haopin': 'GAC Haopin',
  'Aian': 'Aion',
  
  // BAIC sub-brands
  'Baic Motor': 'BAIC',
  'Baic New Energy': 'BAIC BJEV',
  'Baic Changhe': 'BAIC Changhe',
  'Baic Magic Speed': 'BAIC Huansu',
  'Baic Weiwang': 'BAIC Weiwang',
  'Beijing Automobile Manufacturing Plant': 'BAW',
  'Beijing Cross Country': 'Beijing BJ',
  'Arcfox Extreme Fox': 'Arcfox',
  
  // JAC sub-brands
  'Jac Ruifeng': 'JAC Refine',
  'Jianghuai Yinwei': 'JAC Yiwei',
  
  // Chery sub-brands
  'Chery': 'Chery',
  'Chery Fengyun': 'Chery Fengyun',
  'Chery New Energy': 'Chery New Energy',
  'Exeed': 'Exeed',
  'Jetour': 'Jetour',
  'Jietu': 'Jetour',
  'Jietu Mountains And Seas': 'Jetour Shanhai',
  
  // Other Chinese brands
  'Aito Asks The World': 'Aito',
  'Ascend Automobile': 'Ascend',
  'Avita': 'Avatr',
  'Baojun': 'Baojun',
  'Borgward': 'Borgward',
  'Bosu': 'Bosch',
  'Brilliance Xinri': 'Brilliance Jinbei',
  'Carrier': 'Kawei',
  'Chaojing Automobile': 'Chaojing',
  'Cheetah Cars': 'Cheetah',
  'Foday': 'Foday',
  'Futian': 'Foton',
  'Gain Momentum': 'Jetour',
  'Galloping': 'Benz',
  'Gaohe Automobile': 'HiPhi',
  'George Patton': 'George Patton',
  'Golden Cup': 'Jinbei',
  'Golden Dragon': 'Golden Dragon',
  'Golden Hotel': 'Jindi',
  'Hanteng Automobile': 'Hanteng',
  'Hua Song': 'Huasong',
  'Huatai': 'Huatai',
  'Icar': 'iCAR',
  'Idea': 'iA',
  'Ineos Grenadier': 'Ineos',
  'Insightful': 'Zhidou',
  'Intellectual World': 'Zhiji',
  'Jiangling': 'JMC',
  'Jiangling Group New Energy': 'Yusheng',
  'Jiangxi Automobile Group': 'JAC',
  'Juntian': 'Juntian',
  'Kaiyi': 'Cowin',
  'Kmuller': 'K-Muller',
  'Kunchi': 'Kunchi',
  'Ledao': 'Onvo',
  'Levc': 'LEVC',
  'Lifan Motors': 'Lifan',
  'Lingbao Automobile': 'Lingbao',
  'Lorinser': 'Lorinser',
  'Lotus Sports Car': 'Lotus',
  'Lu Feng': 'Lufeng',
  'Lynk & Co': 'Lynk & Co',
  'Mustang Cars': 'Mustang',
  'Nazhijie': 'Luxgen',
  'Qichen': 'Venucia',
  'Qoros': 'Qoros',
  'Remote': 'Yuancheng',
  'Rich Auto': 'Richi',
  'Ruilan Automobile': 'Ruilan',
  'Seahorse': 'Haima',
  'Seres': 'Seres',
  'Si Hao': 'Sehol',
  'Siming': 'Siming',
  'Skyline Car': 'Skyline',
  'Skyworth Automobile': 'Skyworth',
  'Songsan Motors': 'SsangYong',
  'Southeast': 'Soueast',
  'Speed Car': 'Speed',
  'Stardom': 'Starry',
  'Swm Motors': 'SWM',
  'Universiade': 'Dayun',
  'Warrior': 'Warrior',
  'Wuling Motors': 'Wuling',
  'Xiaohu': 'Xiaohu',
  'Xiaomi Car': 'Xiaomi',
  'Zotye': 'Zotye',
  'Punk Car': 'Punk',
  
  // International brands - standardization
  'Acura': 'Acura',
  'Alfa Romeo': 'Alfa Romeo',
  'Alpina': 'Alpina',
  'Aston Martin': 'Aston Martin',
  'Audi': 'Audi',
  'Bentley': 'Bentley',
  'Bmw': 'BMW',
  'Buick': 'Buick',
  'Byd': 'BYD',
  'Cadillac': 'Cadillac',
  'Chevrolet': 'Chevrolet',
  'China': 'China',
  'Chrysler': 'Chrysler',
  'Citroën': 'Citroën',
  'Dodge': 'Dodge',
  'Ds': 'DS',
  'Faw': 'FAW',
  'Ferrari': 'Ferrari',
  'Fiat': 'Fiat',
  'Ford': 'Ford',
  'Gmc': 'GMC',
  'Honda': 'Honda',
  'Hummer': 'Hummer',
  'Hyundai': 'Hyundai',
  'Infiniti': 'Infiniti',
  'Isuzu': 'Isuzu',
  'Iveco': 'Iveco',
  'Jaguar': 'Jaguar',
  'Jeep': 'Jeep',
  'Jetta': 'Jetta',
  'Kia': 'Kia',
  'Lamborghini': 'Lamborghini',
  'Land Rover': 'Land Rover',
  'Lexus': 'Lexus',
  'Lincoln': 'Lincoln',
  'Maserati': 'Maserati',
  'Maybach': 'Maybach',
  'Mazda': 'Mazda',
  'Mclaren': 'McLaren',
  'Mercedes-Benz': 'Mercedes-Benz',
  'Mini': 'Mini',
  'Mitsubishi': 'Mitsubishi',
  'Morgan': 'Morgan',
  'Nio': 'NIO',
  'Nissan': 'Nissan',
  'Opel': 'Opel',
  'Peugeot': 'Peugeot',
  'Polestar': 'Polestar',
  'Porsche': 'Porsche',
  'Ram': 'Ram',
  'Renault': 'Renault',
  'Rolls Royce': 'Rolls-Royce',
  'Saab': 'Saab',
  'Seat': 'SEAT',
  'Skoda': 'Škoda',
  'Smart': 'Smart',
  'Ssangyong': 'SsangYong',
  'Subaru': 'Subaru',
  'Suzuki': 'Suzuki',
  'Tesla': 'Tesla',
  'Toyota': 'Toyota',
  'Volkswagen': 'Volkswagen',
  'Volvo': 'Volvo'
};

/**
 * Get the display name for a brand
 * @param {string} apiBrandName - Brand name from API
 * @returns {string} Display name for user
 */
export function getDisplayBrandName(apiBrandName) {
  if (!apiBrandName) return '';
  return BRAND_NAME_MAPPING[apiBrandName] || apiBrandName;
}

/**
 * Get the API name from display name (reverse mapping)
 * @param {string} displayName - Display name shown to user
 * @returns {string} API brand name
 */
export function getApiBrandName(displayName) {
  if (!displayName) return '';
  
  // Find the key that maps to this display name
  const entry = Object.entries(BRAND_NAME_MAPPING).find(
    ([_, mappedName]) => mappedName === displayName
  );
  
  return entry ? entry[0] : displayName;
}

/**
 * Get sorted list of unique display brand names
 * @returns {string[]} Sorted array of display brand names
 */
export function getDisplayBrandList() {
  const displayNames = new Set(Object.values(BRAND_NAME_MAPPING));
  return Array.from(displayNames).sort();
}

/**
 * Get list of API brand names
 * @returns {string[]} Array of API brand names
 */
export function getApiBrandList() {
  return Object.keys(BRAND_NAME_MAPPING).sort();
}
