import { Types } from "mongoose";
import { IContact } from "./contact.interface";
import { ContactModel } from "./contact.schema";
import { GetContactsArgs } from "./contact.validation";
import { QueryHelper } from "@/server/helpers/query.helper";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { AppError } from "@/server/core/app.error";

// Types
type CreateContactDto = Pick<IContact, "name" | "phone" | "address" | "userId">;
type UpdateContactDto = Partial<IContact>;

export class ContactRepository {
  async createContact(dto: CreateContactDto) {
    return ContactModel.create(dto);
  }

  async getContacts(query: GetContactsArgs, userId: Types.ObjectId) {
    const requestedFields = query.fields;
    const { search, page } = query;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);
    const { getAll, skip, limit } = paginationHelper.getPaginationInfo();

    const fields = QueryHelper.selectFields(requestedFields, ["_id", "name", "phone", "address", "userId", "given", "taken"]);

    const dbQuery = {
      userId,
      isDeleted: false,
      ...(search && { name: { $regex: search, $options: "i" }, phone: { $regex: search, $options: "i" } }),
    };

    const contacts = await ContactModel.aggregate([
      { $match: dbQuery },

      ...(requestedFields?.includes("given") || requestedFields?.includes("taken")
        ? [
            {
              $lookup: {
                from: "transactions",
                let: { contactId: "$_id" },
                pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ["$type", "peer-transfer"] }, { $eq: ["$contactId", "$$contactId"] }] } } },
                  { $project: { amount: 1, nature: 1 } },
                ],
                as: "transactions",
              },
            },
            {
              $addFields: {
                given: {
                  $sum: {
                    $map: {
                      input: "$transactions",
                      as: "tx",
                      in: { $cond: [{ $eq: ["$tx.nature", "income"] }, "$tx.amount", 0] },
                    },
                  },
                },
                taken: {
                  $sum: {
                    $map: {
                      input: "$transactions",
                      as: "tx",
                      in: { $cond: [{ $eq: ["$tx.nature", "expense"] }, "$tx.amount", 0] },
                    },
                  },
                },
              },
            },
            { $project: { transactions: 0 } },
          ]
        : []),

      ...(fields ? [{ $project: fields }] : []),
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    const total = await ContactModel.countDocuments(dbQuery);
    const meta = paginationHelper.getMeta(total);

    return { contacts, meta };
  }

  async updateContact(id: string, dto: UpdateContactDto) {
    return ContactModel.updateOne({ _id: id }, { $set: dto });
  }

  // helper
  async isContactExistWithPhone(phone: string, userId: Types.ObjectId) {
    return ContactModel.findOne({ phone, userId }, { _id: 1 }).lean();
  }

  async isOwner(contactId: string, userId: Types.ObjectId) {
    const contact = await ContactModel.findOne({ _id: contactId }, { _id: 1, userId: 1 }).lean();
    if (!contact) throw new AppError("Contact not found!", 404);
    return contact.userId.equals(userId);
  }
}
