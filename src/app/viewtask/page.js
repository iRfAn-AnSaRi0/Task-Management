'use client'; // Mark this file as a client-side component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

export default function ViewAllTasks() {
  const router = useRouter();
  
  // State to hold tasks fetched from the backend
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  // Function to format the date to 'YYYY-MM-DD' format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts the 'YYYY-MM-DD' part
  };

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Endpoint to fetch all tasks
        const data = await response.json();
        
        if (response.ok) {
          // Format dates before setting tasks in the state
          setTasks(data.tasks.map(task => ({
            ...task,
            dueDate: formatDate(task.dueDate), // Format the date here
          })));
        } else {
          alert(data.message); // Show error message if no tasks fetched
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to fetch tasks. Please try again.");
      }
    };
    
    fetchTasks();
  }, []);

  // Handle task completion toggle
  const toggleComplete = async (id) => {
    const updatedTask = tasks.find(task => task._id === id);
    updatedTask.isCompleted = !updatedTask.isCompleted;
    
    // Send the updated task completion status to the server
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isCompleted: updatedTask.isCompleted }),
    });
    
    // Update the local state to reflect the completion status
    setTasks(tasks.map(task => 
      task._id === id ? updatedTask : task
    ));
  };

  // Open edit modal with the task details
  const openEditModal = (task) => {
    setSelectedTask(task);
    setTaskDetails({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
    setIsEditModalOpen(true);
    console.log(task);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Update the task details
  const handleUpdate = async () => {
    const updatedTask = { ...selectedTask, ...taskDetails };
    
    // Send the updated task details to the server
   const response = await fetch(`/api/tasks/${selectedTask._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success("Task Updated");
    
    } else {
      toast.error(data.message); 
    }
    
    // Update the local state with the updated task
    setTasks(tasks.map(task => 
      task._id === selectedTask._id ? updatedTask : task
    ));
    
    closeEditModal();
  };

  // Delete a task
  const handleDelete = async (id) => {
    // Send a DELETE request to the server to delete the task
   const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok) {
      toast.success("Task Deleted");
    
    } else {
      toast.error(data.message); 
    }
    // Remove the task from the local state
    setTasks(tasks.filter(task => task._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">All Tasks</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2">Task Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} className="border-b">
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">{task.description}</td>
                  <td className="px-4 py-2">{task.dueDate}</td>
                  <td className="px-4 py-2 flex justify-start gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleComplete(task._id)}
                        className="mr-2"
                      />
                      {task.isCompleted ? (
                        <span className="text-green-600 font-semibold">Completed</span>
                      ) : (
                        <span className="text-gray-600">Not Completed</span>
                      )}
                    </label>
                    <button 
                      onClick={() => openEditModal(task)} 
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(task._id)} 
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-2 text-gray-600">
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Edit Task</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={taskDetails.title}
                onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={taskDetails.description}
                onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={taskDetails.dueDate}
                onChange={(e) => setTaskDetails({ ...taskDetails, dueDate: e.target.value })}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                disabled={true} // Disable the date input
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={closeEditModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
