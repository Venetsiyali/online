'use client';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Phone, Send, Instagram, Globe, Download, Navigation } from 'lucide-react';
import { useRef } from 'react';

const SITE_URL = 'https://online-two-iota.vercel.app';

// Google Maps share link dan olingan lokatsiya
// share.google/CAMkUrpDoaYzBXtBS → Academy of Excellence, Toshkent
const GOOGLE_MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.8!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzU4LjIiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1suz!2suz!4v1718200000000!5m2!1suz!2suz';

const GOOGLE_MAPS_LINK = 'https://share.google/CAMkUrpDoaYzBXtBS';

const contacts = [
  { icon: MapPin,    label: 'Manzil',    value: 'Toshkent, O\'zbekiston',       href: GOOGLE_MAPS_LINK },
  { icon: Phone,     label: 'Telefon',   value: '+998 XX XXX XX XX',           href: 'tel:+998XXXXXXXXX' },
  { icon: Send,      label: 'Telegram',  value: '@online_academy_uz',          href: 'https://t.me/online_academy_uz' },
  { icon: Instagram, label: 'Instagram', value: '@online_academy_uz',          href: 'https://instagram.com/online_academy_uz' },
  { icon: Globe,     label: 'Sayt',      value: 'online-two-iota.vercel.app',  href: SITE_URL },
];

export default function LocationSection() {
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'online-academy-qr.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="contact" className="section-padding" style={{ background: 'hsl(var(--muted))' }}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">
            <MapPin className="w-3.5 h-3.5" />
            Manzil va Aloqa
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Biz bilan <span className="brand-gradient-text">bog&apos;laning</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Bepul konsultatsiya uchun murojaat qiling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Google Maps Embed */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-border shadow-md" style={{ minHeight: '400px' }}>
            {/* Map header */}
            <div className="bg-card px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand" />
                <span className="font-semibold text-foreground text-sm">Manzilimiz</span>
              </div>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-brand hover:underline font-medium"
              >
                <Navigation className="w-3.5 h-3.5" />
                Yo&apos;l topish
              </a>
            </div>

            {/* Iframe embed */}
            <iframe
              src={GOOGLE_MAPS_EMBED}
              width="100%"
              height="360"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Academy of Excellence - Manzil"
            />

            {/* Clickable banner under map */}
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-brand/5 hover:bg-brand/10 transition-colors border-t border-border group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                  Academy of Excellence — O&apos;quv markazi
                </p>
                <p className="text-xs text-muted-foreground">
                  Google Maps orqali yo&apos;nalish olish uchun bosing
                </p>
              </div>
              <Navigation className="w-4 h-4 text-brand opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Contacts + QR */}
          <div className="space-y-4">
            {/* Contacts */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground mb-5">Kontakt ma&apos;lumotlar</h3>
              <div className="space-y-2">
                {contacts.map((c, i) => (
                  <a
                    key={i}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <c.icon className="w-4 h-4 text-brand" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                      <p className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                        {c.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center">
              <h3 className="font-bold text-foreground mb-4 text-center">
                Saytga QR kod orqali kiring
              </h3>
              <div className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                <QRCodeSVG
                  ref={qrRef}
                  value={SITE_URL}
                  size={140}
                  fgColor="#E63946"
                  bgColor="#ffffff"
                  level="M"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mb-4">
                Telefoningiz kamerasini ushlatib, saytga o&apos;ting
              </p>
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
              >
                <Download className="w-4 h-4" />
                QR yuklab olish
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
