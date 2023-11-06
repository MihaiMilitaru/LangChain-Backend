import { Injectable } from '@nestjs/common';
import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAI } from 'langchain/llms/openai';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { loadQAStuffChain, RetrievalQAChain } from 'langchain/chains';
import * as path from "path";
import * as fs from "fs";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChainService {
  private chain: RetrievalQAChain | null;
  private openAIApiKey: string;
  private temperature: number;
  private modelName: string;
  private vectorStorePath: string;
  private embeddings: OpenAIEmbeddings;
  private model: OpenAI;
  private splitter: CharacterTextSplitter;

  constructor(private configService: ConfigService) {
    this.openAIApiKey = this.configService.get('OPENAI_API_KEY');
    this.temperature = parseFloat(this.configService.get('OPENAI_TEMPERATURE'));
    this.modelName = this.configService.get('OPENAI_MODEL_NAME');
    this.vectorStorePath = path.join(__dirname, '../../../storage/vectorestore');
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: this.openAIApiKey,
    });
    this.model = new OpenAI({
      openAIApiKey: this.openAIApiKey,
      temperature: this.temperature,
      modelName: this.modelName,
    });
    this.splitter = new CharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separator: '\n',
    })
  }

  async initializeChain(): Promise<RetrievalQAChain | null> {
    try {
      const vectorStorePath = path.join(__dirname, '../../../storage/vectorestore');
      if (fs.existsSync(vectorStorePath) && fs.readdirSync(vectorStorePath).length !== 0) {
        const vectorStore = await FaissStore.load(vectorStorePath, this.embeddings);
        this.chain = await new RetrievalQAChain({
          combineDocumentsChain: loadQAStuffChain(this.model),
          retriever: vectorStore.asRetriever(),
          returnSourceDocuments: true,
        });
        console.log('Retrieved documents from vectorstore');
        return this.chain;
      }
      return null;
    } catch (error) {
      console.log(error);
      console.log('Could not retrieve documents from vectorstore');
      this.chain = null;
      return this.chain;
    }
  }

  async getChain(): Promise<RetrievalQAChain | null> {
    if (!this.chain) {
      return this.initializeChain();
    }
    return this.chain;
  }

  setChain(): void {
    this.chain = null;
    this.embeddings = null;
  }

  getEmbeddings(): OpenAIEmbeddings {
    return this.embeddings;
  }

  getModel(): OpenAI {
    return this.model;
  }

  getSplitter(): CharacterTextSplitter {
    return this.splitter;
  }
}
