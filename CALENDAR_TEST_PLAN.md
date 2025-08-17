# Calendar Integration Test Plan

## Overview
This document outlines the test cases to verify that the calendar integration fixes have been properly implemented.

## Test Cases

### 1. Calendar Event Persistence
**Test**: Create a calendar event and verify it persists after refresh
**Steps**:
1. Open the application at http://localhost:5175/
2. Click the Calendar button in the header
3. Create a new calendar event by:
   - Click "Add Event"
   - Fill in title: "Test Calendar Event"
   - Set a future date and time
   - Select a color
   - Click "Add Event"
4. Verify the event appears on the calendar
5. Refresh the browser (F5 or Ctrl+R)
6. Open the calendar again
7. **Expected**: The event should still be visible

### 2. Tasks with Due Dates Appear on Calendar
**Test**: Verify that tasks with due dates automatically show up as calendar events
**Steps**:
1. Create a task with a due date:
   - Click the "+" button to add a task
   - Enter title: "Test Task with Due Date"
   - Set priority (high, medium, or low)
   - Set a due date (today or future)
   - Click "Add Task"
2. Open the calendar
3. **Expected**: The task should appear on the calendar on the due date with:
   - Title prefixed with "📋"
   - Color based on priority (high=rose, medium=amber, low=emerald)
   - Read-only (cannot be edited directly)

### 3. Calendar Event to Task Creation
**Test**: Create a task from a calendar event
**Steps**:
1. Open the calendar
2. Click "Add Event"
3. Fill in the event details:
   - Title: "Meeting with Client"
   - Description: "Discuss project requirements"
   - Set date and time
   - Select a task list from dropdown
   - **Check the "Also create a task" checkbox**
4. Click "Add Event"
5. **Expected**: 
   - Calendar event should be created
   - A task should be created in the selected list
   - Notification should appear confirming task creation
6. Close the calendar and verify the task appears in the selected list

### 4. Read-Only Task Events
**Test**: Verify that task-derived calendar events cannot be edited
**Steps**:
1. Create a task with due date (if not already done from Test 2)
2. Open the calendar
3. Click on a task-derived event (one with "📋" prefix)
4. **Expected**: The event should not open for editing (should be read-only)
5. Check browser console for message: "Task-based event clicked (read-only)"

### 5. Calendar Event Updates and Deletions
**Test**: Verify calendar events can be updated and deleted
**Steps**:
1. Create a calendar event
2. Click on the event to edit it
3. Change the title and save
4. **Expected**: Event should be updated on calendar
5. Click on the event again and click "Delete"
6. **Expected**: Event should be removed from calendar
7. Refresh browser
8. **Expected**: Changes should persist

### 6. Multiple Lists Integration
**Test**: Verify calendar works with multiple task lists
**Steps**:
1. Create multiple task lists if they don't exist
2. Create tasks with due dates in different lists
3. Open calendar
4. **Expected**: Tasks from all lists should appear on calendar
5. When creating calendar events, all lists should be available in dropdown

## Console Log Monitoring
While testing, monitor the browser console (F12 → Console) for these debug messages:
- `📅 Adding calendar event:` - When events are created
- `📝 Updating calendar event:` - When events are updated
- `🗑️ Deleting calendar event:` - When events are deleted
- `📋 Tasks converted to calendar events:` - Shows number of tasks with due dates
- `🔄 Combining calendar events:` - Shows total events being displayed
- `✅ Task created from calendar event` - When tasks are created from events

## Expected Browser Notifications
If browser notifications are enabled, you should see:
- "Task Created from Calendar! 📅" when a task is created from calendar event
- "Task Created!" when using the "create task" checkbox

## Data Persistence Verification
1. Check localStorage in browser dev tools (F12 → Application → Local Storage)
2. Look for these keys:
   - `task-flow-lists` - Should contain all task lists and their tasks
   - `task-flow-calendar-events` - Should contain calendar-specific events
   - `task-flow-settings` - Should contain app settings

## Success Criteria
- ✅ Calendar events persist after browser refresh
- ✅ Tasks with due dates automatically appear on calendar
- ✅ Tasks can be created from calendar events
- ✅ Task-derived calendar events are read-only
- ✅ Calendar events can be created, updated, and deleted
- ✅ All operations work across multiple task lists
- ✅ Console logs show expected debug information
- ✅ Browser notifications work (if permissions granted)
