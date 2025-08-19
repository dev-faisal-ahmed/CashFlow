import { AppError } from "@/server/core/app.error";
import { SourceRepository } from "./source.repository";
import { CreateSourceDto, GetSourcesArgs, UpdateSourceDto } from "./source.validation";
import { WithUserId } from "@/server/types";

// Types

type GetSource = WithUserId<{ query: GetSourcesArgs }>;
type CreateSource = WithUserId<{ dto: CreateSourceDto }>;
type UpdateSource = WithUserId<{ id: string; dto: UpdateSourceDto }>;
type DeleteSource = WithUserId<{ id: string }>;

export class SourceService {
  private sourceRepository: SourceRepository;

  constructor() {
    this.sourceRepository = new SourceRepository();
  }

  async createSource({ dto, userId }: CreateSource) {
    return this.sourceRepository.createSource({ dto, ownerId: userId });
  }

  async getSources({ query, userId }: GetSource) {
    return this.sourceRepository.getSources({ query, ownerId: userId });
  }

  async updateSource({ dto, id, userId }: UpdateSource) {
    const isOwner = await this.sourceRepository.isOwner({ sourceId: id, userId });
    if (!isOwner) throw new AppError("You are not authorized to update this source", 401);

    const { addBudget, budget, ...rest } = dto;
    return this.sourceRepository.updateSource({ id, dto: { ...rest, ...(addBudget && { budget }) } });
  }

  async deleteSource({ id, userId }: DeleteSource) {
    const isOwner = await this.sourceRepository.isOwner({ sourceId: id, userId });
    if (!isOwner) throw new AppError("You are not authorized to delete this source", 401);

    return this.sourceRepository.updateSource({ id, dto: { isDeleted: true } });
  }
}
