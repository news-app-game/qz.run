'use client';

import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { orderPayment } from '@/api/order';
import { useRouter } from 'next/navigation';
declare global {
  interface Window {
    SumUpCard: {
      mount: (config: {
        id: string;
        checkoutId: string;
        onResponse: (type: string, body: any) => void;
      }) => void;
    };
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const period = searchParams.get('period');
  const loadSumUpCard = async () => {
    try {
      const { code, data } = await orderPayment({
        package_id: Number(id),
        period: period as 'monthly' | 'quarterly' | 'semi_annually' | 'annually',
      });
      if (code === 200) {
        const { checkout_id } = data
        if (window.SumUpCard) {
          window.SumUpCard.mount({
            id: 'sumup-card',
            checkoutId: checkout_id,
            onResponse: function (type, body) {
              console.log('Type', type);
              console.log('Body', body);
              // 支付成功
              router.push('/subscription');
            },
          });
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <>
      <div id="sumup-card"></div>
      <Script
        id="sumup-sdk"
        type="text/javascript"
        src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"
        onLoad={() => {
          loadSumUpCard();
        }}
      />
    </>
  );
} 