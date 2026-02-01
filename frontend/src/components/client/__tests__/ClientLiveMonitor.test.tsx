import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientLiveMonitor from '../ClientLiveMonitor';

// Mock SignalR - must be inline in vi.mock factory
vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: class {
    withUrl() { return this; }
    withAutomaticReconnect() { return this; }
    build() {
      return {
        on: vi.fn(),
        start: vi.fn().mockResolvedValue(undefined),
        invoke: vi.fn().mockResolvedValue(undefined),
        stop: vi.fn().mockResolvedValue(undefined),
      };
    }
  },
}));

// Mock API client
vi.mock('@/services/api', () => ({
  default: {
    put: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

// Mock toast utilities
vi.mock('@/utils/toast', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
}));

describe('ClientLiveMonitor', () => {
  it('should render without crashing', () => {
    const { container } = render(<ClientLiveMonitor auctionId="d479e8f9-a378-4df8-ba01-09c27ef42edd" />);
    expect(container).toBeInTheDocument();
  });

  it('should accept auctionId prop', () => {
    const { container } = render(<ClientLiveMonitor auctionId="a1b2c3d4-e5f6-7890-abcd-ef1234567890" />);
    expect(container).toBeInTheDocument();
  });
});


