import { useState } from 'react';
import type { FilterState } from '@/types/organization';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface ProjectFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'IT', label: 'IT' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Supplies', label: 'Supplies' },
];

const deadlineOptions = [
  { value: 'any', label: 'Any Time' },
  { value: 'urgent', label: 'Urgent (< 3 days)' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
];

export function ProjectFilters({ filters, onFilterChange }: ProjectFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleFilterUpdate = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (value: string) => {
    const category = value === '' ? undefined : value;
    handleFilterUpdate('category', category);
  };

  const handleBudgetMinChange = (value: string) => {
    const budgetMin = value ? parseFloat(value) : undefined;
    handleFilterUpdate('budgetMin', budgetMin);
  };

  const handleBudgetMaxChange = (value: string) => {
    const budgetMax = value ? parseFloat(value) : undefined;
    handleFilterUpdate('budgetMax', budgetMax);
  };

  const handleDeadlineChange = (value: string) => {
    const deadline = value === 'any' ? undefined : (value as FilterState['deadline']);
    handleFilterUpdate('deadline', deadline);
  };

  const handleLocationChange = (value: string) => {
    const location = value || undefined;
    handleFilterUpdate('location', location);
  };

  const handleSearchChange = (value: string) => {
    const searchQuery = value || undefined;
    handleFilterUpdate('searchQuery', searchQuery);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {};
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-xl p-6 border border-white/5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filter Projects</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input - Full width */}
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Search projects by title, description, or tags..."
            value={localFilters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <Select
            label="Category"
            value={localFilters.category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            options={categoryOptions}
            fullWidth
          />
        </div>

        {/* Budget Min */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Min Budget ($)
          </label>
          <Input
            type="number"
            placeholder="Min"
            value={localFilters.budgetMin || ''}
            onChange={(e) => handleBudgetMinChange(e.target.value)}
            className="w-full"
            min="0"
          />
        </div>

        {/* Budget Max */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Max Budget ($)
          </label>
          <Input
            type="number"
            placeholder="Max"
            value={localFilters.budgetMax || ''}
            onChange={(e) => handleBudgetMaxChange(e.target.value)}
            className="w-full"
            min="0"
          />
        </div>

        {/* Deadline Select */}
        <div>
          <Select
            label="Deadline"
            value={localFilters.deadline || 'any'}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            options={deadlineOptions}
            fullWidth
          />
        </div>

        {/* Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <Input
            type="text"
            placeholder="City or Country"
            value={localFilters.location || ''}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
