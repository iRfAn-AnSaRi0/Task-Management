import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

// Task Update Route

export async function PUT(request) { 
  const { title, description, dueDate } = await request.json(); 

  
  if (!title || !description || !dueDate) {
    return Response.json({ message: "All fields are required" }, { status: 400 });
  }
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); 
  try {
    await connectDB(); 


    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, dueDate }, 
      { new: true } 
    );

   
    if (!updatedTask) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    return Response.json(updatedTask, { status: 200 }); 

  } catch (error) {
    console.error("Error updating task:", error);
    return Response.json({ message: "Failed to update task", error: error.message }, { status: 500 });
  }
}

// Task Delete Route

export async function DELETE(request) {
  await connectDB(); 

  
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); 

  try {
   
    const deletedTask = await Task.findByIdAndDelete(id);

   
    if (!deletedTask) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    return Response.json({ message: "Task deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting task:", error);
    return Response.json({ message: "Failed to delete task", error: error.message }, { status: 500 });
  }
}
