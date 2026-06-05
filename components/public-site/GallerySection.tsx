'use client';
import { useState } from 'react';
import { Image, Play, X } from 'lucide-react';

const gallery = [
  { id: 1, label: 'Dars jarayoni', emoji: '🎨', color: 'from-rose-400 to-red-600', desc: 'CorelDRAW amaliy mashg\'uloti' },
  { id: 2, label: 'Kompyuter sinfi', emoji: '💻', color: 'from-blue-400 to-blue-700', desc: 'Zamonaviy jihozlangan sinfxona' },
  { id: 3, label: 'Guruh darsi', emoji: '👥', color: 'from-purple-400 to-purple-700', desc: 'Kichik guruhda intensiv o\'qish' },
  { id: 4, label: 'Loyiha taqdimoti', emoji: '🖥️', color: 'from-amber-400 to-orange-600', desc: 'O\'quvchilar loyihalari taqdimoti' },
  { id: 5, label: 'Sertifikat topshirish', emoji: '🏆', color: 'from-green-400 to-emerald-700', desc: 'Bitiruvchilarga sertifikat berish marosimi' },
  { id: 6, label: 'Individual mashq', emoji: '📐', color: 'from-cyan-400 to-teal-700', desc: 'Shaxsiy mashg\'ulot va muammolarni hal qilish' },
];

export default function GallerySection() {
  const [selected, setSelected] = useState<typeof gallery[0] | null>(null);

  return (
    <section id="gallery" className="section-padding" style={{ background: 'hsl(var(--muted))' }}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">
            <Image className="w-3.5 h-3.5" />
            Galereya
          </span>
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
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} flex flex-col items-center justify-center`}>
                <span className="text-5xl mb-3">{item.emoji}</span>
                <p className="text-white font-semibold text-sm px-4 text-center">{item.label}</p>
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-10 h-10 text-white" />
              </div>
            </button>
          ))}
        </div>

        {/* Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-card rounded-2xl border border-border p-8 max-w-md w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className={`w-full h-48 rounded-xl bg-gradient-to-br ${selected.color} flex items-center justify-center mb-6`}>
                <span className="text-7xl">{selected.emoji}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{selected.label}</h3>
              <p className="text-muted-foreground">{selected.desc}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
