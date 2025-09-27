'use client';

import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import {
  type Location,
  generateGoogleMapsLink,
  generateW3WMapsLink,
  getW3WCoordinates,
  getW3WFromCoordinates,
  getW3WSuggestions,
  validateCoordinates,
} from '@/lib/location-utils';

interface LocationInputProps {
  value: Location;
  onChange: (location: Location) => void;
  label?: string;
  showW3W?: boolean;
  showGPS?: boolean;
}

export function LocationInput({ 
  value, 
  onChange,
  label,
  showW3W = true,
  showGPS = true
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedGetSuggestions = useCallback(
    debounce(async (input: string) => {
      if (input.length >= 3) {
        const results = await getW3WSuggestions(input);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleW3WChange = useCallback(async (words: string) => {
    onChange({ ...value, what3words: words });
    debouncedGetSuggestions(words);

    // If GPS is empty, try to get coordinates
    if (!value.gpsLatitude && !value.gpsLongitude) {
      const coords = await getW3WCoordinates(words);
      if (coords) {
        onChange({
          ...value,
          what3words: words,
          gpsLatitude: coords.lat.toString(),
          gpsLongitude: coords.lng.toString()
        });
      }
    }
  }, [value, onChange, debouncedGetSuggestions]);

  const handleGPSChange = useCallback(async (lat: string, lng: string) => {
    if (validateCoordinates(lat, lng)) {
      onChange({
        ...value,
        gpsLatitude: lat,
        gpsLongitude: lng
      });

      // If W3W is empty, try to get words
      if (!value.what3words) {
        const words = await getW3WFromCoordinates(parseFloat(lat), parseFloat(lng));
        if (words) {
          onChange({
            ...value,
            what3words: words,
            gpsLatitude: lat,
            gpsLongitude: lng
          });
        }
      }
    }
  }, [value, onChange]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {label && <h3 className="text-lg font-medium">{label}</h3>}
      
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={value.address || ''}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
          placeholder="Address"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={value.room || ''}
          onChange={(e) => onChange({ ...value, room: e.target.value })}
          placeholder="Room/Unit"
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <input
          type="text"
          value={value.city || ''}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          placeholder="City"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={value.state || ''}
          onChange={(e) => onChange({ ...value, state: e.target.value })}
          placeholder="State"
          className="p-2 border rounded w-24"
        />
        <input
          type="text"
          value={value.zip || ''}
          onChange={(e) => onChange({ ...value, zip: e.target.value })}
          placeholder="ZIP"
          className="p-2 border rounded w-24"
        />
      </div>

      {showW3W && (
        <div className="relative">
          <input
            type="text"
            value={value.what3words || ''}
            onChange={(e) => handleW3WChange(e.target.value)}
            placeholder="what3words"
            className="w-full p-2 border rounded"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleW3WChange(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {value.what3words && (
            <a
              href={generateW3WMapsLink(value.what3words)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View on what3words
            </a>
          )}
        </div>
      )}

      {showGPS && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={value.gpsLatitude || ''}
              onChange={(e) => handleGPSChange(e.target.value, value.gpsLongitude || '')}
              placeholder="Latitude"
              className="p-2 border rounded"
            />
            <input
              type="text"
              value={value.gpsLongitude || ''}
              onChange={(e) => handleGPSChange(value.gpsLatitude || '', e.target.value)}
              placeholder="Longitude"
              className="p-2 border rounded"
            />
          </div>
          {value.gpsLatitude && value.gpsLongitude && validateCoordinates(value.gpsLatitude, value.gpsLongitude) && (
            <a
              href={generateGoogleMapsLink(value.gpsLatitude, value.gpsLongitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View on Google Maps
            </a>
          )}
        </div>
      )}
    </div>
  );
}