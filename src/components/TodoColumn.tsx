import React from 'react';
import { MoreVertical, ArrowUpDown, CheckSquare } from 'lucide-react';
import { TodoList, Task, SortMethod } from '../types';
import { sortTasks } from '../utils/taskUtils';
import TaskItem from './TaskItem';
import AddTaskInput from './AddTaskInput';

interface TodoColumnProps {
  list: TodoList;
  onAddTask: (listId: string, title: string, priority: Task['priority'], dueDate?: Date, tags?: string[]) => void;
  onToggleTask: (listId: string, taskId: string) => void;
  onDeleteTask: (listId: string, taskId: string) => void;
  onUpdateTask: (listId: string, taskId: string, updates: Partial<Task>) => void;
  onUpdateList: (listId: string, updates: Partial<TodoList>) => void;
}

const TodoColumn: React.FC<TodoColumnProps> = ({
  list,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onUpdateList,
}) => {
  const activeTasks = sortTasks(list.tasks, list.sortMethod);
  const completedTasks = list.tasks.filter(task => task.completed);

  const sortMethodLabels: Record<SortMethod, string> = {
    smart: 'Smart Sort',
    priority: 'Priority',
    dueDate: 'Due Date',
    manual: 'Manual',
  };

  return (
    <div className="flex-shrink-0 w-80 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-white/50 hover:shadow-2xl hover:shadow-gray-300/30 transition-all duration-300">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">{list.title}</h2>
          <div className="flex items-center space-x-1">
            <div className="relative group">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md">
                <ArrowUpDown className="w-4 h-4 transition-transform group-hover:scale-110" />
              </button>
              <div className="absolute right-0 top-12 w-44 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0 z-20">
                {Object.entries(sortMethodLabels).map(([method, label]) => (
                  <button
                    key={method}
                    onClick={() => onUpdateList(list.id, { sortMethod: method as SortMethod })}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 ${
                      list.sortMethod === method ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-900/30 font-medium' : 'text-gray-700 dark:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gray-400 dark:text-white bg-gray-100/70 dark:bg-gray-700/70 px-2 py-1 rounded-full">
            {sortMethodLabels[list.sortMethod]}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {activeTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-gray-500 text-sm font-medium">No tasks yet</p>
            <p className="text-gray-400 text-xs mt-1">Add your first task below</p>
          </div>
        ) : (
          activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={(taskId) => onToggleTask(list.id, taskId)}
              onDelete={(taskId) => onDeleteTask(list.id, taskId)}
              onUpdate={(taskId, updates) => onUpdateTask(list.id, taskId, updates)}
            />
          ))
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="mb-6">
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-3 flex items-center space-x-2">
              <span className="select-none font-medium">
                Completed ({completedTasks.length})
              </span>
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckSquare className="w-2.5 h-2.5 text-green-600" />
              </div>
            </summary>
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={(taskId) => onToggleTask(list.id, taskId)}
                  onDelete={(taskId) => onDeleteTask(list.id, taskId)}
                  onUpdate={(taskId, updates) => onUpdateTask(list.id, taskId, updates)}
                />
              ))}
            </div>
          </details>
        </div>
      )}

      <AddTaskInput onAddTask={(title, priority, dueDate) => onAddTask(list.id, title, priority, dueDate)} defaultPriority="medium" />
    </div>
  );
};

export default TodoColumn;