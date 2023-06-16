export interface IContract {
  name: string;
  filePath: string;
  customerName: string;
  customerCnpj: string;
  customerEmail: string;
  signatureDate?: string;
  contractTimeDays?: string;
  numberOfPosts?: string;
  finalPrice: string;
}
