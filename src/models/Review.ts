import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReview extends Document {
userId: string;
orderId: string;
productId: string;
productName: string;
customerName: string;
customerEmail: string;
rating: number;
comment: string;
status: 'pending' | 'approved' | 'rejected';
createdAt: Date;
updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
{
userId: {
type: String,
required: true,
index: true,
},


orderId: {
  type: String,
  required: true,
  index: true,
},

productId: {
  type: String,
  required: true,
  index: true,
},

productName: {
  type: String,
  required: true,
  trim: true,
  maxlength: 250,
},

customerName: {
  type: String,
  required: true,
  trim: true,
  maxlength: 100,
},

customerEmail: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
},

rating: {
  type: Number,
  required: true,
  min: 1,
  max: 5,
},

comment: {
  type: String,
  required: true,
  trim: true,
  minlength: 10,
  maxlength: 1000,
},

status: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending',
  index: true,
},

},
{
timestamps: true,
}
);

// One review per product per order
ReviewSchema.index(
{
orderId: 1,
productId: 1,
},
{
unique: true,
}
);

const Review: Model<IReview> =
mongoose.models.Review ||
mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
