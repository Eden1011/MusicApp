import { scryptSync, randomBytes, createCipheriv, createDecipheriv } from "crypto";

const algorithm = 'aes-256-cbc'
const key = scryptSync(process.env.DB_PROJECT_ENCRYPTION_KEY || "placeholder_key", 'salt', 32);

export function encrypt(text: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(algorithm, key, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = createDecipheriv(algorithm, key, iv)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString()
}
