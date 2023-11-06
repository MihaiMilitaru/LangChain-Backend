import {Module} from "@nestjs/common";
import {MessagesGateway} from "./messages.gateway";
import {DocumentsModule} from "../documents/documents.module";
import {AbilityModule} from "../ability/ability.module";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [DocumentsModule, AbilityModule, UsersModule],
  providers: [MessagesGateway],
})

export class MessagesModule {
}
