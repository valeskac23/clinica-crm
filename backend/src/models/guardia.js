const mongoose = require('mongoose');

const guardiaSchema = new mongoose.Schema({

  title: String,
  start: Date,
  end: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Relación con el médico/enfermera
});

//transformar el objeto devuelto por Mongoose a JSON, para que el id se muestre como un string y no como un objeto, y para eliminar los campos _id y __v
guardiaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Guardia', guardiaSchema);