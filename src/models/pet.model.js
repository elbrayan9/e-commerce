import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  birthDate: { type: Date, required: true },
  // Si quisieras conectarlas con un usuario, añadirías:
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

export const PetModel = mongoose.model("pets", petSchema);
