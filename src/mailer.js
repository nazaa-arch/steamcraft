/**
 * STEAM-Craft — Mailer Service
 * Supports both Real SMTP (Gmail, Brevo, Resend, Custom SMTP)
 * and Smart Simulated Dev-Mode Fallback.
 */

const nodemailer = require('nodemailer');

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : (port === 465);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.SMTP_FROM || `STEAM-Craft Platform <${user || 'no-reply@steamcraft.ac.id'}>`;

  const isConfigured = Boolean(user && pass);

  return { host, port, secure, user, pass, from, isConfigured };
}

function generateEmailHtml({ name, otpCode, email }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verifikasi Akun STEAM-Craft</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a192f 0%, #1e3a5f 100%); padding: 32px 28px; text-align: center;">
              <div style="font-size: 38px; margin-bottom: 8px;">🔬</div>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.3px;">
                STEAM-Craft
              </h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                Platform Kolaborasi Riset Multidisiplin Mahasiswa & Dosen
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">
                Verifikasi Alamat Email Anda
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
                Halo <strong>${name}</strong>,<br>
                Terima kasih telah mendaftar di <strong>STEAM-Craft</strong>. Untuk memastikan keamanan akun dan mengonfirmasi bahwa email <code>${email}</code> adalah milik Anda, silakan gunakan kode verifikasi OTP berikut:
              </p>

              <!-- OTP Code Box -->
              <div style="background: #f8fafc; border: 2px dashed #2563eb; border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                  KODE VERIFIKASI OTP
                </div>
                <div style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #1e40af; font-family: 'Courier New', Courier, monospace;">
                  ${otpCode}
                </div>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
                  ⏳ Berlaku selama <strong>10 menit</strong>
                </div>
              </div>

              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin-bottom: 16px;">
                Masukkan kode di atas pada jendela verifikasi di aplikasi STEAM-Craft. Jika Anda tidak merasa melakukan pendaftaran ini, silakan abaikan pesan email ini.
              </p>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
                <p style="font-size: 11.5px; color: #94a3b8; line-height: 1.5; margin: 0;">
                  🔒 <em>Keamanan Akun: Jangan pernah membagikan kode OTP ini kepada siapapun, termasuk staf pengelola sistem.</em>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.4;">
                &copy; 2026 STEAM-Craft. FMIPA & Dewan Riset Multidisiplin Kampus.<br>
                Email otomatis yang dikirim oleh sistem autentikasi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends verification OTP email to user.
 * Automatically falls back to simulated console/dev output if SMTP is not configured.
 */
async function sendVerificationEmail({ to, name, otpCode }) {
  const config = getSmtpConfig();

  if (config.isConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass
        }
      });

      const htmlContent = generateEmailHtml({ name, otpCode, email: to });

      const info = await transporter.sendMail({
        from: config.from,
        to: `"${name}" <${to}>`,
        subject: `[STEAM-Craft] ${otpCode} adalah Kode Verifikasi Email Anda`,
        text: `Halo ${name},\n\nKode verifikasi email Anda untuk STEAM-Craft adalah: ${otpCode}\nKode ini berlaku selama 10 menit.\n\nJangan bagikan kode ini kepada siapapun.`,
        html: htmlContent
      });

      console.log(`[MAILER] Real email sent to ${to} (MessageID: ${info.messageId})`);
      return { success: true, simulated: false, messageId: info.messageId };
    } catch (err) {
      console.warn(`[MAILER WARNING] Failed to send via SMTP (${err.message}). Falling back to simulated log.`);
      // Fallback to simulated delivery below
    }
  }

  // Simulated / Dev mode fallback
  console.log('==============================================================');
  console.log('📧 [MAILER - SIMULATED / DEV MODE]');
  console.log(`   Penerima : ${to} (${name})`);
  console.log(`   Subjek   : [STEAM-Craft] Kode Verifikasi Email`);
  console.log(`   Kode OTP : ${otpCode} (Berlaku 10 menit)`);
  console.log('   Status   : SMTP belum dikonfigurasi atau fallback aktif.');
  console.log('              Kode OTP ini dapat digunakan langsung di browser.');
  console.log('==============================================================');

  return {
    success: true,
    simulated: true,
    otpCode,
    hint: 'SMTP credentials not provided; OTP returned for instant development testing.'
  };
}

module.exports = {
  sendVerificationEmail,
  getSmtpConfig
};
