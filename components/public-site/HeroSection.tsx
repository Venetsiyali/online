'use client';
import { ArrowRight, Play, GraduationCap, Users, Award } from 'lucide-react';
import { useState } from 'react';

const stats = [
  { icon: Users, value: '100+', label: 'O\'quvchilar' },
  { icon: GraduationCap, value: '2', label: 'Kurs yo\'nalishi' },
  { icon: Award, value: '6 oy', label: 'Kurs davomiyligi' },
];

export default function HeroSection() {
  const [playing, setPlaying] = useState(false);
  const PROMO_VIDEO_ID = 'dwQbWkDCk40';

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a0a0f 50%, #0d1117 100%)' }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: '#E63946' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-8" style={{ background: '#E63946' }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(230,57,70,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              Ro&apos;yxatdan o&apos;tish ochiq
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Kelajagingizni
              <br />
              <span style={{ background: 'linear-gradient(135deg, #E63946, #ff8a94)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                dizayn qiling
              </span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
              <strong className="text-white">Online Academy</strong> — Kamolova Fazilat tomonidan yaratilgan 
              professional o&apos;quv markazi. CorelDRAW va Kompyuter savodxonligi kurslarini o&apos;rganing.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#contact"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #E63946, #c1121f)', boxShadow: '0 8px 32px rgba(230,57,70,0.4)' }}
              >
                Ro&apos;yxatdan o&apos;tish <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-white ml-0.5" />
                </div>
                Videoni ko&apos;rish
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-black text-white mb-0.5">{s.value}</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Video/Visual */}
          <div className="relative flex items-center justify-center">
            <div
              className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
              onClick={() => setPlaying(true)}
              style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}
            >
              <img
                src={`https://img.youtube.com/vi/${PROMO_VIDEO_ID}/hqdefault.jpg`}
                alt="Online Academy promo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-glow"
                  style={{ background: 'linear-gradient(135deg, #E63946, #c1121f)' }}
                >
                  <Play className="w-9 h-9 text-white ml-1" />
                </div>
              </div>
              {/* Badge */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <p className="text-white text-xs font-semibold">CorelDRAW darsi — 1-dars</p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3 border border-gray-100 dark:border-gray-700 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Sertifikat</p>
                  <p className="text-xs text-gray-400">6 oyda oling</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3 border border-gray-100 dark:border-gray-700" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">300,000 so&apos;m</p>
                  <p className="text-xs text-gray-400">oyiga</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video modal */}
      {playing && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPlaying(false)}
        >
          <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <div className="video-container rounded-2xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${PROMO_VIDEO_ID}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Online Academy promo"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
