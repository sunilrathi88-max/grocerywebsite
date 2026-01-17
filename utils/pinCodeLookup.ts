// Indian PIN code to City/State mapping utility
// This is a sample dataset - in production, this would call an API

interface PinCodeData {
  city: string;
  state: string;
  region: string;
}

// Common Indian PIN codes sample data
const pinCodeDatabase: Record<string, PinCodeData> = {
  // Maharashtra
  '400001': { city: 'Mumbai', state: 'Maharashtra', region: 'Fort' },
  '400002': { city: 'Mumbai', state: 'Maharashtra', region: 'Kalbadevi' },
  '400050': { city: 'Mumbai', state: 'Maharashtra', region: 'Bandra West' },
  '400051': { city: 'Mumbai', state: 'Maharashtra', region: 'Bandra East' },
  '400053': { city: 'Mumbai', state: 'Maharashtra', region: 'Andheri West' },
  '400058': { city: 'Mumbai', state: 'Maharashtra', region: 'Andheri East' },
  '400076': { city: 'Mumbai', state: 'Maharashtra', region: 'Powai' },
  '411001': { city: 'Pune', state: 'Maharashtra', region: 'Shivajinagar' },
  '411014': { city: 'Pune', state: 'Maharashtra', region: 'Hadapsar' },
  '411057': { city: 'Pune', state: 'Maharashtra', region: 'Wakad' },
  '440001': { city: 'Nagpur', state: 'Maharashtra', region: 'Sitabuldi' },

  // Delhi NCR
  '110001': { city: 'New Delhi', state: 'Delhi', region: 'Connaught Place' },
  '110011': { city: 'New Delhi', state: 'Delhi', region: 'Patel Nagar' },
  '110017': { city: 'New Delhi', state: 'Delhi', region: 'Hauz Khas' },
  '110025': { city: 'New Delhi', state: 'Delhi', region: 'Okhla' },
  '110091': { city: 'New Delhi', state: 'Delhi', region: 'Mayur Vihar' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', region: 'Sector 1-30' },
  '201303': { city: 'Noida', state: 'Uttar Pradesh', region: 'Sector 35-60' },
  '122001': { city: 'Gurugram', state: 'Haryana', region: 'Sector 1-10' },
  '122002': { city: 'Gurugram', state: 'Haryana', region: 'Old Gurgaon' },

  // Karnataka
  '560001': { city: 'Bengaluru', state: 'Karnataka', region: 'MG Road' },
  '560011': { city: 'Bengaluru', state: 'Karnataka', region: 'Jayanagar' },
  '560034': { city: 'Bengaluru', state: 'Karnataka', region: 'Koramangala' },
  '560037': { city: 'Bengaluru', state: 'Karnataka', region: 'Whitefield' },
  '560066': { city: 'Bengaluru', state: 'Karnataka', region: 'Electronic City' },
  '560103': { city: 'Bengaluru', state: 'Karnataka', region: 'Sarjapur' },

  // Tamil Nadu
  '600001': { city: 'Chennai', state: 'Tamil Nadu', region: 'Parrys' },
  '600017': { city: 'Chennai', state: 'Tamil Nadu', region: 'T Nagar' },
  '600040': { city: 'Chennai', state: 'Tamil Nadu', region: 'Adyar' },
  '600042': { city: 'Chennai', state: 'Tamil Nadu', region: 'Mylapore' },
  '641001': { city: 'Coimbatore', state: 'Tamil Nadu', region: 'Town Hall' },

  // Gujarat
  '380001': { city: 'Ahmedabad', state: 'Gujarat', region: 'Lal Darwaja' },
  '380015': { city: 'Ahmedabad', state: 'Gujarat', region: 'Vastrapur' },
  '395001': { city: 'Surat', state: 'Gujarat', region: 'Nanpura' },
  '390001': { city: 'Vadodara', state: 'Gujarat', region: 'Alkapuri' },

  // West Bengal
  '700001': { city: 'Kolkata', state: 'West Bengal', region: 'BBD Bagh' },
  '700020': { city: 'Kolkata', state: 'West Bengal', region: 'South Kolkata' },
  '700091': { city: 'Kolkata', state: 'West Bengal', region: 'Salt Lake' },

  // Telangana
  '500001': { city: 'Hyderabad', state: 'Telangana', region: 'Abids' },
  '500032': { city: 'Hyderabad', state: 'Telangana', region: 'Jubilee Hills' },
  '500081': { city: 'Hyderabad', state: 'Telangana', region: 'Hitec City' },

  // Rajasthan
  '302001': { city: 'Jaipur', state: 'Rajasthan', region: 'Pink City' },
  '302017': { city: 'Jaipur', state: 'Rajasthan', region: 'Malviya Nagar' },
  '313001': { city: 'Udaipur', state: 'Rajasthan', region: 'City Palace Area' },

  // Kerala
  '682001': { city: 'Kochi', state: 'Kerala', region: 'Fort Kochi' },
  '695001': { city: 'Thiruvananthapuram', state: 'Kerala', region: 'East Fort' },

  // Punjab
  '160001': { city: 'Chandigarh', state: 'Chandigarh', region: 'Sector 1-17' },
  '141001': { city: 'Ludhiana', state: 'Punjab', region: 'Civil Lines' },
  '143001': { city: 'Amritsar', state: 'Punjab', region: 'Hall Gate' },
};

export interface PinLookupResult {
  success: boolean;
  data?: PinCodeData;
  error?: string;
}

/**
 * Look up city and state from an Indian PIN code
 * @param pinCode - 6-digit Indian PIN code
 * @returns Lookup result with city and state data
 */
export const lookupPinCode = (pinCode: string): PinLookupResult => {
  // Validate PIN code format
  if (!/^\d{6}$/.test(pinCode)) {
    return {
      success: false,
      error: 'Invalid PIN code format. Must be 6 digits.',
    };
  }

  const data = pinCodeDatabase[pinCode];

  if (data) {
    return {
      success: true,
      data,
    };
  }

  // Try to determine state from first 2-3 digits (PIN code zones)
  const zone = pinCode.substring(0, 2);
  const stateGuess = getStateFromZone(zone);

  if (stateGuess) {
    return {
      success: false,
      error: `PIN code not in database. Likely in ${stateGuess}.`,
    };
  }

  return {
    success: false,
    error: 'PIN code not found in our database.',
  };
};

// PIN code zones roughly correspond to states/regions
const getStateFromZone = (zone: string): string | null => {
  const zoneMap: Record<string, string> = {
    '11': 'Delhi',
    '12': 'Haryana',
    '13': 'Punjab',
    '14': 'Punjab',
    '15': 'Himachal Pradesh',
    '16': 'Punjab/Chandigarh',
    '17': 'Himachal Pradesh',
    '18': 'Jammu & Kashmir',
    '19': 'Jammu & Kashmir',
    '20': 'Uttar Pradesh',
    '21': 'Uttar Pradesh',
    '22': 'Uttar Pradesh',
    '23': 'Uttar Pradesh',
    '24': 'Uttar Pradesh',
    '25': 'Uttar Pradesh',
    '26': 'Uttar Pradesh',
    '27': 'Uttar Pradesh',
    '28': 'Uttar Pradesh',
    '30': 'Rajasthan',
    '31': 'Rajasthan',
    '32': 'Rajasthan',
    '33': 'Rajasthan',
    '34': 'Rajasthan',
    '36': 'Gujarat',
    '37': 'Gujarat',
    '38': 'Gujarat',
    '39': 'Gujarat',
    '40': 'Maharashtra',
    '41': 'Maharashtra',
    '42': 'Maharashtra',
    '43': 'Maharashtra',
    '44': 'Maharashtra',
    '45': 'Madhya Pradesh',
    '46': 'Madhya Pradesh',
    '47': 'Madhya Pradesh',
    '48': 'Madhya Pradesh',
    '49': 'Chhattisgarh',
    '50': 'Telangana',
    '51': 'Andhra Pradesh',
    '52': 'Andhra Pradesh',
    '53': 'Andhra Pradesh',
    '56': 'Karnataka',
    '57': 'Karnataka',
    '58': 'Karnataka',
    '59': 'Karnataka',
    '60': 'Tamil Nadu',
    '61': 'Tamil Nadu',
    '62': 'Tamil Nadu',
    '63': 'Tamil Nadu',
    '64': 'Tamil Nadu',
    '67': 'Kerala',
    '68': 'Kerala',
    '69': 'Kerala',
    '70': 'West Bengal',
    '71': 'West Bengal',
    '72': 'West Bengal',
    '73': 'West Bengal',
    '74': 'West Bengal',
    '75': 'Odisha',
    '76': 'Odisha',
    '77': 'Odisha',
    '78': 'Assam',
    '79': 'North East',
    '80': 'Bihar',
    '81': 'Bihar',
    '82': 'Bihar',
    '83': 'Jharkhand',
    '84': 'Jharkhand',
    '85': 'Jharkhand',
  };

  return zoneMap[zone] || null;
};

export default lookupPinCode;
