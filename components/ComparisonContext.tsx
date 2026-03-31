
import React, { createContext, useContext, useState } from 'react';
import { Business } from '../types';

interface ComparisonContextType {
    selectedBusinesses: Business[];
    addToCompare: (business: Business) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isComparisonOpen: boolean;
    setIsComparisonOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedBusinesses, setSelectedBusinesses] = useState<Business[]>([]);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);

    const addToCompare = (business: Business) => {
        if (selectedBusinesses.length >= 3) {
            alert("You can compare up to 3 businesses at a time.");
            return;
        }
        if (!selectedBusinesses.find(b => b.id === business.id)) {
            setSelectedBusinesses([...selectedBusinesses, business]);
        }
    };

    const removeFromCompare = (id: string) => {
        setSelectedBusinesses(selectedBusinesses.filter(b => b.id !== id));
    };

    const clearCompare = () => setSelectedBusinesses([]);

    return (
        <ComparisonContext.Provider value={{ selectedBusinesses, addToCompare, removeFromCompare, clearCompare, isComparisonOpen, setIsComparisonOpen }}>
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) throw new Error("useComparison must be used within ComparisonProvider");
    return context;
};
