'use client';
import { useState } from 'react';
import { MessageSquare, Star, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Aziza Xoliqova',
    course: 'CorelDRAW Grafik Dizayn',
    rating: 5,
    text: 'Online Academy da CorelDRAW kursini tamomlagandan keyin o\'z biznesim uchun logo va reklama materiallarini o\'zim yarata boshladim. Kamolova Fazilat juda yaxshi tushuntiradi!',
    initials: 'AX',
    color: 'from-pink-400 to-rose-600',
  },
  {
    name: 'Bobur Toshmatov',
    course: 'Kompyuter Savodxonligi',
    rating: 5,
    text: 'Kompyuter savodxonligi kursidan keyin ish topishga yordam berdi. Excel va Word ni mukammal o\'rgandim. Kurs narxi juda qulay, 300,000 so\'m oyiga.',
    initials: 'BT',
    color: 'from-blue-400 to-indigo-600',
  },
  {
    name: 'Maftuna Karimova',
    course: 'CorelDRAW Grafik Dizayn',
    rating: 5,
    text: 'Avval dizayn haqida hech narsa bilmagan edim. 6 oylik kursdan keyin endi freelance loyihalar qabul qilyapman. Platforma mukammal, darslar sifatli!',
    initials: 'MK',
    color: 'from-purple-400 to-violet-600',
  },
  {
    name: 'Jasur Rahimov',
    course: 'CorelDRAW Grafik Dizayn',
    rating: 5,
    text: 'Kamolova Fazilat ning darslari boshqa kurslarga qaraganda ancha professional. Har bir darsda yangi narsalar o\'rganasan. Sertifikat ham olish qiyin emas.',
    initials: 'JR',
    color: 'from-amber-400 to-orange-600',
  },
  {
    name: 'Nilufar Saidova',
    course: 'Kompyuter Savodxonligi',
    rating: 5,
    text: 'Pensiyaga chiqqanman lekin kompyuterdan foydalaninolmay qiynalyotgan edim. Shu kurs yordamida hamma narsani o\'rgandim. Rahmat Online Academy!',
    initials: 'NS',
    color: 'from-teal-400 to-cyan-600',
  },
];

const videoTestimonials = [
  { title: 'Aziza — 6 oy, CorelDRAW', videoId: 'dwQbWkDCk40' },
  { title: 'Bobur — Kompyuter kursi', videoId: 'iKYYDQpP7QA' },
];

export default function TestimonialsSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="testimonials" className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">
            <MessageSquare className="w-3.5 h-3.5" />
            Bitiruvchilar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O&apos;quvchilarimiz <span className="brand-gradient-text">fikrlari</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Bitiruvchilarimiz hayotida qanday o&apos;zgarishlar bo&apos;ldi
          </p>
        </div>

        {/* Video testimonials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          {videoTestimonials.map((v, i) => (
            <div
              key={i}
              className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group bg-muted border border-border"
              onClick={() => setActiveVideo(v.videoId)}
            >
              <img
                src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                alt={v.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center animate-pulse-glow">
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
                <p className="text-white font-semibold text-sm">{v.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Text testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visible.map((t, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 card-hover">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-5 text-sm">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === page ? 'bg-brand w-6' : 'bg-border'}`}
              />
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end mb-3">
              <button onClick={() => setActiveVideo(null)} className="text-white/60 hover:text-white">
                <X className="w-7 h-7" />
              </button>
            </div>
            <div className="video-container rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Testimonial video"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
