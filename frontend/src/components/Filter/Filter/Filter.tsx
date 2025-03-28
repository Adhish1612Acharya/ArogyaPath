import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import FilterProps from "./Filter.types";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const Filter: FC<FilterProps> = ({ filters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(filters)[0]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        newState[key] = key === category ? !newState[key] : false;
      });
      return newState;
    });
  };

  const handleFilterSelect = (category: string, filter: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category] || [];
      const filterCategory = filters[category];

      if (filterCategory.selectType === "single") {
        return { ...prev, [category]: [filter] };
      }

      if (currentFilters.includes(filter)) {
        return { ...prev, [category]: currentFilters.filter((f) => f !== filter) };
      }
      return { ...prev, [category]: [...currentFilters, filter] };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setIsOpen(false);
  };

  const getSelectedCount = (category: string) => selectedFilters[category]?.length || 0;
  const totalSelected = Object.values(selectedFilters).flat().length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg">
          Filter
          {totalSelected > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalSelected}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[85vh] sm:h-[80vh] w-[95vw] sm:w-full flex flex-col p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
            <DialogTitle className="text-lg">Filters</DialogTitle>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            <div className="space-y-2 pb-4">
              {Object.keys(filters).map((category) => (
                <div key={category} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors",
                      expandedCategories[category] && "bg-gray-50"
                    )}
                  >
                    <span className="font-medium text-gray-900">{category}</span>
                    {getSelectedCount(category) > 0 && (
                      <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {getSelectedCount(category)}
                      </span>
                    )}
                    {expandedCategories[category] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  {expandedCategories[category] && (
                    <div className="p-4 space-y-3 border-t">
                      {filters[category].subFilters.map((filter: any) => (
                        <label key={filter} className="flex items-center space-x-3 cursor-pointer min-h-[44px] p-2 rounded">
                          <input
                            type={filters[category].selectType === "double" ? "checkbox" : "radio"}
                            name={category}
                            value={filter}
                            checked={selectedFilters[category]?.includes(filter)}
                            onChange={() => handleFilterSelect(category, filter)}
                            className="w-5 h-5 border rounded-full"
                          />
                          <span className="text-gray-800">{filter}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 flex justify-between space-x-2 bg-background border-t">
            <Button variant="outline" onClick={clearFilters} className="flex-1 border-gray-300 hover:bg-gray-50" size="lg">
              Clear
            </Button>
            <Button onClick={() => setIsOpen(false)} className="flex-1" size="lg">
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Filter;
