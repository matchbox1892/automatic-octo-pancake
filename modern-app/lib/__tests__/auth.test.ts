import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '@/lib/auth';

beforeEach(() => {
  vi.useFakeTimers();
  // reset store state
  useAuthStore.setState({ isAuthenticated: false, authName: undefined, expiresAt: null });
});

afterEach(() => {
  vi.useRealTimers();
  useAuthStore.setState({ isAuthenticated: false, authName: undefined, expiresAt: null });
});

describe('auth store and timeout', () => {
  it('login/logout updates state', () => {
    act(() => {
      useAuthStore.getState().login('tester');
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    act(() => {
      useAuthStore.getState().logout();
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('startTimeout triggers logout after duration', () => {
    act(() => {
      useAuthStore.getState().login('tester');
      useAuthStore.getState().startTimeout(0.001); // 0.001 minutes = 60ms
    });
    // advance enough time for timer (ms + 1000 in implementation)
    vi.advanceTimersByTime(1500);
    // allow any pending microtasks
    act(() => {});
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
