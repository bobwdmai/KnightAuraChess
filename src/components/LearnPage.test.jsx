import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LearnPage from './LearnPage.jsx';

describe('LearnPage', () => {
  it('renders the learn page with all sections', () => {
    render(
      <LearnPage
        onBack={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /the aura, at a glance/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /how a move actually plays out/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /three quick checks/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /four terms you.ll hear/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /friendly knights cast an/i })).toBeInTheDocument();
    expect(screen.queryByText(/interactive tutorials/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/practice positions/i)).not.toBeInTheDocument();
  });
});
