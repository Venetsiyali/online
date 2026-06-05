'use client';
import { Star, Linkedin, Instagram } from 'lucide-react';

export default function LeadershipSection() {
  return (
    <section id="leadership" className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">
            <Star className="w-3.5 h-3.5" />
            Rahbariyat
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Platformani <span className="brand-gradient-text">yaratuvchisi</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Photo side */}
              <div className="relative bg-gradient-to-br from-brand to-brand-dark p-10 flex flex-col items-center justify-center min-h-[340px]">
                {/* Avatar */}
                <div className="w-36 h-36 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mb-5 text-white text-5xl font-bold">
                  KF
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Kamolova Fazilat</h3>
                <p className="text-white/80 text-sm mb-6">Direktor va Bosh O&apos;qituvchi</p>
                <div className="flex gap-3">
                  <a href="#" className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                </div>
                {/* Decorative */}
                <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-white/5" />
                <div className="absolute bottom-6 left-6 w-16 h-16 rounded-full bg-white/5" />
              </div>

              {/* Info side */}
              <div className="p-10 flex flex-col justify-center">
                <div className="space-y-4 mb-8">
                  <p className="text-muted-foreground leading-relaxed">
                    Kamolova Fazilat — <strong className="text-foreground">Online Academy</strong> platformasini yaratuvchisi va bosh o&apos;qituvchisi. 
                    CorelDRAW sohasida ko&apos;p yillik tajribaga ega mutaxassis.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    U o&apos;z bilim va tajribasini o&apos;quvchilar bilan ulashish maqsadida bu platformani yaratdi. 
                    Har bir dars Kamolova Fazilat tomonidan shaxsan tayyorlangan.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Tajriba', value: '5+ yil' },
                    { label: 'O\'quvchilar', value: '100+' },
                    { label: 'Kurslar', value: '2 ta' },
                    { label: 'Sertifikatlar', value: 'Beriladi' },
                  ].map((s, i) => (
                    <div key={i} className="bg-muted rounded-xl p-4">
                      <p className="text-xl font-bold text-brand">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
