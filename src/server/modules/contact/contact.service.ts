import { Types } from "mongoose";
import { IContact } from "./contact.interface";
import { ContactRepository } from "./contact.repository";
import { GetContactsArgs } from "./contact.validation";

// types
type CreateContactDto = Pick<IContact, "name" | "phone" | "address" | "userId">;

export class ContactService {
  private readonly contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async createContact(dto: CreateContactDto) {
    return this.contactRepository.createContact(dto);
  }

  async getContacts(args: GetContactsArgs, userId: Types.ObjectId) {
    return this.contactRepository.getContacts(args, userId);
  }
}
