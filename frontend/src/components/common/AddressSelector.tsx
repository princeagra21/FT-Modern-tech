"use client";

import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface AddressSelectorProps {
  value?: {
    countryCode?: string;
    stateCode?: string;
    city?: string;
  };
  onChange?: (value: {
    countryCode: string;
    stateCode: string;
    city: string;
  }) => void;
}

export default function AddressSelector({ value, onChange }: AddressSelectorProps) {

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [countryCode, setCountryCode] = useState<string | null>(value?.countryCode || null);
  const [stateCode, setStateCode] = useState<string | null>(value?.stateCode || null);
  const [cityName, setCityName] = useState<string | null>(value?.city || null);

  // Load countries initially
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (countryCode) {
      setStates(State.getStatesOfCountry(countryCode));
      setCities([]);
      setStateCode(null);
      setCityName(null);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [countryCode]);

  // Load cities when state changes
  useEffect(() => {
    if (countryCode && stateCode) {
      setCities(City.getCitiesOfState(countryCode, stateCode));
    } else {
      setCities([]);
    }
  }, [countryCode, stateCode]);

  // Notify parent on change
  useEffect(() => {
    onChange?.({
      countryCode: countryCode || "",
      stateCode: stateCode || "",
      city: cityName || "",
    });
  }, [countryCode, stateCode, cityName]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Country */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-muted-foreground font-medium">Country</label>
        <Select
          value={countryCode || ""}
          onValueChange={(val) => setCountryCode(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.isoCode} value={c.isoCode}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-muted-foreground font-medium">State</label>
        <Select
          value={stateCode || ""}
          onValueChange={(val) => setStateCode(val)}
          disabled={!countryCode}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s.isoCode} value={s.isoCode}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-muted-foreground font-medium">City</label>
        <Select
          value={cityName || ""}
          onValueChange={(val) => setCityName(val)}
          disabled={!stateCode}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
