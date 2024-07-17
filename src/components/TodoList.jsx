import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import {
    Input,
    Popover,
    PopoverHandler,
    PopoverContent,
    Select,
    Option,
    Button,
    Tooltip,
} from '@material-tailwind/react';
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { LuUndo2 } from 'react-icons/lu';
import { toast } from 'sonner';

const TABLE_HEAD = ['Task', 'Due Date', 'Status', 'Actions'];

const TodoList = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const [task, setTask] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [filter, setFilter] = useState('All');
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (task.trim()) {
            const newTask = {
                id: uuidv4(),
                task: task,
                dueDate: dueDate ? format(dueDate, 'MM/dd/yyyy') : 'No due date',
                completed: false,
                status: 'pending',
            };
            setTasks([...tasks, newTask]);
            setTask('');
            setDueDate(null);
            toast.success('Todo Added successfully')
        }
    };

    const updateTask = () => {
        setTasks(
            tasks.map((t) =>
                t.id === currentTaskId ? { ...t, task: task, dueDate: dueDate ? format(dueDate, 'MM/dd/yyyy') : 'No due date', completed: false, status: 'pending' } : t
            )
        );
        setTask('');
        setDueDate(null);
        setIsEditing(false);
        setCurrentTaskId(null);
        toast.success('Todo Updated successfully')
    };

    const editTask = (id, task, dueDate) => {
        setTask(task);
        setDueDate(dueDate !== 'No due date' ? new Date(dueDate) : null);
        setIsEditing(true);
        setCurrentTaskId(id);
    };

    const toggleComplete = (id) => {
        const newTasks = tasks.map((task) =>
            task.id === id
                ? { ...task, completed: !task.completed, status: task.completed ? 'pending' : 'completed' }
                : task
        );
        setTasks(newTasks);
    };

    const removeTask = (id) => {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
        toast.success('Todo Removed successfully')
    };

    const clearAllTasks = () => {
        setTasks([]);
        toast.success('Todo Cleared successfully')
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'All') return true;
        if (filter === 'Completed') return task.completed;
        if (filter === 'Pending') return !task.completed;
        return true;
    });

    return (
        <div className="w-fit max-w-fit mx-auto px-6 py-8 bg-white rounded-lg shadow-lg duration-300">
            <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
            <div className="flex mb-4 items-center justify-center gap-2">
                <Input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    variant='standard'
                    label="Add a todo..."
                />
                <Popover placement="bottom">
                    <PopoverHandler>
                        <Input
                            label="Select a Date"
                            onChange={() => null}
                            variant='standard'
                            value={dueDate ? format(dueDate, 'MM/dd/yyyy') : ''}
                        />
                    </PopoverHandler>
                    <PopoverContent>
                        <DayPicker
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            showOutsideDays
                            className="border-0"
                            classNames={{
                                caption: 'flex justify-center py-2 mb-4 relative items-center',
                                caption_label: 'text-sm font-medium text-gray-900',
                                nav: 'flex items-center',
                                nav_button: 'h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300',
                                nav_button_previous: 'absolute left-1.5',
                                nav_button_next: 'absolute right-1.5',
                                table: 'w-full border-collapse',
                                head_row: 'flex font-medium text-gray-900',
                                head_cell: 'm-0.5 w-9 font-normal text-sm',
                                row: 'flex w-full mt-2',
                                cell: 'text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                                day: 'h-9 w-9 p-0 font-normal',
                                day_range_end: 'day-range-end',
                                day_selected: 'rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white',
                                day_today: 'rounded-md bg-gray-200 text-gray-900',
                                day_outside: 'day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10',
                                day_disabled: 'text-gray-500 opacity-50',
                                day_hidden: 'invisible',
                            }}
                            components={{
                                IconLeft: ({ ...props }) => (
                                    <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                                ),
                                IconRight: ({ ...props }) => (
                                    <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                                ),
                            }}
                        />
                    </PopoverContent>
                </Popover>
                <Button
                    onClick={isEditing ? updateTask : addTask}
                    color='green'
                    variant='outlined'
                    className='rounded-full min-w-10 p-0 min-h-10 flex justify-center items-center'
                >
                    {isEditing ? <IoCheckmarkOutline size={20} /> : <FaPlus size={15} />}
                </Button>
            </div>
            <div className="flex mb-4 items-center justify-between gap-2">
                <div className="w-72">
                    <Select value={filter} variant='static' onChange={(value) => setFilter(value)}>
                        <Option value="All">All</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="Pending">Pending</Option>
                    </Select>
                </div>
                <Button onClick={clearAllTasks} color='red' className='text-nowrap text-white'>
                    DELETE ALL
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className={`${head === 'Task' ? 'w-96' : ''} py-2 px-4`}>
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='duration-300'>
                        {
                            filteredTasks.map(({ id, task, completed, dueDate }, idx) => (
                                <tr key={idx}>
                                    <td className={`border px-4 py-2 w-96 max-w-96 whitespace-nowrap overflow-hidden text-ellipsis  ${completed ? 'line-through text-green-600' : ''}`}>{task}</td>
                                    <td className="border px-4 py-2">{dueDate}</td>
                                    <td className="border px-4 py-2">{completed ? 'Completed' : 'Pending'}</td>
                                    <td className="border px-4 py-2 flex justify-center gap-2">
                                        <Tooltip content="Edit">

                                            <Button size='sm' variant='gradient' color='yellow' onClick={() => editTask(id, task, completed, dueDate)}>
                                                <FiEdit size={20} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={completed ? 'Undo' : 'Complete'}>
                                            <Button size='sm' onClick={() => toggleComplete(id)} variant='gradient' color='green'>
                                                {
                                                    completed
                                                        ?
                                                        <LuUndo2 size={20} />
                                                        :
                                                        <IoCheckmarkOutline size={20} />
                                                }
                                            </Button>
                                        </Tooltip>

                                        <Tooltip content='Remove'>

                                            <Button size='sm' onClick={() => removeTask(id)} variant='gradient' color='red' >
                                                <FaRegTrashAlt size={18} />
                                            </Button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TodoList;
