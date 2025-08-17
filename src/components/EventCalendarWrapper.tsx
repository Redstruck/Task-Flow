import React from 'react';
import EventCalendar from './EventCalendar';
import { CalendarEvent, TodoList } from '../types';

interface EventCalendarWrapperProps {
  lists: TodoList[];
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
  onTaskCreate?: (listId: string, title: string, dueDate?: Date) => void;
}

const EventCalendarWrapper: React.FC<EventCalendarWrapperProps> = ({
  lists,
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  onTaskCreate
}) => {
  return (
    <EventCalendar
      events={events}
      lists={lists}
      onEventAdd={onEventAdd}
      onEventUpdate={onEventUpdate}
      onEventDelete={onEventDelete}
      onTaskCreate={onTaskCreate}
    />
  );
};

export default EventCalendarWrapper;
