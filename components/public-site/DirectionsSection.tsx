'use client';
import { GraduationCap, Palette, Calculator, Clock, Award, ChevronRight, UserCircle2 } from 'lucide-react';

const directions = [
  {
    icon: Palette,
    color: '#E63946',
    bg: 'rgba(230,57,70,0.08)',
    title: 'CorelDRAW Grafik Dizayn',
    desc: 'Vektor grafika, logo yaratish, reklama materiallari va professional dizayn asoslarini o\'rganing. Kamolova Fazilat tayyorlagan.',
    duration: '6 oy',
    price: '300,000 so\'m/oy',
    cert: 'Sertifikat beriladi',
    skills: ['Vektor grafika', 'Logo dizayn', 'Reklama materiallari', 'Rang nazariyasi', 'Tipografiya'],
    level: 'Boshlang\'ich - O\'rta',
    teacher: 'Kamolova Fazilat',
  },
  {
    icon: Calculator,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    title: '9-sinf Matematika',
    desc: '9-sinf imtihon savollari yechimlari: algebra, geometriya, trigonometriya, progressiyalar, ehtimollik va boshqa barcha boblar.',
    duration: '6 oy',
    price: '300,000 so\'m/oy',
    cert: 'Sertifikat beriladi',
    skills: ['Algebra', 'Trigonometriya', 'Progressiyalar', 'Kombinatorika', 'Ko\'rsatkichli tenglamalar'],
    level: '9-sinf o\'quvchilari',
    teacher: 'Salomov Furqat',
  },
];

export default function DirectionsSection() {
  return (
    <section id="directions" className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">
            <GraduationCap className="w-3.5 h-3.5" />
            Yo&apos;nalishlar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bizning <span className="brand-gradient-text">kurslarimiz</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Har bir kurs amaliy ko&apos;nikmalar beradi va ish bozorida qo&apos;l keladi
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {directions.map((dir, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border bg-card p-8 card-hover overflow-hidden"
            >
              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: dir.color }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: dir.bg }}
              >
                <dir.icon className="w-7 h-7" style={{ color: dir.color }} />
              </div>

              {/* Content */}
              <div className="mb-6">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: dir.bg, color: dir.color }}>
                    {dir.level}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <UserCircle2 className="w-3.5 h-3.5" />
                    {(dir as typeof directions[0]).teacher}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{dir.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{dir.desc}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {dir.skills.map((s, si) => (
                  <span key={si} className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-medium">
                    {s}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" /> {dir.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: dir.color }}>
                    <Award className="w-4 h-4" /> {dir.cert}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Oylik to&apos;lov</p>
                  <p className="text-lg font-bold text-foreground">{dir.price}</p>
                </div>
              </div>

              {/* CTA */}
              <a
                href="#contact"
                className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{ background: dir.bg, color: dir.color }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = dir.color;
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = dir.bg;
                  (e.currentTarget as HTMLElement).style.color = dir.color;
                }}
              >
                Ro&apos;yxatdan o&apos;tish <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
