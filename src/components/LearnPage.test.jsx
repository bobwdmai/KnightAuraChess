import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LearnPage from './LearnPage.jsx';

describe('LearnPage', () => {
  it('renders a clear rule map on the Learn page', () => {
    render(
      <LearnPage
        onBack={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /aura source/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /empowered squares/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /legal jump/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /hard limits/i })).toBeInTheDocument();
    expect(screen.getByText(/white knights empower nearby white pieces/i)).toBeInTheDocument();
    expect(screen.queryByText(/interactive tutorials/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/practice positions/i)).not.toBeInTheDocument();
  });
});
