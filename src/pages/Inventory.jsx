import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Trash2, Plus, Download, Upload } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { getImageUrl } from '../lib/utils';
import PageActions from '../components/common/PageActions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import FilterBar from '../components/common/FilterBar';

const Inventory = () => {
  const { pets, deletePet, navigate } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');

  // Filter Logic
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pet.adoptionStatus === statusFilter;
    const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter;

    return matchesSearch && matchesStatus && matchesSpecies;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deletePet(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Species', 'Breed', 'Status', 'Gender', 'Age', 'Adoption Fee'];
    const rows = pets.map((p) => [p.name, p.species, p.breed, p.adoptionStatus, p.gender, p.age, p.adoptionFee]);
    const csv = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'pet_inventory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actionItems = [
    { label: 'Add Pet', icon: Plus, onClick: () => navigate('add-pet') },
    { separator: true },
    { label: 'Export CSV', icon: Download, onClick: handleExportCSV },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Adopted': return 'secondary';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pet Inventory</h1>
          <p className="text-slate-500 mt-1">Manage and track all pets in the shelter.</p>
        </div>
        <PageActions items={actionItems} />
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        speciesFilter={speciesFilter}
        onSpeciesChange={setSpeciesFilter}
        onClearFilters={() => {
          setSearchTerm('');
          setStatusFilter('all');
          setSpeciesFilter('all');
        }}
      />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[250px]">Pet</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No pets found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredPets.map((pet) => (
                <TableRow key={pet._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate('pet-detail', pet._id)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarImage src={getImageUrl(pet.photos?.[0])} alt={pet.name} className="object-cover" />
                        <AvatarFallback>{pet.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">{pet.name}</p>
                        <p className="text-xs text-slate-500">ID: {pet._id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{pet.species}</TableCell>
                  <TableCell>{pet.breed}</TableCell>
                  <TableCell>{pet.age} yrs</TableCell>
                  <TableCell>{pet.gender}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(pet.adoptionStatus)}>
                      {pet.adoptionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate('pet-detail', pet._id); }}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate('edit-pet', pet._id); }}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Pet
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => { e.stopPropagation(); handleDelete(pet._id, pet.name); }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Pet
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredPets.length} of {pets.length} pets
      </div>
    </div>
  );
};

export default Inventory;