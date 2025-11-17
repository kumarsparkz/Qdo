/**
 * Example component tests for EmptyState
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState, EmptyList } from '../EmptyState';
import { Inbox } from 'lucide-react';

describe('EmptyState', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        title="No tasks"
        description="Get started by creating your first task"
      />
    );

    expect(screen.getByText('No tasks')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first task')).toBeInTheDocument();
  });

  it('should render with emoji', () => {
    render(
      <EmptyState
        emoji="📭"
        title="Empty inbox"
      />
    );

    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    render(
      <EmptyState
        icon={Inbox}
        title="Empty inbox"
      />
    );

    // Check if icon is rendered (by checking for the svg element)
    const icon = screen.getByText('Empty inbox').parentElement?.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should call onAction when action button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();

    render(
      <EmptyState
        title="No tasks"
        actionLabel="Create Task"
        onAction={onAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Create Task' });
    await user.click(button);

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when onAction is not provided', () => {
    render(
      <EmptyState
        title="No tasks"
        actionLabel="Create Task"
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('EmptyList', () => {
  it('should render default title and description', () => {
    render(<EmptyList />);

    expect(screen.getByText('No items yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first item.')).toBeInTheDocument();
  });

  it('should render custom title and description', () => {
    render(
      <EmptyList
        title="No projects"
        description="Create a project to get started"
      />
    );

    expect(screen.getByText('No projects')).toBeInTheDocument();
    expect(screen.getByText('Create a project to get started')).toBeInTheDocument();
  });

  it('should call onAction when action button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();

    render(
      <EmptyList
        actionLabel="Add Item"
        onAction={onAction}
      />
    );

    const button = screen.getByRole('button', { name: 'Add Item' });
    await user.click(button);

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
