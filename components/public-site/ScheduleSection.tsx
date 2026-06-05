'use client';
import { Calendar, Clock, Users, FileCheck, Award, CheckCircle2, BookOpen } from 'lucide-react';

const schedule = [
  { day: 'Dushanba – Shanba', time: '09:00 – 18:00', label: 'Dars kunlari' },
  { day: 'Yakshanba', time: 'Dam olish', label: 'Hordiq kuni' },
];

const duration = [
  { icon: Clock, label: 'Kurs davomiyligi', value: '6 oy' },
  { icon: Users, label: 'Guruh o\'lchami', value: '8-12 kishi' },
  { icon: Calendar, label: 'Haftalik darslar', value: '3 kun' },
  { icon: BookOpen, label: 'Bir dars vaqti', value: '1.5 soat' },
];

const certConditions = [
  'Barcha darslarda kamida 80% qatnashish',
  'Amaliy ish (loyiha) muvaffaqiyatli topshirish',
  'Yakuniy imtihondan 70% va undan yuqori ball olish',
  'Kurs to\'lovlarini to\'liq amalga oshirish',
];

const examSteps = [
  { step: '01', title: 'Amaliy loyiha', desc: 'Kurs davomida o\'rganilgan ko\'nikmalar asosida real loyiha yaratiladi' },
  { step: '02', title: 'Nazariy test', desc: '30 ta savol, 45 daqiqa vaqt, minimal 70% ball zarur' },
  { step: '03', title: 'Sertifikat', desc: 'Muvaffaqiyatli o\'tganlar Online Academy sertifikatini qo\'lga kiritadi' },
];

export default function ScheduleSection() {
  return (
    <section id="schedule" className="section-padding" style={{ background: 'hsl(var(--muted))' }}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">
            <Calendar className="w-3.5 h-3.5" />
            Jadval
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dars vaqtlari va <span className="brand-gradient-text">imtihon jarayoni</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Qulay jadval, kichik guruhlar, amaliy ta&apos;lim
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand" /> Dars vaqtlari
              </h3>
              {schedule.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground text-sm">{s.day}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                  <span className={`text-sm font-bold ${s.time === 'Dam olish' ? 'text-muted-foreground' : 'text-brand'}`}>
                    {s.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {duration.map((d, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-4 text-center">
                  <d.icon className="w-5 h-5 text-brand mx-auto mb-2" />
                  <p className="text-lg font-bold text-foreground">{d.value}</p>
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Process */}
          <div className="lg:col-span-1 bg-card rounded-2xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand" /> Imtihon jarayoni
            </h3>
            <div className="space-y-5">
              {examSteps.map((e, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {e.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{e.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Conditions */}
          <div className="lg:col-span-1 bg-card rounded-2xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand" /> Sertifikat shartlari
            </h3>
            <div className="space-y-3 mb-6">
              {certConditions.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-brand to-brand-dark rounded-xl p-5 text-white">
              <Award className="w-8 h-8 mb-3 opacity-80" />
              <p className="font-bold text-lg mb-1">Online Academy</p>
              <p className="text-sm opacity-80">Sertifikati — ish beruvchilar tomonidan e&apos;tirof etilgan hujjat</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
