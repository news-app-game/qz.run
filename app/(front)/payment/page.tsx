'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

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
  const checkoutId = '{{ $checkoutId }}';
  const loadSumUpCard = () => {
    console.log('加载完毕', window.SumUpCard);
    if (window.SumUpCard) {
      window.SumUpCard.mount({
        id: 'sumup-card',
        checkoutId: checkoutId,
        onResponse: function (type, body) {
          console.log('Type', type);
          console.log('Body', body);
        },
      });
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