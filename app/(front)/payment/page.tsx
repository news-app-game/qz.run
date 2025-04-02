'use client';

import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { orderPayment } from '@/api/order';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

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

function PaymentContent() {
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
              if (type === 'error' || type === 'fail') {
                // 刷新当前页面
                window.location.reload();
              }
              if (type === 'success') {
                router.push('/subscription');
              }
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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <PaymentContent />
    </Suspense>
  );
} 