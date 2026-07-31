import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from './useFilterStore';

describe('useFilterStore', () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });
  it('should initialize with default pagination page 1', () => {
    const state = useFilterStore.getState();
    expect(state.filters.page).toBe(1);
    expect(state.filters.per_page).toBe(20);
  });
  it('should update filters and reset page to 1', () => {
    useFilterStore.getState().setPage(3);
    expect(useFilterStore.getState().filters.page).toBe(3);
    useFilterStore.getState().setFilter('cargo_num', '00000001059');
    const state = useFilterStore.getState();
    expect(state.filters.cargo_num).toBe('00000001059');
    expect(state.filters.page).toBe(1); 
  });
  it('should reset filters to default state', () => {
    useFilterStore.getState().setFilter('cargo_num', '12345');
    useFilterStore.getState().resetFilters();
    const state = useFilterStore.getState();
    expect(state.filters.cargo_num).toBeUndefined();
    expect(state.filters.page).toBe(1);
  });
});