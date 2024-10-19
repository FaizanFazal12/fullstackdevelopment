"use client";
import React, { useState, useEffect } from "react";
import { getAllTodos, updateTodo, deleteTodo } from "@/actions"; // Import necessary actions

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getAllTodos(); 
        setTodos(todos); 
      } catch (error) {
        console.error("Error fetching todos:", error);
        setTodos([]);
      }
    };

    fetchTodos();
  }, []);

  const handleEdit = (todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setFormData({ title: todo.title, description: todo.description });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id); // Call delete function
      setTodos(todos.filter(todo => todo.id !== id)); // Update local state
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTodo = await updateTodo(currentTodo.id, formData); // Call update function
      setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))); // Update local state
      setIsEditing(false);
      setCurrentTodo(null);
      setFormData({ title: "", description: "" }); // Reset form data
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          {isEditing ? (
           <form onSubmit={handleFormSubmit} className="mb-8 bg-white shadow-md rounded-lg p-6">
           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Todo</h2>
           
           <div className="mb-4">
             <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
               Title
             </label>
             <input
               id="title"
               type="text"
               name="title"
               value={formData.title}
               onChange={handleFormChange}
               required
               placeholder="Enter title"
               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
           </div>
           
           <div className="mb-6">
             <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
               Description
             </label>
             <textarea
               id="description"
               name="description"
               value={formData.description}
               onChange={handleFormChange}
               required
               placeholder="Enter description"
               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               rows="4"
             />
           </div>
           
           <div className="flex justify-end">
             <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
               Update Todo
             </button>
             <button
               type="button"
               onClick={() => {
                 setIsEditing(false);
                 setCurrentTodo(null);
                 setFormData({ title: "", description: "" });
               }}
               className="ml-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg transition duration-200"
             >
               Cancel
             </button>
           </div>
         </form>
         
          ) : (
            <div className="flex flex-wrap -m-4">
              {todos.length > 0 ? (
                todos.map((element) => (
                  <div className="p-4 md:w-1/3" key={element.id}>
                    <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                      <img
                        className="lg:h-48 md:h-36 w-full object-cover object-center"
                        src="https://dummyimage.com/720x400"
                        alt="blog"
                      />
                      <div className="p-6">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                          CATEGORY
                        </h2>
                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                          {element.title}
                        </h1>
                        <p className="leading-relaxed mb-3">
                          {element.description}
                        </p>
                        <div className="flex items-center flex-wrap">
                          <button
                            onClick={() => handleEdit(element)}
                            className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(element.id)}
                            className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0 ml-2"
                          >
                            Delete
                          </button>
                          <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                            <svg
                              className="w-4 h-4 mr-1"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            1.2K
                          </span>
                          <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                            <svg
                              className="w-4 h-4 mr-1"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                            >
                              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                            </svg>
                            6
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No todos available</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
