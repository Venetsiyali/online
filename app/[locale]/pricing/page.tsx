export const dynamic = 'force-dynamic';
import { getTranslations } from 'next-intl/server';
import { getDb } from '@/lib/db';
import type { PricingPlan, Locale } from '@/lib/types';
import { localizePricingPlan } from '@/lib/types';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import PricingCard from '@/components/public-site/PricingCard';
import { Toaster } from '@/components/ui/sonner';
import { Check, Tag } from 'lucide-react';

export default async function PricingPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const sql = getDb();

  const rows = await sql`SELECT * FROM pricing_plans WHERE is_active=true ORDER BY price`;

  const plans = rows as PricingPlan[];
  const loc = locale as Locale;
  const localizedPlans = plans.map((p) => localizePricingPlan(p, loc));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Toaster />

      <div className="bg-[#0F172A] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-4">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {localizedPlans.length === 0 ? (
          <p className="text-center text-slate-400 py-12">{t('no_plans')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {localizedPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                perMonthLabel={t('per_month')}
                popularLabel={t('most_popular')}
                ctaLabel={t('get_started')}
                locale={locale}
              />
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">All Plans Include</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              'Access to all free courses',
              '3 language support (UZ, RU, EN)',
              'Course completion certificates',
              'Mobile-friendly platform',
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm text-center"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-slate-700 text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
