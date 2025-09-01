'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterBarProps {
  tags: Array<{ id: number; name: string }>;
  collections: Array<{ id: number; name: string }>;
}

export default function FilterBar({ tags, collections }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagParam = searchParams.get('tags');
    return tagParam ? tagParam.split(',') : [];
  });
  
  const [selectedCollection, setSelectedCollection] = useState(() => {
    return searchParams.get('collection') || '';
  });
  
  const [sortBy, setSortBy] = useState(() => {
    return searchParams.get('sort') || 'newest';
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','));
    }
    
    if (selectedCollection) {
      params.set('collection', selectedCollection);
    }
    
    if (sortBy !== 'newest') {
      params.set('sort', sortBy);
    }
    
    const queryString = params.toString();
    router.push(`/categories${queryString ? `?${queryString}` : ''}`);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedCollection('');
    setSortBy('newest');
    router.push('/categories');
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      {/* Mobile: Collapsible header */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left bg-slate-50 rounded-t-lg border-b"
        >
          <span className="font-medium text-gray-700">
            Filters {(selectedTags.length > 0 || selectedCollection || sortBy !== 'newest') && 
            `(${selectedTags.length + (selectedCollection ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)})`}
          </span>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter content */}
      <div className={`p-4 md:p-6 ${!isExpanded ? 'hidden md:block' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-base md:text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="popular">Most popular</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          {/* Collection Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection
            </label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-base md:text-sm"
            >
              <option value="">All collections</option>
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          {/* Apply/Clear Buttons */}
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 px-6 py-3 md:py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 active:bg-slate-800 transition-colors font-medium touch-manipulation"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-3 md:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tags Filter */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tags (tap to select multiple)
          </label>
          <div className="flex flex-wrap gap-2 max-h-40 md:max-h-32 overflow-y-auto">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.name)}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 touch-manipulation ${
                  selectedTags.includes(tag.name)
                    ? 'bg-slate-600 text-white border-slate-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-slate-400 active:bg-slate-50'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedTags.length > 0 || selectedCollection || sortBy !== 'newest') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            {selectedTags.map(tag => (
              <span key={tag} className="bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {selectedCollection && (
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded">
                Collection: {collections.find(c => c.id.toString() === selectedCollection)?.name}
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded">
                Sort: {sortBy}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}