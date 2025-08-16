import { SourceRepository } from "./source.repository";
import { CreateSourceDto, GetSourcesArgs } from "./source.validation";
import { Types } from "mongoose";

export class SourceService {
  private sourceRepository: SourceRepository;

  constructor() {
    this.sourceRepository = new SourceRepository();
  }

  async createSource(dto: CreateSourceDto, userId: Types.ObjectId) {
    return this.sourceRepository.createSource(dto, userId);
  }

  async getSources(query: GetSourcesArgs, ownerId: Types.ObjectId) {
    return this.sourceRepository.getSources(query, ownerId);
  }
}
