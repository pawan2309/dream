import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;
  const { amount, paymentType, remark } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
  }
  if (!paymentType || !['lena', 'dena'].includes(paymentType)) {
    return res.status(400).json({ success: false, message: 'Invalid payment type.' });
  }
  if (!remark || typeof remark !== 'string' || remark.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Remark is required.' });
  }

  try {
    // Get the user and current limit
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const currentLimit = (user as any).creditLimit || 0;
    let newLimit = currentLimit;
    let credit = 0, debit = 0;
    if (paymentType === 'lena') {
      credit = Number(amount);
      newLimit = currentLimit + credit;
    } else {
      debit = Number(amount);
      newLimit = currentLimit - debit;
      if (newLimit < 0) {
        return res.status(400).json({ success: false, message: 'Cannot reduce limit below 0' });
      }
    }
    // Update user's credit limit
    await prisma.user.update({
      where: { id },
      data: { creditLimit: newLimit } as any
    });
    // Create ledger entry
    const entry = await prisma.ledger.create({
      data: {
        userId: id,
        collection: 'LIMIT_UPDATE',
        debit,
        credit,
        balanceAfter: newLimit,
        type: 'ADJUSTMENT',
        remark,
      }
    });
    return res.status(200).json({ success: true, entry, newLimit });
  } catch (error) {
    console.error('Error adding manual ledger entry:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
} 