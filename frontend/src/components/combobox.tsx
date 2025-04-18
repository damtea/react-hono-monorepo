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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

interface ComboboxValueType {
  label: string;
  value: string | number | boolean;
}

type ComboboxSelectProps = {
  value: string | number | boolean;
  title: string;
  setValue: (value: string | number | boolean) => void;
  options: ComboboxValueType[];
  hideSearch?: boolean;
} & React.ComponentProps<"button">;

function Combobox({
  value,
  setValue,
  options,
  title,
  className,
  hideSearch = false,
  ...props
}: ComboboxSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant="outline"
          role="combobox"
          type="button"
          className={cn(
            "text-left w-full",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex-1">
            {value
              ? options.find((item) => item.value === value)?.label
              : "Select " + title}
          </div>
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command>
          {!hideSearch && <CommandInput placeholder={`Search here...`} />}

          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandSeparator />
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.label}
                  value={item.label}
                  aria-selected={value === item.value}
                  onSelect={() => {
                    setValue(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      item.value === value ? "opacity-100" : "opacity-0"
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
