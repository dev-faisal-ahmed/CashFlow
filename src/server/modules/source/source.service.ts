import { AppError } from "@/server/core/app.error";
import { SourceRepository } from "./source.repository";
import { CreateSourceDto, GetSourcesArgs, UpdateSourceDto } from "./source.validation";
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

  async updateSource(dto: UpdateSourceDto, sourceId: string, userId: Types.ObjectId) {
    const isOwner = await this.sourceRepository.isOwner(sourceId, userId);
    if (!isOwner) throw new AppError("You are not authorized to update this source", 401);

    const { addBudget, budget, ...rest } = dto;
    return this.sourceRepository.updateSource({ ...rest, ...(addBudget && { budget }) }, sourceId);
  }

  async deleteSource(id: string, userId: Types.ObjectId) {
    const isOwner = await this.sourceRepository.isOwner(id, userId);
    if (!isOwner) throw new AppError("You are not authorized to delete this source", 401);

    return this.sourceRepository.updateSource({ isDeleted: true }, id);
  }
}
