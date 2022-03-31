function buf2hex(buffer) {
  const u = new Uint8Array(buffer)
  const a = new Array(u.length)
  let i = u.length
  while (i--) {
    a[i] = (u[i] < 16 ? "0" : "") + u[i].toString(16)
  }
  return a.join("")
}

export default async function (str) {
  if (process.client) {
    const enc = new TextEncoder()
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(str))
    return buf2hex(buf).substr(0, 7).toLowerCase()
  } else {
    const crypto = require("crypto")
    const hash = crypto.createHash("sha256")
    hash.update(str)
    return hash.digest("hex").substr(0, 7).toLowerCase()
  }
}
