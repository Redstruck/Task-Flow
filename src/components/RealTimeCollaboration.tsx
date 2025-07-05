import React, { useState, useEffect, useRef } from 'react';
import { Users, Video, Phone, Share2, Eye, Edit3, TextCursor as Cursor, Wifi, WifiOff } from 'lucide-react';
import { Collaborator, RealTimeEvent, Task } from '../types';

interface RealTimeCollaborationProps {
  collaborators: Collaborator[];
  currentUser: string;
  onSendMessage: (message: string) => void;
  onStartCall: (type: 'video' | 'audio') => void;
  onShareScreen: () => void;
  isConnected: boolean;
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({
  collaborators,
  currentUser,
  onSendMessage,
  onStartCall,
  onShareScreen,
  isConnected,
}) => {
  const [activeUsers, setActiveUsers] = useState<Set<string>>(new Set());
  const [userCursors, setUserCursors] = useState<Record<string, { x: number; y: number; user: string }>>({});

  // Simulate real-time events
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate user activity
      const randomUser = collaborators[Math.floor(Math.random() * collaborators.length)];
      if (randomUser && Math.random() > 0.7) {
        setActiveUsers(prev => new Set([...prev, randomUser.id]));
        setTimeout(() => {
          setActiveUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(randomUser.id);
            return newSet;
          });
        }, 5000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [collaborators]);

  // Track mouse movements for cursor sharing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isConnected) {
        // In a real implementation, this would broadcast to other users
        setUserCursors(prev => ({
          ...prev,
          [currentUser]: { x: e.clientX, y: e.clientY, user: currentUser }
        }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [currentUser, isConnected]);

  const getStatusColor = (user: Collaborator) => {
    if (activeUsers.has(user.id)) return 'bg-green-500';
    if (user.lastActive && new Date().getTime() - new Date(user.lastActive).getTime() < 300000) {
      return 'bg-yellow-500';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 z-40 animate-in slide-in-from-bottom-2 duration-300">
      {/* User Cursors */}
      {Object.entries(userCursors).map(([userId, cursor]) => (
        userId !== currentUser && (
          <div
            key={userId}
            className="fixed pointer-events-none z-50 transition-all duration-100"
            style={{ left: cursor.x, top: cursor.y }}
          >
            <Cursor className="w-4 h-4 text-purple-600" />
            <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-lg ml-2 -mt-1">
              {cursor.user}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default RealTimeCollaboration;