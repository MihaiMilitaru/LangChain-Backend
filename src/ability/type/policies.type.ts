import { AnyMongoAbility } from '@casl/ability';

interface IPolicyHandler {
  handle(ability: AnyMongoAbility): boolean;
}

type PolicyHandlerCallback = (ability: AnyMongoAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
