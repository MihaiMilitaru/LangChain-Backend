import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
  Subject,
} from '@casl/ability';
import { User } from '../users/entities';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    user?.role?.permissions.forEach((rule) => {
      can(rule.action, rule.subject, rule.fields, rule.conditions);
    });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }
}
