import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

interface ComboboxValueType {
  label: string;
  value: string | number | boolean;
}

type ComboboxSelectProps<T extends FieldValues> = {
  control: Control<T>;
  title: string;
  name: Path<T>;
  options: ComboboxValueType[];
};

function Combobox<T extends FieldValues>({
  control,
  name,
  options,
  title,
}: ComboboxSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const { field } = useController({ name, control });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            type="button"
            className={cn(
              "text-left w-full",
              !field.value && "text-muted-foreground"
            )}
          >
            <div className="flex-1">
              {field.value
                ? options.find((item) => item.value === field.value)?.label
                : "Select " + title}
            </div>
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command>
          <CommandInput placeholder={`Search here...`} />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandSeparator />
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.label}
                  value={item.label}
                  aria-selected={field.value === item.value}
                  onSelect={() => {
                    field.onChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      item.value === field.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Combobox;
