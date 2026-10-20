import { Schema, model, models, type Model } from "mongoose";

type CounterDoc = { _id: string; seq: number };

const CounterSchema = new Schema<CounterDoc>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = (models.Counter as Model<CounterDoc>) || model<CounterDoc>("Counter", CounterSchema);

/** Atomic, gap-tolerant sequence — safe under concurrent checkouts. */
export async function nextSequence(name: string) {
  const doc = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  ).lean();
  return doc!.seq;
}
