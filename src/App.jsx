import React, { useState, useEffect } from 'react';
import Card from './components/taskCard/Card';
import TaskComponent from './components/taskcon/TaskComponent';
import './App.css';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus, createTask } from "./slices/taskSlice";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const status = useSelector((state) => state.tasks.status);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Fetch tasks when the component mounts
    dispatch(fetchTasks());
  }, [dispatch]);

  console.log(tasks)

  return (
    <div className='main'>
      <div>
        <h1>Task Manager Application</h1>
      </div>
      <div className='create-btn'>
        <button onClick={openModal}>Create task</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <TaskComponent />
          </div>
        </div>
      )}

      <div className="container">
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : (
          tasks && tasks.map((task, index) => (
            <Card
              key={task.id}
              _id={task.id}
              title={task.title}
              description={task.description}
              completed={task.completed}
              createdAt={task.createdAt}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default App