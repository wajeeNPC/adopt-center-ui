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
    onClearFilters
}) => {
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
            <div className="flex items-center gap-3">
                <div className="w-40">
                    <Select value={speciesFilter} onValueChange={onSpeciesChange}>
                        <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Species" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Species</SelectItem>
                            <SelectItem value="Dog">Dogs</SelectItem>
                            <SelectItem value="Cat">Cats</SelectItem>
                            <SelectItem value="Rabbit">Rabbits</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-40">
                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Adopted">Adopted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {(searchTerm || statusFilter !== 'all' || speciesFilter !== 'all') && (
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
