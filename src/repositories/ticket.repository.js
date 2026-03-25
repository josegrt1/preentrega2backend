import TicketsDAO from "../dao/mongo/ticket.dao.js";

const ticketsDAO = new TicketsDAO();

export default class TicketsRepository {
  async createTicket(ticketData) {
    return await ticketsDAO.create(ticketData);
  }

  async getTicketById(id) {
    return await ticketsDAO.getById(id);
  }

  async getTicketByCode(code) {
    return await ticketsDAO.getByCode(code);
  }
}