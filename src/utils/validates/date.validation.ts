import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateSubscriptionDto } from '../../subscription/dtos/create-subscription.dto';

@ValidatorConstraint({ name: 'IsDateLaterThan', async: false })
export class IsDateLaterThan implements ValidatorConstraintInterface {
  validate(finishedDate: string, args: ValidationArguments) {
    const { initialDate } = args.object as CreateSubscriptionDto;

    if (!initialDate || !finishedDate) {
      return false;
    }

    const initialDateObj = new Date(initialDate);
    const finishedDateObj = new Date(finishedDate);

    return finishedDateObj > initialDateObj;
  }

  defaultMessage(args: ValidationArguments) {
    return `The ${args.property} field must be a date after the initialDate.`;
  }
}

@ValidatorConstraint({ name: 'IsDateLaterThanToday', async: false })
export class IsDateLaterThanToday implements ValidatorConstraintInterface {
  validate(date: Date) {
    const currentDate = new Date();
    const currentDay = String(currentDate.getUTCDate()).padStart(2, '0');
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentYear = currentDate.getFullYear();

    return (
      new Date(date) >= new Date(`${currentYear}-${currentMonth}-${currentDay}`)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `The ${args.property} field must be a date after the today`;
  }
}
