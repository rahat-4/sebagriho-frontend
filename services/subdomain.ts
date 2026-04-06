export function getSubdomain() {
    if (typeof window === "undefined") return null;
    
    const hostname = window.location.hostname;
    
    // Case 1: localhost
    if (hostname === "localhost") {
        return process.env.NEXT_PUBLIC_SUBDOMAIN || null;
    }

    const parts = hostname.split(".");

    // Case 2: nesa.subdomain.com
    if (parts.length >= 3) {
        return parts[0]; // "nesa"
        }
    
    return null;
}