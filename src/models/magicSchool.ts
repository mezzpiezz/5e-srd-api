import * as mongoose from 'mongoose';

const MagicSchool = new mongoose.Schema({
  _id: { type: String, select: false },
  desc: { type: String, index: true },
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

export default mongoose.model('MagicSchool', MagicSchool, 'magic-schools');