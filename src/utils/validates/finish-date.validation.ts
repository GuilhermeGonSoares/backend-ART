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
