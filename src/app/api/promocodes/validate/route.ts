import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Code requis' }, { status: 400 });
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return NextResponse.json({ valid: false, error: 'Code promo invalide' });
    }

    if (!promoCode.isActive) {
      return NextResponse.json({ valid: false, error: 'Ce code promo est désactivé' });
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: 'Ce code promo a expiré' });
    }

    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json({ valid: false, error: 'Ce code promo a atteint sa limite d\'utilisations' });
    }

    if (subtotal < promoCode.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Montant minimum de commande: ${promoCode.minOrderAmount} DH`,
      });
    }

    return NextResponse.json({ valid: true, promoCode: { id: promoCode.id, code: promoCode.code, type: promoCode.type, value: promoCode.value } });
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Erreur lors de la validation' }, { status: 500 });
  }
}
