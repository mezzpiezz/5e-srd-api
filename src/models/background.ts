import * as mongoose from 'mongoose';
import { APIReference } from './common';

const LanguageOptions = {
  _id: false,
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
};

const Equipment = {
  _id: false,
  equipment: APIReference,
  quantity: { type: Number, index: true },
};

const StartingEquipmentOption = {
  _id: false,
  equipment: APIReference,
  quantity: { type: Number, index: true },
};

const StartingEquipmentOptions = {
  _id: false,
  choose: { type: Number, index: true },
  from: [StartingEquipmentOption],
  type: { type: String, index: true },
};

const Ideal = {
  desc: { type: String, index: true },
  alignments: [APIReference],
};

const CharacteristicOptions = {
  choose: { type: Number, index: true },
  from: { type: [String], index: true },
  type: { type: String, index: true },
};

const IdealOptions = {
  choose: { type: Number, index: true },
  from: [Ideal],
  type: { type: String, index: true },
};

const Feature = {
  name: { type: String, index: true },
  desc: { type: [String], index: true },
};

const Background = new mongoose.Schema({
  _id: { type: String, select: false },
  index: { type: String, index: true },
  name: { type: String, index: true },
  starting_proficiencies: [APIReference],
  language_options: LanguageOptions,
  url: { type: String, index: true },
  starting_equipment: [Equipment],
  starting_equipment_options: [StartingEquipmentOptions],
  feature: Feature,
  personality_traits: CharacteristicOptions,
  ideals: IdealOptions,
  bonds: CharacteristicOptions,
  flaws: CharacteristicOptions,
});

export default mongoose.model('Background', Background, 'backgrounds');