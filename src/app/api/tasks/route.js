/*import { connectDB } from "@/lib/db";

 export async function GET() {
   try {
     await connectDB();
     return Response.json({ message: "Connected to MongoDB successfully!" }, { status: 200 });
   } catch (error) {
     return Response.json({ message: "Connection failed", error: error.message }, { status: 500 });
   }
 } */

import { connectDB } from "@/lib/db";
import Task from "@/models/Task";


export async function POST(request) {
  try {
    await connectDB(); // Ensure DB connection is established
  } catch (dbError) {
    console.error("Database connection failed:", dbError); // Log the DB connection error
    return Response.json({ message: "Database connection failed", error: dbError.message }, { status: 500 });
  }

  const { title, description, dueDate } = await request.json();

  // Validate input data
  if (!title || !description || !dueDate) {
    return Response.json({ message: "All fields are required" }, { status: 400 });
  }
   
  try {
    // Create a new task and save it to the database
    const newTask = new Task({ title, description, dueDate });
    await newTask.save();
    return Response.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Task creation failed:", error); // Log the task creation error
    return Response.json({ message: "Failed to create task", error: error.message }, { status: 500 });
  }
} 



// import { connectDB } from "@/lib/db";
// import Task from "@/models/Task";

export async function GET(request) {
  try {
    await connectDB(); // Ensure DB connection is established

    const tasks = await Task.find(); // Retrieve all tasks from the database

    if (tasks.length === 0) {
      return Response.json({ message: "No tasks found" }, { status: 404 });
    }

    return Response.json({tasks}, { status: 200 }); // Return the list of tasks

  } catch (error) {
    console.error("Error fetching tasks:", error);
    return Response.json({ message: "Failed to fetch tasks", error: error.message }, { status: 500 });
  }
}
