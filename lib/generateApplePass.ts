import { PKPass, Barcode } from 'passkit-generator';
import path from 'path';
import fs from 'fs';

const CERT_PATH = path.join(process.cwd(), 'certificates');
const TEMPLATE_PATH = path.join(process.cwd(), 'templates', 'template.pkpass'); // Your .pkpass template file
const TEMP_DIR = path.join(process.cwd(), 'tmp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export async function generateApplePass(userId: string | undefined, userName: string | undefined, balance: number, qrCode: string) {
    try {
        // Load certificates
        const certificates = {
            wwdr: fs.readFileSync(path.join(CERT_PATH, 'wwdr4.pem'), 'utf-8'),
            signerCert: fs.readFileSync(path.join(CERT_PATH, 'signing_pass.pem'), 'utf-8'),
            signerKey: fs.readFileSync(path.join(CERT_PATH, 'private_key.pem'), 'utf-8'),
            signerKeyPassphrase: process.env.APPLE_PASS_PHRASE || "csani1234"
        };

        // Load template .pkpass
        const pass = await PKPass.from({
            model: TEMPLATE_PATH,  // Pass the template .pkpass file path
            certificates: {
                wwdr: certificates.wwdr,
                signerCert: certificates.signerCert,
                signerKey: certificates.signerKey,
                signerKeyPassphrase: certificates.signerKeyPassphrase
            }
        });

        // Modify pass data dynamically
        pass.primaryFields[0].value = `${balance} points`;
        pass.secondaryFields[0].value = userName || '';
        pass.auxiliaryFields[0].value = userId || '';

        // Create barcode
        const barcode: Barcode = {
            message: qrCode,
            format: 'PKBarcodeFormatQR',
            messageEncoding: 'iso-8859-1'
        };
        
        pass.setBarcodes(barcode);
        pass.addBuffer('icon.png', fs.readFileSync(path.join(TEMPLATE_PATH, 'icon.png')));
        pass.addBuffer('logo.png', fs.readFileSync(path.join(TEMPLATE_PATH, 'logo.png')));
        pass.addBuffer('icon@2x.png', fs.readFileSync(path.join(TEMPLATE_PATH, 'icon@2x.png')))

        console.log('Pass data:', pass);

        // Generate pass file
        const passBuffer = await pass.getAsBuffer();
        
        // Create unique filename
        const filename = `pass_${userId}_${Date.now()}.pkpass`;
        const filePath = path.join(TEMP_DIR, filename);
        
        // Save the pass file
        fs.writeFileSync(filePath, passBuffer);
        
        // Return the full file path
        return filePath;
    } catch (error) {
        console.error('Error generating Apple pass:', error);
        throw error;  // Re-throw the error for further handling
    }
}
