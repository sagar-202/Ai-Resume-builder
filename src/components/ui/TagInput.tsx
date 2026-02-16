
import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
    placeholder?: string;
    tags: string[];
    onTagsChange: (newTags: string[]) => void;
    className?: string;
}

const TagInput: React.FC<TagInputProps> = ({ placeholder, tags, onTagsChange, className }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed && !tags.includes(trimmed)) {
                onTagsChange([...tags, trimmed]);
                setInputValue("");
            }
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            onTagsChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tToRemove: string) => {
        onTagsChange(tags.filter(t => t !== tToRemove));
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-destructive focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Type and press Enter..."}
            />
        </div>
    );
};

export default TagInput;
