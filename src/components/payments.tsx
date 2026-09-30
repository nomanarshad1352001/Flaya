/* Payment brand marks as compact inline SVGs */

export function VisaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-label="Visa" role="img">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#e2e2e2" />
      <text x="24" y="20.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="800" fontSize="11" fill="#1a1f71" letterSpacing="0.5">
        VISA
      </text>
    </svg>
  );
}

export function MastercardLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-label="Mastercard" role="img">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#e2e2e2" />
      <circle cx="20" cy="15" r="8" fill="#eb001b" />
      <circle cx="28" cy="15" r="8" fill="#f79e1b" fillOpacity="0.9" />
    </svg>
  );
}

export function AmexLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-label="American Express" role="img">
      <rect width="48" height="30" rx="4" fill="#2e77bc" />
      <text x="24" y="13" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7.5" fill="#fff">
        AMERICAN
      </text>
      <text x="24" y="22" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7.5" fill="#fff">
        EXPRESS
      </text>
    </svg>
  );
}

export function PayPalLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-label="PayPal" role="img">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#e2e2e2" />
      <path d="M16 22.5 18.2 9.5h6.2c3 0 4.8 1.6 4.4 4-.5 3-2.9 4.6-5.9 4.6h-2.6l-.8 4.4H16Z" fill="#003087" />
      <path d="M20.4 22.5l.5-3.4h2.7c2.9 0 5.3-1.5 5.8-4.4.2-1.3-.2-2.4-1-3.2 1.4.7 2.2 2 1.9 3.7-.5 3-2.9 4.5-5.8 4.5H22l-.7 2.8h-.9Z" fill="#0070e0" opacity="0.85" transform="translate(3.4 0) scale(0.92)" />
    </svg>
  );
}

export function ApplePayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-label="Apple Pay" role="img">
      <rect width="48" height="30" rx="4" fill="#000" />
      <path
        d="M15.9 11.4c-.5.6-1.4 1-2.2 1-.1-.9.3-1.8.7-2.3.5-.6 1.4-1 2.1-1 .1.8-.2 1.7-.6 2.3Zm.6 1.1c-1.2-.1-2.3.7-2.9.7-.6 0-1.5-.6-2.4-.6-1.3 0-2.4.7-3 1.8-1.3 2.2-.3 5.5.9 7.3.6.9 1.3 1.9 2.2 1.9.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c.9 0 1.5-.9 2.1-1.8.6-.9.9-1.8.9-1.9 0 0-1.8-.7-1.9-2.8 0-1.7 1.4-2.6 1.5-2.6-.8-1.2-2-1.3-2-1.3Z"
        fill="#fff"
        transform="scale(0.85) translate(2.2 2.4)"
      />
      <text x="26" y="19.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="10" fill="#fff">
        Pay
      </text>
    </svg>
  );
}

export function GooglePayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={className} aria-label="Google Pay" role="img">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#e2e2e2" />
      <path d="M19.7 15.4v-1h4.1c0 .5-.1 1.1-.3 1.6-.5 1.5-1.8 2.5-3.8 2.5-2.3 0-4.1-1.9-4.1-4.2s1.8-4.2 4.1-4.2c1.2 0 2.2.5 2.9 1.3l-1.2 1.2c-.4-.4-1-.8-1.7-.8-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5c1 0 1.7-.5 2-1.1h-2Z" fill="#4285f4" />
      <path d="M32.9 12.6c-1.4 0-2.4.7-2.4 1.9 0 1.1.9 1.8 2 1.8 1.3 0 2.3-1 2.3-2.2v-.3c-.3-.1-1.1-.4-1.9-.4Zm-1-2.5c1 0 1.8.4 2.4 1.1V10h1.6v5.7c0 1.9-1.1 2.9-2.5 2.9-1.2 0-1.9-.8-2.2-1.4l1.4-.6c.2.4.6.7 1 .7.7 0 1.1-.5 1.1-1.2v-.3c-.5.5-1.2.8-2 .8-1.7 0-3-1.3-3-3.1 0-1.9 1.4-3.2 3.2-3.2Z" fill="#3c4043" transform="translate(-3.5 0)" />
      <path d="M40.2 10.6 38 14.1l-2-3.5h1.9l1.1 2.2 1.2-2.2h2Z" transform="translate(-2.5 1)" fill="#3c4043" />
    </svg>
  );
}

export function PaymentRow({ className, light = false }: { className?: string; light?: boolean }) {
  const logos = [VisaLogo, MastercardLogo, AmexLogo, PayPalLogo, ApplePayLogo, GooglePayLogo];
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      {logos.map((L, i) => (
        <span key={i} className={light ? "opacity-90" : ""}>
          <L className="h-5 w-8" />
        </span>
      ))}
    </div>
  );
}
