/**
 * Test QR Code Generator
 * Generates sample mAadhaar-style QR data for testing
 */

export interface TestUser {
  uid: string;
  name: string;
  dob: string; // DD-MM-YYYY
  gender: 'M' | 'F' | 'O';
  age: number;
}

export const TEST_USERS: TestUser[] = [
  {
    uid: '123456789012',
    name: 'John Doe',
    dob: '15-08-1990',
    gender: 'M',
    age: 33
  },
  {
    uid: '987654321098',
    name: 'Jane Smith',
    dob: '01-01-2005',
    gender: 'F',
    age: 19
  },
  {
    uid: '111222333444',
    name: 'Minor User',
    dob: '01-01-2008',
    gender: 'M',
    age: 16
  },
  {
    uid: '555666777888',
    name: 'Sarah Johnson',
    dob: '20-12-1985',
    gender: 'F',
    age: 38
  }
];

/**
 * Generate test mAadhaar QR data in the format expected by Solstice SDK
 */
export function generateTestQR(user: TestUser): string {
  return `<?xml version="1.0" encoding="UTF-8"?><OfflinePaperlessKyc uid="${user.uid}" name="${user.name}" dob="${user.dob}" gender="${user.gender}" co="S/O Test User" house="123" street="Test Street" lm="Near Test" loc="Test Location" vtc="Test City" po="Test PO" dist="Test District" state="Test State" pc="123456" />`;
}

/**
 * Get a random test user
 */
export function getRandomTestUser(): TestUser {
  return TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];
}

/**
 * Get test user by age category
 */
export function getTestUserByAge(minAge: number): TestUser | undefined {
  return TEST_USERS.find(user => user.age >= minAge);
}

/**
 * Generate all test QR codes
 */
export function getAllTestQRCodes(): Array<{ user: TestUser; qrData: string }> {
  return TEST_USERS.map(user => ({
    user,
    qrData: generateTestQR(user)
  }));
}
