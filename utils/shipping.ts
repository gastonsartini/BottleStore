export interface ShippingCalculation {
  zone: string;
  provider: string;
  cost: number;
  estimatedDays: number;
}

export function calculateShipping(
  postalCode: string,
  weight: number = 0.5
): ShippingCalculation | null {
  const zones = [
    {
      name: 'CABA y GBA',
      patterns: [/^1[0-9]{3}$/, /^B1[6-9][0-9]{2}$/],
      baseRate: 850,
      additionalRate: 150,
      estimatedDays: 3,
      provider: 'Correo Argentino',
    },
    {
      name: 'Buenos Aires Interior',
      patterns: [/^[6-7][0-9]{3}$/, /^B[2-9][0-9]{3}$/],
      baseRate: 1200,
      additionalRate: 200,
      estimatedDays: 5,
      provider: 'OCA',
    },
    {
      name: 'Centro',
      patterns: [/^[2-3][0-9]{3}$/, /^S[2-3][0-9]{3}$/, /^E3[0-9]{3}$/],
      baseRate: 1500,
      additionalRate: 250,
      estimatedDays: 7,
      provider: 'Andreani',
    },
    {
      name: 'Norte',
      patterns: [/^4[0-9]{3}$/],
      baseRate: 1800,
      additionalRate: 300,
      estimatedDays: 10,
      provider: 'OCA',
    },
    {
      name: 'Sur',
      patterns: [/^[8-9][0-9]{3}$/, /^R[8-9][0-9]{3}$/],
      baseRate: 2200,
      additionalRate: 350,
      estimatedDays: 12,
      provider: 'Correo Argentino',
    },
  ];

  const cleanPostalCode = postalCode.replace(/\s+/g, '').toUpperCase();

  for (const zone of zones) {
    for (const pattern of zone.patterns) {
      if (pattern.test(cleanPostalCode)) {
        const cost = zone.baseRate + zone.additionalRate * weight;
        return {
          zone: zone.name,
          provider: zone.provider,
          cost: Math.round(cost),
          estimatedDays: zone.estimatedDays,
        };
      }
    }
  }

  return null;
}

export function validatePostalCode(postalCode: string): boolean {
  const cleanPostalCode = postalCode.replace(/\s+/g, '').toUpperCase();
  const argentinePostalCodePattern = /^([1-9][0-9]{3}|[ABCEFGHJKLMNPQRSTUVWXYZ][0-9]{4})$/;
  return argentinePostalCodePattern.test(cleanPostalCode);
}

export function formatPostalCode(postalCode: string): string {
  return postalCode.replace(/\s+/g, '').toUpperCase();
}
