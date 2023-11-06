import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

export class StringOrArrayOfStrings implements ValidatorConstraintInterface {
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} is invalid. Please provide a string or array of strings`;
  }

  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return ['string', 'array'].includes(typeof value);
  }
}
