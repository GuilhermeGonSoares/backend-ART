export interface AsaasChargeWebhook {
  event: string;
  payment: {
    object: string;
    id: string;
    dateCreated: string;
    customer: string;
    subscription?: string;
    installment?: string;
    paymentLink: string;
    dueDate: string;
    originalDueDate: string;
    value: number;
    netValue: number;
    originalValue: number | null;
    interestValue: number | null;
    description: string;
    externalReference: string;
    billingType: string;
    status: string;
    pixTransaction: null;
    confirmedDate: string;
    paymentDate: string;
    clientPaymentDate: string;
    installmentNumber: number | null;
    creditDate: string;
    estimatedCreditDate: string;
    invoiceUrl: string;
    bankSlipUrl: string | null;
    transactionReceiptUrl: string;
    invoiceNumber: string;
    deleted: boolean;
    anticipated: boolean;
    anticipable: boolean;
    lastInvoiceViewedDate: string;
    lastBankSlipViewedDate: string | null;
    postalService: boolean;
    discount: {
      value: number;
      dueDateLimitDays: number;
      type: string;
    };
  };
}
