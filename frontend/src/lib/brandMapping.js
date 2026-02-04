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
  'Jietu': 'Jetour', // Chinese name → display as Jetour
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
  'Gain Momentum': 'Gain Momentum', // Keep as is, don't map to Jetour
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
  'Skoda': 'Skoda',
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
  
  // Find all keys that map to this display name
  const matchingEntries = Object.entries(BRAND_NAME_MAPPING).filter(
    ([_, mappedName]) => mappedName === displayName
  );
  
  if (matchingEntries.length === 0) {
    return displayName;
  }
  
  // Special handling for brands with multiple API names mapping to same display name
  if (displayName === 'Jetour') {
    // When user selects "Jetour", send "Jietu" to API (Chinese name)
    // "Gain Momentum" is now separate and maps to itself
    const jietuEntry = matchingEntries.find(([key]) => key === 'Jietu');
    if (jietuEntry) {
      return jietuEntry[0]; // Return "Jietu"
    }
    // Fallback to first entry if "Jietu" not found (shouldn't happen)
    return matchingEntries[0][0];
  }
  
  // For other brands, return the first matching entry
  // Usually the first entry is the most common/primary API name
  return matchingEntries[0][0];
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

/**
 * Convert display model name back to API format
 * Reverses all normalizations done in normalize-models.js
 * 
 * This function works for ALL models, not just specific ones.
 * It reverses:
 * - "(Импорт)" -> "(Imported)" (language translation)
 * - "A4L" -> "A4l" (capitalization - API expects lowercase suffix)
 * - "E-tron" -> "e-tron" (capitalization)
 * - "RS 3" -> "Rs 3" (capitalization - but keep uppercase for known prefixes)
 * 
 * Examples:
 * - "Jimny (Импорт)" -> "Jimny (Imported)"
 * - "A4L" -> "A4l"
 * - "Q5L" -> "Q5l"
 * - "E-tron" -> "e-tron"
 * 
 * @param {string} displayModelName - Display model name (e.g., "Jimny (Импорт)", "A4L")
 * @returns {string} API model name (e.g., "Jimny (Imported)", "A4l")
 */
export function getApiModelName(displayModelName) {
  if (!displayModelName) return '';
  
  let apiModelName = displayModelName;
  
  // 1. Convert "(Импорт)" back to "(Imported)" - CRITICAL for API
  // The 'g' flag ensures ALL occurrences are replaced
  apiModelName = apiModelName.replace(/\(Импорт\)/g, '(Imported)');
  
  // 2. Reverse capitalization of model suffixes (A4L -> A4l, Q5L -> Q5l)
  // Pattern: uppercase letter + digits + uppercase letter at end -> lowercase last letter
  // This matches patterns like A4L, Q5L, X3L, etc.
  apiModelName = apiModelName.replace(/([A-Z]\d+)([A-Z])(\s|$|\))/g, (match, prefix, letter, suffix) => {
    // Only reverse if it's a single uppercase letter suffix (like L in A4L)
    if (letter.length === 1 && /[A-Z]/.test(letter)) {
      return prefix + letter.toLowerCase() + suffix;
    }
    return match;
  });
  
  // 3. Reverse E-tron -> e-tron (API expects lowercase)
  apiModelName = apiModelName.replace(/\bE-tron\b/g, 'e-tron');
  
  // Note: RS, GT, SQ prefixes are kept uppercase as API usually expects them that way
  // But if API expects lowercase, we can add: apiModelName = apiModelName.replace(/\bRS\s/g, 'Rs ');
  
  return apiModelName;
}
