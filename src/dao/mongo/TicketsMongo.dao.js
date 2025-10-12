import { TicketModel } from "../../models/ticket.model.js";

export class TicketsMongoDAO {
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }
}
