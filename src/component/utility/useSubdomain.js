// src/hooks/useSubdomain.js
export function useSubdomain() {
  const hostname = window.location.hostname;

  // Ignore localhost, 127.0.0.1
  // if (hostname === 'localhost' || hostname === '127.0.0.1') return null;

  const parts = hostname.split('.');

  // Ignore www
  if (parts.length > 2 && parts[0] !== 'www') {
    const subdomain = parts[0].toLowerCase().trim();

    // Ignore empty or invalid subdomains
    if (!subdomain || subdomain.length < 2) return null;

    return subdomain;
  }

  return null;
}