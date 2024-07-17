import React from 'react'
import TodoList from './components/TodoList';
import Footer from './components/Footer';


const App = () => {
  return (
    <div className='bg-gray-100'>
      <div className="min-h-[calc(100vh-65px)] flex justify-center items-center">
        <TodoList />
      </div>
      <Footer />
    </div>
  );
}

export default App