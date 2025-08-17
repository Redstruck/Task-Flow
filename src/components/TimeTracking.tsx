import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Task } from '../types';

interface TimeTrackingProps {
  task: Task;
  onUpdateTime: (taskId: string, actualTime: number) => void;
}

const TimeTracking: React.FC<TimeTrackingProps> = ({ task, onUpdateTime }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setCurrentSession(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  // Stop tracking if task becomes completed
  useEffect(() => {
    if (task.completed && isTracking) {
      handleStop();
    }
  }, [task.completed, isTracking]);

  const handleStart = () => {
    setIsTracking(true);
    setStartTime(new Date());
    setCurrentSession(0);
  };

  const handlePause = () => {
    setIsTracking(false);
    if (currentSession > 0) {
      const newActualTime = (task.actualTime || 0) + Math.floor(currentSession / 60);
      onUpdateTime(task.id, newActualTime);
    }
  };

  const handleStop = () => {
    setIsTracking(false);
    if (currentSession > 0) {
      const newActualTime = (task.actualTime || 0) + Math.floor(currentSession / 60);
      onUpdateTime(task.id, newActualTime);
    }
    setCurrentSession(0);
    setStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      {/* Time Display */}
      <div className="flex items-center space-x-1 text-gray-500">
        <Clock className="w-3 h-3" />
        <span>
          {isTracking ? formatTime(currentSession) : 
           task.actualTime ? formatMinutes(task.actualTime) : '0m'}
        </span>
        {task.estimatedTime && (
          <span className="text-gray-400">
            / {formatMinutes(task.estimatedTime)}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {task.estimatedTime && task.actualTime && (
        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              task.actualTime > task.estimatedTime ? 'bg-red-400' : 'bg-green-400'
            }`}
            style={{
              width: `${Math.min((task.actualTime / task.estimatedTime) * 100, 100)}%`
            }}
          />
        </div>
      )}

      {/* Control Buttons - Hidden for completed tasks */}
      {!task.completed && (
        <div className="flex items-center space-x-1">
          {!isTracking ? (
            <button
              onClick={handleStart}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Start tracking"
            >
              <Play className="w-3 h-3" />
            </button>
          ) : (
            <>
              <button
                onClick={handlePause}
                className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                title="Pause tracking"
              >
                <Pause className="w-3 h-3" />
              </button>
              <button
                onClick={handleStop}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Stop tracking"
              >
                <Square className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeTracking;