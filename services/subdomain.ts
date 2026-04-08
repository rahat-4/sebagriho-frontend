export function getSubdomain() {
    if (typeof window === "undefined") return null;

    const hostname = window.location.hostname;

    console.log("Determining subdomain from hostname:", window.location);

    console.log("Current hostname:", hostname);

    // Case 1: localhost (dev)
    if (hostname === "localhost") {
        return process.env.NEXT_PUBLIC_SUBDOMAIN || null;
    }

    const parts = hostname.split(".");

    // Handle common cases safely
    if (parts.length <= 2) {
        // example.com → no subdomain
        return null;
    }

    // Handle domains like example.co.uk (optional improvement)
    const tlds = ["co.uk", "com.bd", "org.bd"]; // extend if needed
    const domain = parts.slice(-2).join(".");
    const lastThree = parts.slice(-3).join(".");

    if (tlds.includes(lastThree)) {
        // e.g. something.example.co.uk
        return parts.length > 3 ? parts[0] : null;
    }

    // Default: subdomain exists
    return parts[0];
}