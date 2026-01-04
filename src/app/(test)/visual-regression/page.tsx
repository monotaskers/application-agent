"use client";

/**
 * Visual Regression Test Page
 *
 * This page showcases all migrated ReUI components in both light and dark modes.
 * Use this page for manual visual testing and as a baseline for automated visual regression testing.
 *
 * Access at: /test/visual-regression
 */

import { ReactElement, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RiErrorWarningFill, RiInformationFill } from "@remixicon/react";
import { PieChart } from "@/components/charts/pie-chart";
import type { ChartConfig } from "@/components/charts/chart";

export default function VisualRegressionTestPage(): ReactElement {
  const { setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="h-screen overflow-y-auto scroll-smooth bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-8 p-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-4xl font-bold">Visual Regression Test</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive component showcase for light/dark mode testing
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <Button onClick={toggleTheme} variant="outline">
              {isDark ? "🌙" : "☀️"} {isDark ? "Dark" : "Light"} Mode
            </Button>
          </div>
        </div>

        {/* Theme Indicator */}
        <Alert>
          <RiInformationFill className="h-4 w-4" />
          <AlertTitle>Current Theme</AlertTitle>
          <AlertDescription>
            Testing in <strong>{isDark ? "Dark" : "Light"}</strong> mode. Toggle
            between themes to verify all components render correctly in both
            modes.
          </AlertDescription>
        </Alert>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>All button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="dashed">Dashed</Button>
              <Button variant="mono">Mono</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🎨</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>
                Disabled Outline
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Components */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <CardDescription>
              Inputs, selects, checkboxes, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="input-test">Input</Label>
                <Input id="input-test" placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="select-test">Select</Label>
                <Select>
                  <SelectTrigger id="select-test">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="textarea-test">Textarea</Label>
                <Textarea id="textarea-test" placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slider-test">Slider</Label>
                <Slider
                  id="slider-test"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox-test" />
                <Label htmlFor="checkbox-test">Checkbox</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-test" />
                <Label htmlFor="switch-test">Switch</Label>
              </div>
              <RadioGroup defaultValue="option1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="radio1" />
                  <Label htmlFor="radio1">Radio 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="radio2" />
                  <Label htmlFor="radio2">Radio 2</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Badges</CardTitle>
            <CardDescription>
              Status indicators and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <RiInformationFill className="h-4 w-4" />
              <AlertTitle>Info Alert</AlertTitle>
              <AlertDescription>
                This is an informational alert message.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <RiErrorWarningFill className="h-4 w-4" />
              <AlertTitle>Error Alert</AlertTitle>
              <AlertDescription>
                This is an error alert message.
              </AlertDescription>
            </Alert>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>Card component variants</CardDescription>
          </CardHeader>
          <CardContent>
            <Card>
              <CardHeader>
                <CardTitle>Nested Card</CardTitle>
                <CardDescription>This is a nested card example</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>

        {/* Data Display */}
        <Card>
          <CardHeader>
            <CardTitle>Data Display</CardTitle>
            <CardDescription>Tables, avatars, progress bars</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <Progress value={65} />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Badge>Active</Badge>
                  </TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Inactive</Badge>
                  </TableCell>
                  <TableCell>User</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pie Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Pie Charts</CardTitle>
            <CardDescription>
              Reusable pie chart component with various configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Pie Chart */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Basic Pie Chart</h4>
              <PieChart
                data={[
                  { category: "Chrome", value: 275 },
                  { category: "Safari", value: 200 },
                  { category: "Firefox", value: 287 },
                ]}
                dataKey="value"
                categoryKey="category"
                title="Browser Usage"
                description="Basic pie chart with default styling"
              />
            </div>

            {/* Custom Colors */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Custom Colors</h4>
              <PieChart
                data={[
                  { category: "Active", value: 75 },
                  { category: "Inactive", value: 25 },
                ]}
                dataKey="value"
                categoryKey="category"
                title="User Status"
                colors={["#22c55e", "#ef4444"]}
                centerLabel={{
                  label: "Total Users",
                  valueFormatter: (v) => v.toLocaleString(),
                }}
              />
            </div>

            {/* Custom Center Label */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">
                Custom Center Label
              </h4>
              <PieChart
                data={[
                  { category: "Q1", value: 120 },
                  { category: "Q2", value: 150 },
                  { category: "Q3", value: 180 },
                  { category: "Q4", value: 200 },
                ]}
                dataKey="value"
                categoryKey="category"
                title="Quarterly Sales"
                centerLabel={{
                  label: "Total Sales",
                  valueFormatter: (v) => `$${v.toLocaleString()}`,
                }}
                footer="Based on data from 2024"
              />
            </div>

            {/* Custom Footer */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Custom Footer</h4>
              <PieChart
                data={[
                  { category: "Desktop", value: 450 },
                  { category: "Mobile", value: 320 },
                  { category: "Tablet", value: 130 },
                ]}
                dataKey="value"
                categoryKey="category"
                title="Device Distribution"
                footer={
                  <div className="text-sm">
                    <div className="font-medium">
                      Desktop leads with{" "}
                      {((450 / (450 + 320 + 130)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground mt-1">
                      Based on analytics data
                    </div>
                  </div>
                }
              />
            </div>

            {/* Without Card Wrapper */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">
                Without Card Wrapper
              </h4>
              <div className="border rounded-lg p-4">
                <PieChart
                  data={[
                    { category: "A", value: 40 },
                    { category: "B", value: 35 },
                    { category: "C", value: 25 },
                  ]}
                  dataKey="value"
                  categoryKey="category"
                  showCard={false}
                  size={{ height: 200, className: "w-full" }}
                  ariaLabel="Simple pie chart without card wrapper"
                />
              </div>
            </div>

            {/* Large Dataset */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">
                Large Dataset (10+ segments)
              </h4>
              <PieChart
                data={Array.from({ length: 12 }, (_, i) => ({
                  category: `Category ${i + 1}`,
                  value: (i + 1) * 10,
                }))}
                dataKey="value"
                categoryKey="category"
                title="Large Dataset Example"
                description="Testing with 12 data segments"
              />
            </div>

            {/* Single Item */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Single Data Item</h4>
              <PieChart
                data={[{ category: "All", value: 100 }]}
                dataKey="value"
                categoryKey="category"
                title="Single Item Example"
                description="Renders as complete circle (100%)"
              />
            </div>

            {/* Empty State */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Empty State</h4>
              <PieChart
                data={[]}
                dataKey="value"
                categoryKey="category"
                title="Empty Data Example"
                description="Shows empty state message"
              />
            </div>

            {/* With ChartConfig */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">With ChartConfig</h4>
              <PieChart
                data={[
                  { browser: "chrome", visitors: 275 },
                  { browser: "safari", visitors: 200 },
                  { browser: "firefox", visitors: 287 },
                ]}
                dataKey="visitors"
                categoryKey="browser"
                title="Browser Statistics"
                chartConfig={
                  {
                    chrome: {
                      label: "Google Chrome",
                      color: "hsl(var(--primary))",
                    },
                    safari: {
                      label: "Safari Browser",
                      color: "hsl(var(--primary))",
                    },
                    firefox: {
                      label: "Mozilla Firefox",
                      color: "hsl(var(--primary))",
                    },
                  } satisfies ChartConfig
                }
                centerLabel={{
                  label: "Total Visitors",
                  valueFormatter: (v) => v.toLocaleString(),
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>Tabs, breadcrumbs, accordion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/test">Test</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Visual Regression</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Content for Tab 1</TabsContent>
              <TabsContent value="tab2">Content for Tab 2</TabsContent>
              <TabsContent value="tab3">Content for Tab 3</TabsContent>
            </Tabs>
            <Accordion type="single" collapsible>
              <AccordionItem value="item1">
                <AccordionTrigger>Accordion Item 1</AccordionTrigger>
                <AccordionContent>
                  Content for accordion item 1
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item2">
                <AccordionTrigger>Accordion Item 2</AccordionTrigger>
                <AccordionContent>
                  Content for accordion item 2
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Overlays */}
        <Card>
          <CardHeader>
            <CardTitle>Overlays</CardTitle>
            <CardDescription>
              Dialogs, dropdowns, popovers, tooltips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      Dialog description text
                    </DialogDescription>
                  </DialogHeader>
                  <div>Dialog content goes here</div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Open Alert</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Dropdown</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuCheckboxItem checked>
                    Show notifications
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>Popover content</PopoverContent>
              </Popover>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover for Tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline">Hover Card</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div>Hover card content</div>
                </HoverCardContent>
              </HoverCard>

              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <Button variant="outline">Right Click Me</Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Copy</ContextMenuItem>
                  <ContextMenuItem>Paste</ContextMenuItem>
                  <ContextMenuItem>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>Sheet description</SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">Sheet content</div>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>

        {/* Utility Components */}
        <Card>
          <CardHeader>
            <CardTitle>Utility Components</CardTitle>
            <CardDescription>
              Separators, skeletons, toggles, scroll areas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p>Above separator</p>
              <Separator className="my-4" />
              <p>Below separator</p>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2">
              <Toggle>Toggle</Toggle>
              <Toggle pressed>Toggled</Toggle>
            </div>
            <ScrollArea className="h-24 w-full border rounded-md p-4">
              <div className="space-y-2">
                <p>Scrollable content line 1</p>
                <p>Scrollable content line 2</p>
                <p>Scrollable content line 3</p>
                <p>Scrollable content line 4</p>
                <p>Scrollable content line 5</p>
                <p>Scrollable content line 6</p>
              </div>
            </ScrollArea>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline">Toggle Collapsible</Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-4 border rounded-md">
                  This is collapsible content that can be shown or hidden.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Testing Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Visual Testing Checklist</CardTitle>
            <CardDescription>Manual verification steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Theme Switching</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Toggle between light and dark themes</li>
                  <li>Verify all components render correctly in both modes</li>
                  <li>Check for proper contrast ratios</li>
                  <li>Ensure text is readable in both themes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Component States</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Hover states work correctly</li>
                  <li>Focus states are visible and accessible</li>
                  <li>Disabled states are clearly indicated</li>
                  <li>Active/selected states are distinguishable</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Responsive Behavior</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Test on mobile viewport (375px)</li>
                  <li>Test on tablet viewport (768px)</li>
                  <li>Test on desktop viewport (1920px)</li>
                  <li>Verify components adapt to screen size</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
