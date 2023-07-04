import { CreateContractDto } from '../../automations/dtos/create-contract.dto';

export const variablesContract = (contract: CreateContractDto) => {
  if (contract.name.includes('KSS')) {
    return {
      nomeempresa: contract.customerName,
      numerocnpj: contract.customerCnpj,
      valordokit: contract.finalPrice,
      umaunicaparcela: '{{QUE?}}',
      dataassinatura: contract.signatureDate,
      prazototal: contract.contractTimeDays,
    };
  }
  if (contract.name.includes('TP')) {
    return {
      nomeempresa: contract.customerName,
      numerocnpj: contract.customerCnpj,
      valortrafego: contract.finalPrice,
      fontedetrafego: '{{QUE?}}',
      dataassinatura: contract.signatureDate,
      prazoemdias: contract.contractTimeDays,
    };
  }
  if (contract.name.includes('FS')) {
    return {
      nomeempresa: contract.customerName,
      numerocnpj: contract.customerCnpj,
      valor: contract.finalPrice,
      dataassinatura: contract.signatureDate,
      prazoemdias: contract.contractTimeDays,
    };
  }
  if (contract.name.includes('WS')) {
    return {
      nomeempresa: contract.customerName,
      numerocnpj: contract.customerCnpj,
      valordosite: contract.finalPrice,
      umaunicaparcela: '{{QUE?}}',
      numerodedias: '{{QUE?}}',
      valordahospedagem: '{{QUE?}}',
      dataassinatura: contract.signatureDate,
      prazoemdias: contract.contractTimeDays,
    };
  }
  if (contract.name.includes('SM')) {
    return {
      nomeempresa: contract.customerName,
      numerocnpj: contract.customerCnpj,
      valor: contract.finalPrice,
      numerodeposts: contract.numberOfPosts,
      dataassinatura: contract.signatureDate,
      prazoemdias: contract.contractTimeDays,
    };
  }
};
