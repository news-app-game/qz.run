'use client';

import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { orderPayment } from '@/api/order';
import { useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    SumUpCard: {
      mount: (config: {
        id: string;
        checkoutId: string;
        onResponse: (type: string, body: any) => void;
        onLoad: () => void;
      }) => void;
    };
  }
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const period = searchParams.get('period');
  const [pageLoading, setPageLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      setPageLoading(true);
      // 清理 SumUpCard 实例
      const sumupCardElement = document.getElementById('sumup-card');
      if (sumupCardElement) {
        sumupCardElement.innerHTML = '';
      }
    };
  }, []);

  const loadSumUpCard = async () => {
    if (!mounted) return;
    
    try {
      setPageLoading(true);
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
            // 挂载成功
            onLoad: () => {
              setPageLoading(false);
            }
          });
        }
      }
    } catch (error) {
      console.log('error', error);
      setPageLoading(false);
    }
  }

  useEffect(() => {
    if (mounted) {
      loadSumUpCard();
    }
  }, [mounted]);

  return (
    <>
      {pageLoading && (
        <div className='flex justify-center items-center h-screen gap-2'>
          <Loader2 className='animate-spin' />
          加载中
        </div>
      )}
      <div id="sumup-card"></div>
      <Script
        id="sumup-sdk"
        type="text/javascript"
        src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js"
        onLoad={() => {
          if (mounted) {
            loadSumUpCard();
          }
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