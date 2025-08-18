import { IContact } from "./contact.interface";
import { ContactModel } from "./contact.schema";

type CreateContactDto = Pick<IContact, "name" | "phone" | "address" | "userId">;

export class ContactRepository {
  async createContact(dto: CreateContactDto) {
    return ContactModel.create(dto);
  }
}

// types
