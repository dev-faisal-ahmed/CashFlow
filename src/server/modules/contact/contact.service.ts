import { IContact } from "./contact.interface";
import { ContactRepository } from "./contact.repository";
import { GetContactsArgs } from "./contact.validation";
import { AppError } from "@/server/core/app.error";
import { WithUserId } from "@/server/types";

// types
type CreateContact = Pick<IContact, "name" | "phone" | "address" | "userId">;
type GetContacts = WithUserId<{ query: GetContactsArgs }>;
type UpdateContact = WithUserId<{ id: string; dto: Partial<IContact> }>;
type DeleteContact = WithUserId<{ id: string }>;

export class ContactService {
  private readonly contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async createContact(dto: CreateContact) {
    const isContactExists = await this.contactRepository.isContactExist({ phone: dto.phone, userId: dto.userId });
    if (isContactExists) throw new AppError("Contact already exists", 400);
    return this.contactRepository.createContact(dto);
  }

  async getContacts({ query, userId }: GetContacts) {
    return this.contactRepository.getContacts({ query, userId });
  }

  async updateContact({ id, dto, userId }: UpdateContact) {
    const isOwner = await this.contactRepository.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to update this contact", 401);
    return this.contactRepository.updateContact({ id, dto });
  }

  async deleteContact({ id, userId }: DeleteContact) {
    const isOwner = await this.contactRepository.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to delete this contact", 401);
    return this.contactRepository.updateContact({ id, dto: { isDeleted: true } });
  }
}
