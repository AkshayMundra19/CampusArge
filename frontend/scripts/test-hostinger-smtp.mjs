import tls from 'node:tls';

const host = 'smtp.hostinger.com';
const port = 465;
const username = 'query@campusarge.com';
const password = 'Yashvardhan@_2027';

console.log(`Connecting to ${host}:${port} via TLS...`);

const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' }, () => {
  console.log('TLS connection established successfully!');
});

let step = 0;
socket.setEncoding('utf8');

socket.on('data', (data) => {
  console.log('<', data.trim());

  if (step === 0 && data.startsWith('220')) {
    step++;
    socket.write('EHLO localhost\r\n');
  } else if (step === 1 && data.includes('250')) {
    step++;
    socket.write('AUTH LOGIN\r\n');
  } else if (step === 2 && data.startsWith('334')) {
    step++;
    socket.write(Buffer.from(username).toString('base64') + '\r\n');
  } else if (step === 3 && data.startsWith('334')) {
    step++;
    socket.write(Buffer.from(password).toString('base64') + '\r\n');
  } else if (step === 4 && data.startsWith('235')) {
    console.log('Authentication Successful! Hostinger SMTP credentials verified.');
    step++;
    socket.write('QUIT\r\n');
  } else if (data.startsWith('221')) {
    socket.end();
  }
});

socket.on('error', (err) => {
  console.error('Socket error:', err);
});

socket.on('close', () => {
  console.log('Connection closed.');
  process.exit(0);
});

