'use client';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Phone, Send, Instagram, Globe, Download } from 'lucide-react';
import { useRef } from 'react';

const SITE_URL = 'https://online-two-iota.vercel.app';

const contacts = [
  { icon: Phone, label: 'Telefon', value: '+998 XX XXX XX XX', href: 'tel:+998XXXXXXXXX' },
  { icon: Send, label: 'Telegram', value: '@online_academy_uz', href: 'https://t.me/online_academy_uz' },
  { icon: Instagram, label: 'Instagram', value: '@online_academy_uz', href: 'https://instagram.com/online_academy_uz' },
  { icon: Globe, label: 'Sayt', value: 'online-two-iota.vercel.app', href: SITE_URL },
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
          {/* Map */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden" style={{ minHeight: '360px' }}>
            <div className="w-full h-full min-h-[360px] bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col items-center justify-center text-center p-8">
              <MapPin className="w-16 h-16 text-brand mb-4 animate-float" />
              <h3 className="text-white text-xl font-bold mb-2">Manzilimiz</h3>
              <p className="text-white/60 text-sm mb-4">Aniq manzil tez orada qo&apos;shiladi</p>
              <p className="text-white/80 text-sm max-w-xs">
                Google Maps koordinatangizni bersangiz, xaritani to&apos;g&apos;ridan-to&apos;g&apos;ri shu yerga embed qilamiz
              </p>
            </div>
          </div>

          {/* Contacts + QR */}
          <div className="space-y-4">
            {/* Contacts */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground mb-5">Kontakt ma&apos;lumotlar</h3>
              <div className="space-y-3">
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
                      <p className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center">
              <h3 className="font-bold text-foreground mb-4 text-center">Saytga QR kod orqali kiring</h3>
              <div className="bg-white p-4 rounded-xl mb-4">
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
