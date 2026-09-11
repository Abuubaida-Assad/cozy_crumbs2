import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    timings: {
      type: String,
      default: '8:00 AM - 11:00 PM',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    distance: {
      type: String,
      default: '1.2 km',
    },
  },
  {
    timestamps: true,
  }
);

export const Store = mongoose.model('Store', storeSchema);
