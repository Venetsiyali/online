export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getDb } from '@/lib/db';
import type { Announcement, Locale } from '@/lib/types';
import { localizeAnnouncement } from '@/lib/types';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import { Toaster } from '@/components/ui/sonner';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar } from 'lucide-react';

export default async function AnnouncementDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'announcements' });
  const sql = getDb();

  const rows = await sql`SELECT * FROM announcements WHERE id=${id} AND is_published=true LIMIT 1`;
  if (rows.length === 0) notFound();

  const ann = rows[0] as Announcement;
  const loc = locale as Locale;
  const localized = localizeAnnouncement(ann, loc);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Toaster />

      <div className="bg-[#0F172A] pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href={`/${locale}/announcements`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </a>
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-3">
            <Calendar className="w-4 h-4" />
            <span>
              {t('published_on')} {formatDate(ann.created_at, locale)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {localized.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
              {localized.content}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <a
            href={`/${locale}/announcements`}
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-600 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
