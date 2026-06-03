'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Award, Download, ArrowLeft, CheckCircle2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Locale } from '@/lib/types';

interface CertData {
  id: string;
  certificate_number: string;
  full_name: string;
  issued_at: string;
  courses: { title_uz: string; title_ru: string; title_en: string } | null;
}

export default function CertificatePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push(`/${locale}/login`); return; }

    fetch(`/api/certificate/${courseId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.certificate) {
          setCert(data.certificate);
        } else {
          setError(locale === 'uz' ? 'Sertifikat topilmadi. Barcha darslarni bajaring.' : locale === 'ru' ? 'Сертификат не найден. Завершите все уроки.' : 'Certificate not found. Complete all lessons first.');
        }
        setLoading(false);
      })
      .catch(() => { setError('Error'); setLoading(false); });
  }, [user, authLoading, courseId, locale, router]);

  const handlePrint = () => window.print();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const courseTitle = cert?.courses
    ? (cert.courses[`title_${locale}` as keyof typeof cert.courses] || cert.courses.title_en)
    : '';

  const issuedDate = cert
    ? new Date(cert.issued_at).toLocaleDateString(
        locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : '';

  const L = {
    uz: { back: 'Kursga qaytish', download: 'PDF yuklash', certTitle: 'Muvaffaqiyat sertifikati', certText: 'Ushbu sertifikat', certText2: 'kursini muvaffaqiyatli tamomlagan', certText3: 'shaxsga berildi', issued: 'Berilgan sana', certNum: 'Sertifikat raqami' },
    ru: { back: 'К курсу', download: 'Скачать PDF', certTitle: 'Сертификат об окончании', certText: 'Настоящий сертификат удостоверяет, что', certText2: 'успешно прошёл(а) курс', certText3: '', issued: 'Дата выдачи', certNum: 'Номер сертификата' },
    en: { back: 'Back to Course', download: 'Download PDF', certTitle: 'Certificate of Completion', certText: 'This certifies that', certText2: 'has successfully completed the course', certText3: '', issued: 'Date Issued', certNum: 'Certificate Number' },
  }[locale] ?? { back: 'Back', download: 'Download PDF', certTitle: 'Certificate', certText: 'This certifies that', certText2: 'completed', certText3: '', issued: 'Issued', certNum: 'Certificate No.' };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .cert-wrapper { box-shadow: none !important; margin: 0 !important; }
        }
        @page { size: A4 landscape; margin: 0; }
      `}</style>

      <div className="min-h-screen bg-slate-100 flex flex-col">
        <div className="no-print bg-[#0F172A] py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push(`/${locale}/courses/${courseId}/learn`)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {L.back}
            </button>
            {cert && (
              <Button onClick={handlePrint} variant="gold" size="sm" className="gap-2">
                <Download className="w-4 h-4" /> {L.download}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          {error ? (
            <div className="text-center">
              <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">{error}</p>
              <Button className="mt-4" variant="gold" onClick={() => router.push(`/${locale}/courses/${courseId}/learn`)}>
                {L.back}
              </Button>
            </div>
          ) : cert ? (
            <div className="cert-wrapper w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

              <div className="p-10 sm:p-14 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <GraduationCap className="w-96 h-96 text-amber-500" />
                </div>

                <div className="text-center mb-8 relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl shadow-lg mb-4">
                    <GraduationCap className="w-9 h-9 text-white" />
                  </div>
                  <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase mb-2">
                    Online<span className="text-amber-500">Academy</span>
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{L.certTitle}</h1>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-slate-200" />
                  <Award className="w-5 h-5 text-amber-500" />
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="text-center space-y-4 relative">
                  <p className="text-slate-500 text-lg">{L.certText}</p>
                  <p className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">{cert.full_name}</p>
                  <p className="text-slate-500 text-lg">{L.certText2}</p>
                  <p className="text-2xl font-bold text-amber-600">{courseTitle}</p>
                  {L.certText3 && <p className="text-slate-500">{L.certText3}</p>}
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left">
                    <div className="w-32 h-px bg-slate-300 mb-1" />
                    <p className="text-xs text-slate-400">{L.issued}</p>
                    <p className="text-sm font-semibold text-slate-700">{issuedDate}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-amber-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{L.certNum}</p>
                    <p className="text-xs font-mono font-bold text-slate-600">{cert.certificate_number}</p>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="w-32 h-px bg-slate-300 mb-1 ml-auto" />
                    <p className="text-xs text-slate-400">OnlineAcademy</p>
                    <p className="text-sm font-semibold text-slate-700">online-two-iota.vercel.app</p>
                  </div>
                </div>
              </div>

              <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400" />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
