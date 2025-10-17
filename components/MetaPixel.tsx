'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}

export function trackEvent(eventName: string, data?: any) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data);
  }
}

export function trackViewContent(product: any) {
  trackEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.sale_price || product.price,
    currency: 'ARS',
  });
}

export function trackAddToCart(product: any, quantity: number) {
  trackEvent('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: (product.sale_price || product.price) * quantity,
    currency: 'ARS',
  });
}

export function trackInitiateCheckout(value: number, items: any[]) {
  trackEvent('InitiateCheckout', {
    content_ids: items.map((item) => item.product.id),
    contents: items.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
    })),
    value,
    currency: 'ARS',
  });
}

export function trackPurchase(orderId: string, value: number, items: any[]) {
  trackEvent('Purchase', {
    content_ids: items.map((item) => item.product_id),
    contents: items.map((item) => ({
      id: item.product_id,
      quantity: item.quantity,
    })),
    value,
    currency: 'ARS',
    order_id: orderId,
  });
}
