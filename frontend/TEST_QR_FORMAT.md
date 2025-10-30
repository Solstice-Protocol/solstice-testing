# Testing QR Code Format

The Solstice SDK expects mAadhaar QR codes in a specific XML-like format. For testing purposes, here's the expected format:

## Expected Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<OfflinePaperlessKyc uid="123456789012" name="John Doe" dob="15-08-1990" gender="M" ... />
```

## Test QR Data

For testing the age verification feature, you can generate a QR code with the following test data:

### Valid Adult (Age 30+)
```
<?xml version="1.0" encoding="UTF-8"?><OfflinePaperlessKyc uid="123456789012" name="John Doe" dob="15-08-1990" gender="M" co="S/O Test User" house="123" street="Test Street" lm="Near Test" loc="Test Location" vtc="Test City" po="Test PO" dist="Test District" state="Test State" pc="123456" />
```

### Valid Young Adult (Age 19)
```
<?xml version="1.0" encoding="UTF-8"?><OfflinePaperlessKyc uid="987654321098" name="Jane Smith" dob="01-01-2005" gender="F" co="D/O Test User" house="456" street="Sample Street" lm="Near Sample" loc="Sample Location" vtc="Sample City" po="Sample PO" dist="Sample District" state="Sample State" pc="654321" />
```

### Minor (Age 16 - should fail)
```
<?xml version="1.0" encoding="UTF-8"?><OfflinePaperlessKyc uid="111222333444" name="Minor User" dob="01-01-2008" gender="M" co="S/O Parent" house="789" street="Test Avenue" lm="Near School" loc="Test Locality" vtc="Test Town" po="Test PO" dist="Test Dist" state="Test State" pc="111111" />
```

## Real mAadhaar QR Codes

Real mAadhaar QR codes from UIDAI are typically:
- Base64 encoded XML
- Digitally signed
- May have different attribute names or structure

### Known Issues

1. **Format Mismatch**: The SDK currently expects plain XML with quoted attributes like `uid="..."`, `name="..."`, `dob="..."`.

2. **Real QR Codes**: Actual mAadhaar QR codes may:
   - Be base64 encoded (need to decode first)
   - Use different tag structures
   - Include digital signatures and encryption

3. **Date Format**: The SDK expects dates in `DD-MM-YYYY` format.

## Workarounds

### Option 1: Use Demo Mode
The app includes a "Use Demo Mode" button that bypasses QR scanning for testing purposes.

### Option 2: Generate Test QR Code
Use any QR code generator (like https://www.qr-code-generator.com/) with one of the test data strings above.

### Option 3: Update SDK Parser
If you need to support real mAadhaar QR codes, the SDK parser needs to be updated to:
1. Detect and decode base64 encoding
2. Handle different XML structures
3. Parse signed and encrypted data

## Next Steps

For production use with real mAadhaar QR codes, the SDK's `parseAadhaarQR()` function in `src/utils/helpers.ts` needs to be enhanced to:

```typescript
// Pseudo-code for enhanced parser
function parseAadhaarQR(qrData: string) {
  // 1. Check if base64 encoded
  if (isBase64(qrData)) {
    qrData = base64Decode(qrData);
  }
  
  // 2. Try multiple parsing strategies
  try {
    return parseXMLFormat(qrData);
  } catch {
    try {
      return parsePipeSeparated(qrData);
    } catch {
      return parseJSONFormat(qrData);
    }
  }
}
```

## Contact

For questions about real mAadhaar integration, please refer to:
- UIDAI Aadhaar Paperless Offline e-KYC documentation
- Solstice Protocol whitepaper
