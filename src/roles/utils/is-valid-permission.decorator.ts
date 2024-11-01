import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import {
  Entities,
  bookPermissions,
  userPermissions,
  rolePermissions,
  DefaultActions,
} from './permissions';

const entityPermissionsMap = {
  [Entities.BOOK]: bookPermissions[Entities.BOOK],
  [Entities.USER]: userPermissions[Entities.USER],
  [Entities.ROLE]: rolePermissions[Entities.ROLE],
};

export function IsValidPermission(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPermission',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            typeof value !== 'object' ||
            value === null ||
            Object.keys(value).length === 0
          ) {
            return false;
          }

          for (const entity in value) {
            if (
              !Object.values(Entities).includes(
                entity as (typeof Entities)[keyof typeof Entities],
              )
            ) {
              return false;
            }

            const actions = value[entity];
            if (!Array.isArray(actions)) {
              return false;
            }

            for (const action of actions) {
              if (!entityPermissionsMap[entity].includes(action)) {
                return false;
              }
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const invalidEntity = Object.keys(args.value).find(
            (entity) =>
              !Object.values(Entities).includes(
                entity as (typeof Entities)[keyof typeof Entities],
              ) ||
              !entityPermissionsMap[entity].every((action) =>
                args.value[entity].includes(action),
              ),
          );

          const validActions = invalidEntity
            ? entityPermissionsMap[invalidEntity].join(', ')
            : DefaultActions.join(', ');

          return `Invalid permissions object. Acceptable values for ${invalidEntity ?? [...Object.values(Entities)]}: ${validActions}`;
        },
      },
    });
  };
}
