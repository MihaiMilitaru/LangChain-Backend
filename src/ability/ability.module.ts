import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from './guard';

@Module({
  providers: [
    CaslAbilityFactory,
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [CaslAbilityFactory],
})
export class AbilityModule {}
