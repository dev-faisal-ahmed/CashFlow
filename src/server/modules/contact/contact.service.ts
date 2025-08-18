import { IContact } from "./contact.interface";
import { ContactRepository } from "./contact.repository";

type CreateContactDto = Pick<IContact, "name" | "phone" | "address" | "userId">;

export class ContactService {
  private readonly contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async createContact(dto: CreateContactDto) {
    return this.contactRepository.createContact(dto);
  }
}
