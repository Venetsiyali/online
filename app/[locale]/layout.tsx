import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { routing } from '@/i18n/routing';
import { authOptions } from '@/lib/auth';
import { AuthProvider } from '@/components/providers/AuthProvider';
import SessionProvider from '@/components/providers/SessionProvider';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: {
      default: `OnlineAcademy — ${t('title')}`,
      template: '%s | OnlineAcademy',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as 'uz' | 'ru' | 'en')) {
    notFound();
  }

  const [messages, session] = await Promise.all([
    getMessages(),
    getServerSession(authOptions),
  ]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={session}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
