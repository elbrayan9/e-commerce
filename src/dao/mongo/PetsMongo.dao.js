import { PetModel } from "../../models/pet.model.js";

export class PetsMongoDAO {
  async create(petData) {
    return await PetModel.create(petData);
  }

  async findAll() {
    return await PetModel.find().lean();
  }
}
