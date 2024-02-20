import { Document, Schema, model } from "mongoose";

export const taskPriorityValues = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof taskPriorityValues)[number];

export interface TaskInterface {
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: string;
}

export interface TaskDocumentInterface extends TaskInterface, Document {}

const taskSchema = new Schema<TaskDocumentInterface>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: taskPriorityValues,
      default: taskPriorityValues[1],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = model<TaskDocumentInterface>("Task", taskSchema);

export default Task;
