// import { randomBytes, createCipheriv } from 'crypto';

// function print(name: string, text: string) {
//   console.log()
//   console.log(`;;;;;;;;;;;;;;;;;;;;;;;;;;${name};;;;;;;;;;;;;;;;;;;;;;;;;;;`)
//   console.log(text)
//   console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
//   console.log()
// }

// export function generateToken(): string {
//   print('generate TOken', 'in generateToken')
//   const nonce = '1234567890123456';

//   print('nonce', nonce)

//   const dateString = new Date().toISOString().replace('Z', '');
//   const text = `${'Telegram-mini'}&${'request-type'}&${dateString}&${nonce}`;

//   print('text', text)


//   const iv = randomBytes(16);

//   print('iv', iv.toString('base64'))

//   const key = '541f5285b0011d2e1668e89877f3edfc'

//   print('key', key)

//   // create cipher using the key and IV
//   const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);

//   print('cipher', '')

//   // updating text
//   let encrypted = cipher.update(text, 'utf8', 'base64');

//   print('encrypted', encrypted)

//   // Using concatenation
//   encrypted += cipher.final('base64');

//   print('encrypted', encrypted)

//   // Concatenate the IV and the encrypted data
//   const result = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);

//   print('result', result.toString('base64'))

//   return result.toString('base64');

// }

export async function generateToken(): Promise<string> {
  const nonce = '1234567890123456';
  const dateString = new Date().toISOString().replace('Z', '');
  const text = `${'Telegram-mini'}&${'request-type'}&${dateString}&${nonce}`;

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode('6e4f231a432f98ac21b48a7dcb167834'),
    "AES-CBC",
    false,
    ["encrypt", "decrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv,
    },
    keyMaterial,
    new TextEncoder().encode(text)
  );

  const result = new Uint8Array(encrypted.byteLength + iv.byteLength);
  result.set(new Uint8Array(encrypted), iv.length);
  result.set(iv, 0);

  return btoa(String.fromCharCode(...new Uint8Array(result)));
}

// console.log(generateToken())
