import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date
    }
}, { timestamps: true })

export default mongoose.models.Task || mongoose.model("Task", TaskSchema)