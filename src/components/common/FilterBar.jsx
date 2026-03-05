import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Button } from '../ui/button';

const FilterBar = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    speciesFilter = 'all',
    onSpeciesChange,
    genderFilter = 'all',
    onGenderChange,
    sizeFilter = 'all',
    onSizeChange,
    onClearFilters
}) => {
    const hasActiveFilter =
        searchTerm ||
        statusFilter !== 'all' ||
        speciesFilter !== 'all' ||
        genderFilter !== 'all' ||
        sizeFilter !== 'all';

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    type="text"
                    placeholder="Search by name or breed..."
                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-pink-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Species */}
                <div className="w-36">
                    <Select value={speciesFilter} onValueChange={onSpeciesChange}>
                        <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Species" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Species</SelectItem>
                            <SelectItem value="Dog">Dogs</SelectItem>
                            <SelectItem value="Cat">Cats</SelectItem>
                            <SelectItem value="Bird">Birds</SelectItem>
                            <SelectItem value="Guinea Pig">Guinea Pigs</SelectItem>
                            <SelectItem value="Hamster">Hamsters</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Status */}
                <div className="w-36">
                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Adopted">Adopted</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Medical Care">Medical Care</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Optional: Gender */}
                {onGenderChange && (
                    <div className="w-36">
                        <Select value={genderFilter} onValueChange={onGenderChange}>
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Unknown">Unknown</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Optional: Size */}
                {onSizeChange && (
                    <div className="w-36">
                        <Select value={sizeFilter} onValueChange={onSizeChange}>
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sizes</SelectItem>
                                <SelectItem value="Small">Small</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Large">Large</SelectItem>
                                <SelectItem value="Extra Large">Extra Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {hasActiveFilter && (
                    <Button
                        variant="ghost"
                        onClick={onClearFilters}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
