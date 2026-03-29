// src/services/esewa.service.ts
import { logger } from '../utils/logger.js';

export const initiateESewa = async (amount: number, orderId: string) => {
  logger.info(`Initiating eSewa payment for order ${orderId} amount ${amount}`);
  // In reality, generate signature and return form fields
  return {
    url: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    fields: {
      amount,
      product_code: 'EPAYTEST',
      transaction_uuid: orderId,
      // signature would be here
    }
  };
};

export const verifyESewa = async (encodedData: string) => {
  logger.info(`Verifying eSewa payment with data: ${encodedData}`);
  // Decoding and validation logic here
  return { success: true, transaction_uuid: 'order_uuid' };
};
