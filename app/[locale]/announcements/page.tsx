export const dynamic = 'force-dynamic';
import { getTranslations } from 'next-intl/server';
import { getDb } from '@/lib/db';
import type { Announcement, Locale } from '@/lib/types';
import { localizeAnnouncement } from '@/lib/types';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import AnnouncementCard from '@/components/public-site/AnnouncementCard';
import { Toaster } from '@/components/ui/sonner';

export default async function AnnouncementsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'announcements' });
  const sql = getDb();

  const rows = await sql`SELECT * FROM announcements WHERE is_published=true ORDER BY created_at DESC`;

  const announcements = rows as Announcement[];
  const loc = locale as Locale;
  const localized = announcements.map((a) => localizeAnnouncement(a, loc));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Toaster />

      <div className="bg-[#0F172A] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('title')}</h1>
          <p className="text-slate-400 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {localized.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400">{t('no_announcements')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localized.map((ann) => (
              <AnnouncementCard
                key={ann.id}
                announcement={ann}
                readMoreLabel={t('read_more')}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
