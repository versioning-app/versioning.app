import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PermissionEntry } from '@/types/permissions';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  Star,
  Search,
  Code,
  FileText,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ResourceSelectProps = {
  entry: PermissionEntry;
  onUpdate: (updates: Partial<PermissionEntry>) => void;
  resources: string[];
};

export default function ResourceSelect({
  entry,
  onUpdate,
  resources,
}: ResourceSelectProps) {
  const [inputValue, setInputValue] = useState(
    entry.resource === 'custom' ? entry.customResource : entry.resource,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(entry.resource === 'custom');
  const [isWildcard, setIsWildcard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(
      entry.resource === 'custom' ? entry.customResource : entry.resource,
    );
    setIsCustom(entry.resource === 'custom');
    setIsWildcard(entry.resource.includes('*') && entry.resource !== '*');

    // Focus the input if the resource is blank
    if (!entry.resource && !entry.customResource && inputRef.current) {
      inputRef.current.focus();
    }
  }, [entry.resource, entry.customResource]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredResources = resources.filter((resource) =>
    resource.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);

    if (value === '') {
      // Revert to initial state when input is empty
      setIsCustom(false);
      setIsWildcard(false);
      onUpdate({ resource: '', customResource: '' });
    } else if (value === '*') {
      setIsCustom(false);
      setIsWildcard(false);
      onUpdate({ resource: '*', customResource: '' });
    } else if (value.includes('*')) {
      setIsCustom(true);
      setIsWildcard(true);
      onUpdate({ resource: 'custom', customResource: value });
    } else {
      const resourceExists = resources.includes(value);
      setIsCustom(!resourceExists);
      setIsWildcard(false);

      if (resourceExists) {
        onUpdate({ resource: value, customResource: '' });
      } else {
        onUpdate({ resource: 'custom', customResource: value });
      }
    }
  };

  const handleSelectResource = (resource: string) => {
    setInputValue(resource);
    setIsCustom(false);
    setIsWildcard(false);
    onUpdate({ resource, customResource: '' });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelectCustomResource = () => {
    setIsCustom(true);
    setIsWildcard(false);
    onUpdate({ resource: 'custom', customResource: inputValue });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    // Delay closing the dropdown to allow for click events on dropdown items
    setTimeout(() => setIsOpen(false), 200);
  };

  const getInputIcon = () => {
    if (!inputValue) {
      return (
        <Lock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      );
    } else if (inputValue === '*') {
      return (
        <Star className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
      );
    } else if (isCustom && !isWildcard) {
      return (
        <Code className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
      );
    } else if (isWildcard) {
      return (
        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
      );
    }
    return null;
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label htmlFor="resource" className="text-sm font-medium">
        Resource
      </Label>
      <div className="relative">
        <div className="flex">
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              id="resource"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              onBlur={handleBlur}
              placeholder="Type to search or enter custom resource"
              className={cn(
                'w-full pr-8',
                isCustom && 'border-purple-500 focus:ring-purple-500',
                isWildcard && 'border-blue-500 focus:ring-blue-500',
              )}
            />
            {getInputIcon()}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="ml-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredResources.map((resource) => (
              <div
                key={resource}
                className={cn(
                  'px-4 py-2 cursor-pointer flex items-center',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground',
                )}
                onMouseDown={() => handleSelectResource(resource)}
              >
                <FileText className="w-4 h-4 mr-2 text-green-500" />
                {resource}
              </div>
            ))}
            {inputValue &&
              !resources.includes(inputValue) &&
              inputValue !== '*' && (
                <div
                  className={cn(
                    'px-4 py-2 cursor-pointer flex items-center',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground',
                  )}
                  onMouseDown={handleSelectCustomResource}
                >
                  <Code className="w-4 h-4 mr-2 text-purple-500" />
                  Use custom resource: {inputValue}
                </div>
              )}
          </div>
        )}
      </div>
      {isCustom && !isWildcard && inputValue !== '*' && (
        <p className="text-sm text-purple-500 mt-1">
          Using custom resource: {inputValue}
        </p>
      )}
      {isWildcard && inputValue !== '*' && (
        <p className="text-sm text-blue-500 mt-1">
          Using wildcard search: {inputValue}
        </p>
      )}
      {inputValue === '*' && (
        <p className="text-sm text-blue-500 mt-1">All resources selected</p>
      )}
    </div>
  );
}
