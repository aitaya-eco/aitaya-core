// Shared email rules for the waitlist. Files starting with "_" in /api are not deployed as endpoints.
// The page carries a copy of these rules (checkEmail in index.html); keep the two lists in step.
const dns = require('dns').promises

// Common misspellings of real providers. These are never valid sign-ups.
const TYPOS = {
  'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmai.com': 'gmail.com',
  'gmail.cm': 'gmail.com', 'gmail.om': 'gmail.com', 'gmali.com': 'gmail.com', 'gmaul.com': 'gmail.com',
  'gmil.com': 'gmail.com', 'gimail.com': 'gmail.com', 'gemail.com': 'gmail.com', 'g.mail.com': 'gmail.com',
  'yahoo.co': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'yhoo.com': 'yahoo.com', 'yahho.com': 'yahoo.com', 'yaoo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com', 'homail.com': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outlook.co': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.con': 'outlook.com',
  'icloud.co': 'icloud.com', 'iclod.com': 'icloud.com', 'icoud.com': 'icloud.com', 'icloud.con': 'icloud.com'
}
const BAD_TLD = { con: 'com', cmo: 'com', ocm: 'com', comm: 'com', coom: 'com', vom: 'com', xom: 'com', cpm: 'com', clm: 'com', cim: 'com', ccom: 'com' }
const DISPOSABLE = new Set(['mailinator.com', '10minutemail.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', 'yopmail.com',
  'temp-mail.org', 'tempmail.com', 'tempmail.net', 'tempmailo.com', 'throwawaymail.com', 'trashmail.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'fakeinbox.com', 'mintemail.com', 'emailondeck.com', 'tempail.com', 'moakt.com', 'mohmal.com', 'burnermail.io',
  'mailnesia.com', 'spamgourmet.com', 'mytemp.email', 'tempr.email', 'discard.email', 'mailcatch.com', 'inboxkitten.com', '33mail.com'])
const PLACEHOLDER = new Set(['example.com', 'example.org', 'example.net', 'test.com', 'email.email', 'domain.com', 'yourdomain.com', 'sample.com'])

function syntax (email) {
  const e = String(email || '').trim()
  if (e.length < 6 || e.length > 254) return null
  const at = e.lastIndexOf('@')
  if (at < 1) return null
  const local = e.slice(0, at)
  const domain = e.slice(at + 1).toLowerCase()
  if (local.length > 64) return null
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return null
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return null
  const labels = domain.split('.')
  if (labels.length < 2) return null
  for (const l of labels) {
    if (!l || l.length > 63 || !/^[a-z0-9-]+$/.test(l) || l.startsWith('-') || l.endsWith('-')) return null
  }
  const tld = labels[labels.length - 1]
  if (!/^([a-z]{2,24}|xn--[a-z0-9-]{2,59})$/.test(tld)) return null
  return { local, domain, tld }
}

// Rules every sign-up must pass before it is saved. Returns null when fine, or a short reason.
function problem (email) {
  const s = syntax(email)
  if (!s) return 'That email address isn’t complete.'
  if (TYPOS[s.domain]) return 'Did you mean ' + s.local + '@' + TYPOS[s.domain] + '?'
  if (BAD_TLD[s.tld]) return 'Did you mean ' + s.local + '@' + s.domain.slice(0, -s.tld.length) + BAD_TLD[s.tld] + '?'
  if (DISPOSABLE.has(s.domain)) return 'Please use an inbox you’ll actually check.'
  if (PLACEHOLDER.has(s.domain) || /^(your|you|name|email|test)@email\.com$/i.test(email)) return 'That looks like a placeholder address.'
  return null
}

// Does the domain accept mail at all? Fails open on slow or flaky DNS so real people are never blocked.
async function acceptsMail (domain) {
  const withTimeout = (p) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), 2500))])
  const gone = (err) => err && ['ENOTFOUND', 'ENODATA', 'NXDOMAIN'].includes(err.code)
  try {
    const mx = await withTimeout(dns.resolveMx(domain))
    if (mx && mx.some(r => r.exchange && r.exchange !== '.')) return true
    if (mx && mx.length) return false // null MX: the domain says it takes no mail
  } catch (err) {
    if (!gone(err)) return true
  }
  try { // no MX record: mail falls back to the domain's own address
    const a = await withTimeout(dns.resolve4(domain))
    return !!(a && a.length)
  } catch (err) {
    if (!gone(err)) return true
  }
  try {
    const aaaa = await withTimeout(dns.resolve6(domain))
    return !!(aaaa && aaaa.length)
  } catch (err) {
    return !gone(err)
  }
}

module.exports = { syntax, problem, acceptsMail }
