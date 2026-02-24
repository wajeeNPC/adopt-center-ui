import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import api from '../../services/api';

const BreedAutocomplete = ({ value, onChange, disabled, species }) => {
    const [open, setOpen] = useState(false);
    const [breeds, setBreeds] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBreeds = async () => {
            // Only fetch if species is selected
            if (!species) {
                setBreeds([]);
                return;
            }

            setLoading(true);
            try {
                console.log('Fetching breeds for species:', species);
                const response = await api.resources.getBreeds(species);
                console.log('Breed API response:', response);
                
                if (response.success && response.data) {
                    setBreeds(response.data);
                    console.log(`Loaded ${response.data.length} breeds for ${species}`);
                } else {
                    console.warn('No breeds data in response:', response);
                    setBreeds([]);
                }
            } catch (error) {
                console.error("Failed to load breeds", error);
                setBreeds([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBreeds();
    }, [species]); // Re-fetch when species changes

    // Determine if component should be disabled
    const isDisabled = disabled || !species;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={isDisabled}
                >
                    {value
                        ? breeds.find((breed) => breed === value) || value
                        : species ? "Select breed..." : "Select species first..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput placeholder="Search breed..." />
                    <CommandList>
                        <CommandEmpty>
                            {loading ? "Loading breeds..." : "No breed found."}
                        </CommandEmpty>
                        <CommandGroup>
                            {breeds.map((breed, index) => (
                                <CommandItem
                                    key={`${breed}-${index}`}
                                    value={breed}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === breed ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {breed}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default BreedAutocomplete;
