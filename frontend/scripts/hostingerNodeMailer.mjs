import tls from 'node:tls';

export function sendHostingerEmail({ name, email, subject, message }) {
  return new Promise((resolve, reject) => {
    const host = 'smtp.hostinger.com';
    const port = 465;
    const username = 'query@campusarge.com';
    const password = 'Yashvardhan@_2027';

    const fromEmail = 'query@campusarge.com';
    const fromName = 'CampusArge Contact Form';
    const recipients = ['query@campusarge.com', 'info@campusarge.com'];
    const emailSubject = `[CampusArge Contact] ${subject || 'New Website Inquiry'}`;

    const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const boundary = 'b1_' + Date.now().toString(36) + Math.random().toString(36).substring(2);

    const safeMessage = (message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    const safeName = (name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeEmail = (email || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeSubject = (subject || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const textBody = `New Inquiry from CampusArge Website
====================================
Sender: ${name} <${email}>
Subject: ${subject}
Date: ${timestamp}

Message:
${message}

------------------------------------
Reply directly to this email to reply to ${name}.
`;

    const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #102a43; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(16,42,67,0.08); border: 1px solid #e5e9ef;">
    <div style="background: #102a43; padding: 24px 30px; text-align: left;">
      <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Campus<span style="color: #d4af37;">Arge</span> &mdash; Website Inquiry</h1>
    </div>
    <div style="padding: 30px;">
      <p style="margin: 0 0 16px 0; font-size: 14px; color: #627d98;">Received on ${timestamp}</p>
      <div style="margin-bottom: 14px;">
        <strong style="font-size: 11px; text-transform: uppercase; color: #627d98; display: block;">From:</strong>
        <span style="font-size: 15px; font-weight: 600; color: #102a43;">${safeName} &lt;<a href="mailto:${safeEmail}" style="color: #0369a1;">${safeEmail}</a>&gt;</span>
      </div>
      <div style="margin-bottom: 14px;">
        <strong style="font-size: 11px; text-transform: uppercase; color: #627d98; display: block;">Subject:</strong>
        <span style="font-size: 15px; font-weight: 600; color: #102a43;">${safeSubject}</span>
      </div>
      <div style="margin-top: 20px;">
        <strong style="font-size: 11px; text-transform: uppercase; color: #627d98; display: block;">Message:</strong>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #102a43; border-radius: 6px; padding: 18px; margin-top: 6px; font-size: 14px; line-height: 1.6; color: #334e68;">
          ${safeMessage}
        </div>
      </div>
    </div>
    <div style="background: #f0f4f8; padding: 16px 30px; font-size: 12px; color: #627d98; text-align: center; border-top: 1px solid #e5e9ef;">
      Sent via CampusArge Contact Portal &bull; Hit <strong>Reply</strong> to respond directly to ${safeName}.
    </div>
  </div>
</body>
</html>`;

    const headers = [
      `Date: ${new Date().toUTCString()}`,
      `From: =?UTF-8?B?${Buffer.from(fromName).toString('base64')}?= <${fromEmail}>`,
      `To: ${recipients.join(', ')}`,
      `Reply-To: =?UTF-8?B?${Buffer.from(name).toString('base64')}?= <${email}>`,
      `Subject: =?UTF-8?B?${Buffer.from(emailSubject).toString('base64')}?=`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      `X-Mailer: CampusArge Dev Mailer`
    ];

    let mime = headers.join('\r\n') + '\r\n\r\n';
    mime += `--${boundary}\r\n`;
    mime += `Content-Type: text/plain; charset=UTF-8\r\n`;
    mime += `Content-Transfer-Encoding: base64\r\n\r\n`;
    mime += Buffer.from(textBody).toString('base64') + '\r\n';
    mime += `--${boundary}\r\n`;
    mime += `Content-Type: text/html; charset=UTF-8\r\n`;
    mime += `Content-Transfer-Encoding: base64\r\n\r\n`;
    mime += Buffer.from(htmlBody).toString('base64') + '\r\n';
    mime += `--${boundary}--\r\n.\r\n`;

    const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' }, () => {});

    let step = 0;
    socket.setEncoding('utf8');

    socket.on('data', (chunk) => {
      if (step === 0 && chunk.startsWith('220')) {
        step++;
        socket.write('EHLO localhost\r\n');
      } else if (step === 1 && chunk.includes('250')) {
        step++;
        socket.write('AUTH LOGIN\r\n');
      } else if (step === 2 && chunk.startsWith('334')) {
        step++;
        socket.write(Buffer.from(username).toString('base64') + '\r\n');
      } else if (step === 3 && chunk.startsWith('334')) {
        step++;
        socket.write(Buffer.from(password).toString('base64') + '\r\n');
      } else if (step === 4 && chunk.startsWith('235')) {
        step++;
        socket.write(`MAIL FROM:<${fromEmail}>\r\n`);
      } else if (step === 5 && chunk.startsWith('250')) {
        step++;
        socket.write(`RCPT TO:<${recipients[0]}>\r\n`);
      } else if (step === 6 && chunk.startsWith('250')) {
        step++;
        socket.write(`RCPT TO:<${recipients[1]}>\r\n`);
      } else if (step === 7 && chunk.startsWith('250')) {
        step++;
        socket.write('DATA\r\n');
      } else if (step === 8 && chunk.startsWith('354')) {
        step++;
        socket.write(mime);
      } else if (step === 9 && chunk.startsWith('250')) {
        step++;
        socket.write('QUIT\r\n');
        resolve({ success: true, message: 'Email sent successfully via Hostinger SMTP!' });
      } else if (chunk.startsWith('221')) {
        socket.end();
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });

    socket.setTimeout(15000, () => {
      socket.destroy();
      reject(new Error('SMTP timeout after 15s'));
    });
  });
}

