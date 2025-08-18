import { Types } from "mongoose";
import { IContact } from "./contact.interface";
import { ContactRepository } from "./contact.repository";
import { GetContactsArgs, UpdateContactDto } from "./contact.validation";
import { AppError } from "@/server/core/app.error";

// types
type CreateContactDto = Pick<IContact, "name" | "phone" | "address" | "userId">;

export class ContactService {
  private readonly contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async createContact(dto: CreateContactDto) {
    const isContactExists = await this.contactRepository.isContactExistWithPhone({ phone: dto.phone, userId: dto.userId });
    if (isContactExists) throw new AppError("Contact already exists", 400);
    return this.contactRepository.createContact(dto);
  }

  async getContacts(args: GetContactsArgs, userId: Types.ObjectId) {
    return this.contactRepository.getContacts(args, userId);
  }

  async updateContact(dto: UpdateContactDto, contactId: string, userId: Types.ObjectId) {
    const isOwner = await this.contactRepository.isOwner({ id: contactId, userId });
    if (!isOwner) throw new AppError("You are not authorized to update this contact", 401);
    return this.contactRepository.updateContact(contactId, dto);
  }
}
