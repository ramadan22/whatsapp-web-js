const express = require('express')
const app = express()
const port = 3000
const qrcode = require('qrcode-terminal');

// const { Client, Location, Poll, List, Buttons, LocalAuth } = require('./index');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
  // proxyAuthentication: { username: 'username', password: 'password' },
  puppeteer: {
    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
    headless: true
  }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
  console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  // console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED', session);
});

client.on('auth_failure', msg => {
  // Fired if session restore was unsuccessful
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  console.log('READY');
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api', async (req, res) => {
  let tujuan = req.query.tujuan;
  let pesan = req.query.pesan;

  // res.json({
  //   test: 'here',
  // });

  let cekUser = await client.isRegisteredUser(`${tujuan}@c.us`);

  if (cekUser) {
    // client.sendMessage(`${tujuan}@c.us`, pesan);
    res.json({
      status: true,
      pesan,
    });
  } else {
    res.json({
      status: false,
    });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})