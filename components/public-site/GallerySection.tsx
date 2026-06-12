'use client';
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const gallery = [
  {
    id: 1,
    label: 'Dars jarayoni',
    emoji: '🎨',
    desc: 'CorelDRAW va matematik darslar jarayoni — amaliy mashg\'ulot',
    img: '/images/academy-classroom.jpg',
    color: 'from-rose-400 to-red-600',
  },
  {
    id: 2,
    label: 'Kompyuter sinfi',
    emoji: '💻',
    desc: 'Zamonaviy jihozlangan kompyuter sinfxonasi',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    color: 'from-blue-400 to-blue-700',
  },
  {
    id: 3,
    label: 'Guruh darsi',
    emoji: '👥',
    desc: 'Kichik guruhda intensiv o\'qish va amaliy mashg\'ulot',
    img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
    color: 'from-purple-400 to-purple-700',
  },
  {
    id: 4,
    label: 'Loyiha taqdimoti',
    emoji: '🖥️',
    desc: 'O\'quvchilar yakuniy loyihalarini taqdimot qiladi',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    color: 'from-amber-400 to-orange-600',
  },
  {
    id: 5,
    label: 'Sertifikat topshirish',
    emoji: '🏆',
    desc: 'Bitiruvchilarga sertifikat berish marosimi',
    img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    color: 'from-green-400 to-emerald-700',
  },
  {
    id: 6,
    label: 'Individual mashq',
    emoji: '📐',
    desc: 'Shaxsiy mashg\'ulot va muammolarni hal qilish',
    img: '/images/academy-entrance.jpg',
    color: 'from-cyan-400 to-teal-700',
  },
];

export default function GallerySection() {
  const [selected, setSelected] = useState<typeof gallery[0] | null>(null);

  return (
    <section id="gallery" className="section-padding" style={{ background: 'hsl(var(--muted))' }}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">📸 Galereya</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O&apos;quv markazidan <span className="brand-gradient-text">lavhalar</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Dars jarayonlari, bitiruvchilar va o&apos;quv muhiti bilan tanishing
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Real image */}
              <img
                src={item.img}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // fallback to gradient if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              {/* Gradient fallback + overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-0`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
                <div className="text-left">
                  <span className="text-lg">{item.emoji}</span>
                  <p className="text-white font-semibold text-sm leading-tight">{item.label}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card rounded-2xl border border-border overflow-hidden max-w-2xl w-full relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Large image */}
            <div className="relative aspect-video bg-slate-900">
              <img
                src={selected.img}
                alt={selected.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${selected.color} -z-10 flex items-center justify-center`}>
                <span className="text-8xl">{selected.emoji}</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selected.emoji}</span>
                <h3 className="text-xl font-bold text-foreground">{selected.label}</h3>
              </div>
              <p className="text-muted-foreground">{selected.desc}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
