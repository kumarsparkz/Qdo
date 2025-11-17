/**
 * Example tests for task types and utilities
 */

import { getTaskQuadrant, groupTasksByQuadrant, type Task } from '../types';

describe('Task Types', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    project_id: 'proj-1',
    user_id: 'user-1',
    is_urgent: true,
    is_important: true,
    priority: 'must_have',
    status: 'todo',
    deadline: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe('getTaskQuadrant', () => {
    it('should return urgent-important for urgent and important task', () => {
      const quadrant = getTaskQuadrant({
        ...mockTask,
        is_urgent: true,
        is_important: true,
      });
      expect(quadrant).toBe('urgent-important');
    });

    it('should return urgent-not-important for urgent but not important task', () => {
      const quadrant = getTaskQuadrant({
        ...mockTask,
        is_urgent: true,
        is_important: false,
      });
      expect(quadrant).toBe('urgent-not-important');
    });

    it('should return not-urgent-important for not urgent but important task', () => {
      const quadrant = getTaskQuadrant({
        ...mockTask,
        is_urgent: false,
        is_important: true,
      });
      expect(quadrant).toBe('not-urgent-important');
    });

    it('should return not-urgent-not-important for neither urgent nor important task', () => {
      const quadrant = getTaskQuadrant({
        ...mockTask,
        is_urgent: false,
        is_important: false,
      });
      expect(quadrant).toBe('not-urgent-not-important');
    });
  });

  describe('groupTasksByQuadrant', () => {
    it('should group tasks by their quadrants', () => {
      const tasks: Task[] = [
        { ...mockTask, id: '1', is_urgent: true, is_important: true },
        { ...mockTask, id: '2', is_urgent: true, is_important: false },
        { ...mockTask, id: '3', is_urgent: false, is_important: true },
        { ...mockTask, id: '4', is_urgent: false, is_important: false },
      ];

      const grouped = groupTasksByQuadrant(tasks);

      expect(grouped['urgent-important']).toHaveLength(1);
      expect(grouped['urgent-not-important']).toHaveLength(1);
      expect(grouped['not-urgent-important']).toHaveLength(1);
      expect(grouped['not-urgent-not-important']).toHaveLength(1);

      expect(grouped['urgent-important'][0].id).toBe('1');
      expect(grouped['urgent-not-important'][0].id).toBe('2');
      expect(grouped['not-urgent-important'][0].id).toBe('3');
      expect(grouped['not-urgent-not-important'][0].id).toBe('4');
    });

    it('should handle empty task array', () => {
      const grouped = groupTasksByQuadrant([]);

      expect(grouped['urgent-important']).toHaveLength(0);
      expect(grouped['urgent-not-important']).toHaveLength(0);
      expect(grouped['not-urgent-important']).toHaveLength(0);
      expect(grouped['not-urgent-not-important']).toHaveLength(0);
    });
  });
});
