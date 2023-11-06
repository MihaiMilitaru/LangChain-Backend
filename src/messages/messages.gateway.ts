import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from 'ws';
import {ChainService} from "../documents/chain.service";
import {Action} from "../roles/type";
import {CaslAbilityFactory} from "../ability/casl-ability.factory";
import {DocumentsService} from "../documents/documents.service";
import {UsersService} from "../users/users.service";

@WebSocketGateway({path: '/messages'})
export class MessagesGateway {
  @WebSocketServer()
  server: Server
  private chain;
  constructor(private readonly chainService: ChainService,
              private readonly castleAbility: CaslAbilityFactory,
              private readonly documentsService: DocumentsService,
              private readonly usersService: UsersService
  ) {}

  async handleConnection() {
    this.chain = await this.chainService.initializeChain();
  }

  @SubscribeMessage('messages')
  async handleMessage(@MessageBody() data: {message: string; userId: string}) {
    const user = await this.usersService.findOneWithOptions({id: parseInt(data.userId)}, {relations: ['role', 'role.permissions']});
    const ability = this.castleAbility.createForUser(user);
    if (this.chain) {
      const answer = await this.chain.call({
        query: data.message
      });

      if (ability.can(Action.Manage, 'Chapter')) {
        return answer.text;
      }

      for (const a of answer.sourceDocuments) {
        const document = await this.documentsService.findDocumentByPath(a.metadata.source);

        for (const ch of document.chapters) {
          if (!ability.can(Action.Read, ch.permissionSubject)) {
            const message = await this.chain.call({
              query: `Return just the name of the owner of ${a.metadata.source} or return "is not specified"?`
            })
            return `You don't have access to this information. Contact ${message.text}`;
          }
        }
      }

      return answer.text;
    }
    return "There are no documents inside the database right now.";
  }
}
