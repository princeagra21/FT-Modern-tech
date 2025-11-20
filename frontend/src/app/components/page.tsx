"use client"

import { Button } from '@/components/ui/button'
import React from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import StatusBadge from '@/components/common/StatusBadge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import { Checkbox } from "@/components/ui/checkbox"  
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectSeparator
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const Components = () => {
    const [open, setOpen] = React.useState(false)
      const [checked, setChecked] = React.useState(true)
  const [radioValue, setRadioValue] = React.useState("option1")
    const [value, setValue] = React.useState(40)
    const [radioChoice, setRadioChoice] = React.useState("option1")
    const [selectedOption, setSelectedOption] = React.useState("apple")
 

  return (
    <div className='p-10'>
      <h1 className='typo-h1'>Components</h1>

     
      {/* ---------- BUTTONS ---------- */}
      <div className='mt-5'>
        <h2 className="typo-h2">Button</h2>
        <div className='flex gap-5'>

        <Button variant="default" size="default">
          Default Button
        </Button>

        <Button variant="destructive" size="sm">
          Delete
        </Button>

        <Button variant="outline" size="lg">
          Outline Button
        </Button>

        <Button variant="ghost" size="icon">
         Ghost
        </Button>
        </div>


      </div>

       {/* ---------- ALERT DIALOG ---------- */}
     <div className="mt-8">
        <h2 className="typo-h2">Alert Dialog</h2>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Open Alert</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the item.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

         {/* ---------- ALERT COMPONENT ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Alert</h2>

        {/* Default Alert */}
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            This is a simple informational alert.
          </AlertDescription>
        </Alert>

        {/* Destructive Alert */}
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      </div>


      {/* ---------- AVATAR ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Avatar</h2>

        <div className="flex gap-4 items-center">

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
            <AvatarFallback>HM</AvatarFallback>
          </Avatar>

          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>

          <Avatar className="size-12">
            <AvatarImage src="https://i.pravatar.cc/150" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>

        </div>
      </div>

           {/* ---------- STATUS BADGE ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Status Badge</h2>

        <div className="flex gap-3 flex-wrap">

          <StatusBadge status="active" showIcon />
          <StatusBadge status="completed" showIcon />
          <StatusBadge status="pending" showIcon />
          <StatusBadge status="failed" showIcon />
          <StatusBadge status="inactive" showIcon />
          <StatusBadge status="error" showIcon />
          <StatusBadge status="expiring soon" showIcon />
          <StatusBadge status="closed" showIcon />
          <StatusBadge status="answered" showIcon />

        </div>
      </div>

       {/* ---------- CARD ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Card</h2>

        <div className="grid gap-6 max-w-lg">

          {/* Simple Card */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>
                This is a basic card layout.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm">Card content goes here...</p>
            </CardContent>

            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          {/* Card with Action Icon */}
          <Card>
            <CardHeader>
              <CardTitle>Card With Action</CardTitle>
              <CardDescription>Includes a header action.</CardDescription>

              <CardAction>
                <Button size="sm" variant="outline">Edit</Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <p className="text-sm">You can add actions inside the header.</p>
            </CardContent>
          </Card>

        </div>
      </div>

  {/* ---------- CHECKBOX ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Checkbox</h2>

        <div className="flex flex-col gap-4">

          <label className="flex items-center gap-2">
            <Checkbox />
            <span>Default</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox defaultChecked />
            <span>Checked</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox disabled />
            <span>Disabled</span>
          </label>

        </div>
      </div>


    {/* ---------- COMMAND ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Command Palette</h2>

        <Button onClick={() => setOpen(true)}>Open Command</Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search..." />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Suggestions">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Actions">
              <CommandItem>Logout</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

        {/* ---------- DIALOG ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Dialog</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a simple dialog description.
              </DialogDescription>
            </DialogHeader>

            <p className="text-sm">
              You can place any content inside this dialog.
            </p>

            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

 {/* ---------- DROPDOWN MENU ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Dropdown Menu</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Dropdown</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">

            <DropdownMenuLabel>Options</DropdownMenuLabel>

            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              checked={checked}
              onCheckedChange={setChecked}
            >
              Enable Feature
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <DropdownMenuRadioGroup
              value={radioValue}
              onValueChange={setRadioValue}
            >
              <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Action 1</DropdownMenuItem>
                <DropdownMenuItem>Sub Action 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>

         {/* ---------- INPUT ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Input</h2>

        <div className="max-w-sm flex flex-col gap-4">
          <Input placeholder="Enter your name" />

          <Input type="email" placeholder="Email address" />

          <Input type="password" placeholder="Password" />

          <Input disabled placeholder="Disabled input" />

          <Input aria-invalid="true" placeholder="Error state" />
        </div>
      </div>


      {/* ---------- POPOVER ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Popover</h2>

        <Popover>
          <PopoverTrigger asChild>
            <Button>Open Popover</Button>
          </PopoverTrigger>

          <PopoverContent>
            <p className="text-sm">
              This is a popover content area. You can place any UI here.
            </p>
          </PopoverContent>
        </Popover>
      </div>

        {/* ---------- PROGRESS ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Progress</h2>

        <div className="max-w-sm flex flex-col gap-4">

          <Progress value={value} />

          <Button
            size="sm"
            onClick={() => setValue(Math.min(100, value + 10))}
          >
            Increase 10%
          </Button>
        </div>
      </div>

     {/* ---------- RADIO GROUP ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Radio Group</h2>

        <RadioGroup
         value={radioChoice}
          onValueChange={setRadioChoice}
          className="flex flex-col gap-4"
        >
          <label className="flex items-center gap-2">
            <RadioGroupItem value="option1" />
            <span>Option 1</span>
          </label>

          <label className="flex items-center gap-2">
            <RadioGroupItem value="option2" />
            <span>Option 2</span>
          </label>

          <label className="flex items-center gap-2">
            <RadioGroupItem value="option3" />
            <span>Option 3</span>
          </label>
        </RadioGroup>
      </div>

       {/* ---------- SCROLL AREA ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Scroll Area</h2>

        <ScrollArea className="w-60 h-40 border rounded-md p-2">
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="text-sm">
                Item {i + 1}
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>

  {/* ---------- SELECT ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Select</h2>

        <Select value={selectedOption} onValueChange={setSelectedOption}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Choose one..." />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>

              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>

              <SelectSeparator />

              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="mango">Mango</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

            {/* ---------- SEPARATOR ---------- */}
      <div className="mt-8">
        <h2 className="typo-h2">Separator</h2>

        <div className="max-w-sm space-y-4">

          <p>Above Separator</p>
          <Separator />
          <p>Below Separator</p>

          <div className="flex items-center gap-4 mt-6">
            <span>Left</span>
            <Separator orientation="vertical" />
            <span>Right</span>
          </div>

        </div>
      </div>


    </div>
  )
}

export default Components
