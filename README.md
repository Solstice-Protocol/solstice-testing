# Solstice Vault - Age-Gated Content Platform

A fully functional identity verification app built with Solstice SDK and Protocol. Users must verify their age (18+) using their Aadhaar QR code to access restricted content.

## Features

- ✅ **Zero-Knowledge Age Verification**: Prove you're 18+ without revealing your date of birth
- 📸 **QR Code Scanning**: Scan Aadhaar QR codes directly from your camera
- 📤 **Image Upload**: Upload QR code images for verification
## Features

# Solstice Vault - Third-Party Verification Demo

A demonstration of how third-party applications integrate with the Solstice Protocol for age verification. This app showcases the **challenge-response architecture** where users verify their age through the main Solstice app, not by sharing their Aadhaar data directly.

## Architecture

This is a **third-party consumer app** that:
1. Generates verification challenge QR codes
2. Displays challenges for users to scan with the main Solstice app
3. Waits for zero-knowledge proof responses
4. Verifies proofs and grants access

**Important**: This app does NOT scan Aadhaar QR codes. Identity registration happens once in the main Solstice app.

## Features

- 🎮 **Age-Gated Content**: Access restricted to verified adults (18+)
- 🔒 **Privacy-Preserving**: Uses challenge-response with zero-knowledge proofs
- 📱 **QR Challenge Generation**: Creates challenges that users scan in the main Solstice app
- 🧪 **Demo Mode**: Skip verification for testing the UI
- ⚡ **Solana Integration**: Proofs verified on Solana devnet
- 🎨 **Beautiful UI**: Modern, responsive design with Solana-themed gradients
- 🔒 **Privacy-First**: All personal data stays on your device
- 🚀 **Built on Solana**: Fast and cost-efficient blockchain verification
- 🎨 **Beautiful UI**: Built with Tailwind CSS and shadcn/ui

## How It Works

### Challenge-Response Flow

1. **Third-Party App** (this app):
   - Generates a verification challenge using `sdk.generateChallenge()`
   - Encodes challenge into a QR code
   - Displays QR code for user to scan

2. **User Action**:
   - Opens the main Solstice app (where they registered identity once)
   - Scans the challenge QR code
   - Solstice app generates ZK proof and sends it back

3. **Verification**:
   - Third-party app receives the proof response
   - Verifies proof using `sdk.verifyProofResponse()`
   - Grants access if verified

4. **Privacy**:
   - No personal data (Aadhaar, DOB, etc.) is ever shared
   - Only a ZK proof confirming "user is 18+" is transmitted
   - User maintains full control over their identity data

### Technical Flow

```
[This App]                      [User's Solstice App]           [Solana Blockchain]
     |                                    |                              |
     | 1. Generate Challenge              |                              |
     |----------------------------------->|                              |
     | (Display QR Code)                  |                              |
     |                                    |                              |
     |                       2. Scan QR & Generate ZK Proof             |
     |                                    |----------------------------->|
     |                                    |  3. Verify on-chain          |
     |                                    |<-----------------------------|
     |                                    |                              |
     | 4. Send Proof Response             |                              |
     |<-----------------------------------|                              |
     |                                    |                              |
     | 5. Verify Proof                    |                              |
     |                                    |                              |
     | 6. Grant Access                    |                              |
```

## Demo Mode

For testing without a real Aadhaar QR code, click "Use Demo Mode" to skip verification.

## Technologies Used

- **@solsticeprotocol/sdk** - Zero-knowledge identity verification
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **html5-qrcode** - QR code scanning
- **Solana Web3.js** - Blockchain integration
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A modern web browser with camera access (for QR scanning)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically http://localhost:5173)

### Testing

The app includes two ways to test:

1. **Generate Verification QR**: Creates a challenge QR code that users would scan with the main Solstice app
   - In this demo, verification is simulated after 5 seconds
   - In production, you'd poll a backend API for the actual proof response

2. **Skip Verification (Demo Mode)**: Bypass verification to see the restricted content immediately

### Integration with Main Solstice App

For the full flow to work:
1. User must first register in the main Solstice app (`solstice-website/frontend`)
2. User scans the challenge QR from this app
3. Main app generates ZK proof and submits it
4. This app receives and verifies the proof

See [ARCHITECTURE.md](/ARCHITECTURE.md) for complete integration details.

## Project Structure

```
src/
├── App.tsx                    # Main application component
├── components/
│   └── ui/
│       ├── button.tsx         # Button component
│       └── card.tsx           # Card component
└── lib/
    └── utils.ts               # Utility functions
```

## Use Cases

### Current Implementation
- **Age-Gated Gaming Platform**: Verify users are 18+ to access mature games

### Potential Extensions
- **DeFi KYC**: Regulatory compliance for decentralized exchanges
- **DAO Voting**: Sybil-resistant governance with one person = one vote
- **NFT Mints**: Fair distribution to unique verified humans
- **Geographic Compliance**: Verify nationality for restricted services

## Security & Privacy

- ✅ **Zero-Knowledge Proofs**: Only proves age ≥ 18, doesn't reveal exact age or other data
- ✅ **Client-Side Proof Generation**: Personal data never leaves your browser
- ✅ **Cryptographic Commitments**: Only hash commitments are stored on-chain
- ✅ **Groth16 SNARKs**: 128-bit security with BN254 elliptic curves
- ✅ **256-byte Proofs**: Constant-size proofs for efficient verification

## API Reference

### Main Functions

#### `useDemoMode()`
Skips verification for testing purposes

#### `startCameraScanner()`
Opens camera to scan QR codes in real-time

#### `handleFileUpload(file)`
Uploads and scans QR code from image file

#### `verifyIdentity(qrCodeData)`
Generates age proof and verifies on-chain using Solstice SDK

## Configuration

The app uses Solana Devnet by default. To change networks, update the SDK configuration in `App.tsx`:

```typescript
const solsticeSDK = new SolsticeSDK({
  endpoint: 'https://api.devnet.solana.com',  // Change to mainnet or testnet
  programId: new PublicKey('8jrTVUyvHrL5WTWyDoa6PTJRhh3MwbvLZXeGT81YjJjz'),
  network: 'devnet',  // mainnet | devnet | testnet
  debug: true
});
```

## Troubleshooting

### Camera Access Failed
- Grant camera permissions in your browser settings
- Try uploading a QR code image instead

### SDK Initialization Failed
- Check your internet connection
- Verify you're using the correct Solana RPC endpoint

### Verification Failed
- Ensure QR code is from official mAadhaar app
- Check that QR code is clearly visible and not blurry
- Try Demo Mode to test the UI without real verification

## Future Enhancements

- [ ] Wallet integration for on-chain proof storage
- [ ] Multi-proof support (age + nationality + uniqueness)
- [ ] Proof history and management
- [ ] Social sharing of verified status
- [ ] More game content and challenges
- [ ] NFT rewards for verified users

## Learn More

- [Solstice SDK Documentation](https://www.npmjs.com/package/@solsticeprotocol/sdk)
- [Solstice Protocol](https://github.com/Shaurya2k06/SolsticeProtocol)
- [Aadhaar QR Code Spec](https://uidai.gov.in/ecosystem/authentication-devices-documents/qr-code-reader.html)

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/Shaurya2k06/SolsticeProtocol).
