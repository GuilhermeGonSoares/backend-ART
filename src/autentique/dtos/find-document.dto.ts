export interface Signaturedto {
  public_id: string;
  name: string | null;
  email: string;
  signed: object | null;
  rejected: object | null;
}

export interface ContractDto {
  id: string;
  name: string;
  refusable: boolean;
  sortable: boolean;
  created_at: string;
  signatures: Signaturedto[];
}
