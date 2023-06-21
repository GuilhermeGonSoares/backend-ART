import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'cnpj', async: false })
export class CNPJ implements ValidatorConstraintInterface {
  validate(cnpj: string) {
    const firstMultiplication = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondMultiplication = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const cnpjWithoutFormatting = cnpj.replace(/[^\d]+/g, '');
    if (cnpjWithoutFormatting.length != 14) {
      return false;
    }
    const firstVerificationDigit = Number(cnpjWithoutFormatting[12]);
    const secondVerificationDigit = Number(cnpjWithoutFormatting[13]);
    const sum1 = cnpjWithoutFormatting
      .split('')
      .reduce((sum, currentValue, index) => {
        if (index > 11) return sum + 0;
        return sum + Number(currentValue) * firstMultiplication[index];
      }, 0);
    const rest1 = sum1 % 11;

    if (rest1 === 0 || rest1 === 1) {
      return firstVerificationDigit === 0;
    } else if (11 - rest1 !== firstVerificationDigit) {
      return false;
    }

    const sum2 = cnpjWithoutFormatting
      .split('')
      .reduce((sum, currentValue, index) => {
        if (index > 12) return sum + 0;
        return sum + Number(currentValue) * secondMultiplication[index];
      }, 0);

    const rest2 = sum2 % 11;

    if (rest2 === 0 || rest2 === 1) {
      return secondVerificationDigit === 0;
    } else if (11 - rest2 !== secondVerificationDigit) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `The ${args.property} invalid!`;
  }
}
