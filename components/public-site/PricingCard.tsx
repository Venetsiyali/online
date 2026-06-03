import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { LocalizedPricingPlan } from '@/lib/types';

interface PricingCardProps {
  plan: LocalizedPricingPlan;
  perMonthLabel: string;
  popularLabel: string;
  ctaLabel: string;
  locale: string;
}

export default function PricingCard({
  plan,
  perMonthLabel,
  popularLabel,
  ctaLabel,
  locale,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        plan.is_popular
          ? 'bg-[#0F172A] text-white shadow-xl ring-2 ring-amber-500'
          : 'bg-white border border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Popular badge */}
      {plan.is_popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-amber-500 text-white border-0 px-4 py-1 text-xs font-bold gap-1">
            <Star className="w-3 h-3 fill-white" />
            {popularLabel}
          </Badge>
        </div>
      )}

      {/* Name */}
      <h3
        className={`text-xl font-bold mb-2 ${
          plan.is_popular ? 'text-white' : 'text-slate-900'
        }`}
      >
        {plan.name}
      </h3>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-4xl font-bold ${
              plan.is_popular ? 'text-amber-400' : 'text-[#0F172A]'
            }`}
          >
            {plan.price === 0 ? 'Free' : formatPrice(plan.price, plan.currency)}
          </span>
          {plan.price > 0 && (
            <span
              className={`text-sm ${
                plan.is_popular ? 'text-slate-400' : 'text-slate-400'
              }`}
            >
              {perMonthLabel}
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div
              className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                plan.is_popular ? 'bg-amber-500' : 'bg-green-100'
              }`}
            >
              <Check
                className={`w-3 h-3 ${
                  plan.is_popular ? 'text-white' : 'text-green-600'
                }`}
              />
            </div>
            <span
              className={`text-sm ${
                plan.is_popular ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a href={`/${locale}/courses`}>
        <Button
          variant={plan.is_popular ? 'gold' : 'outline'}
          size="lg"
          className={`w-full ${
            !plan.is_popular &&
            'border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white'
          }`}
        >
          {ctaLabel}
        </Button>
      </a>
    </div>
  );
}
