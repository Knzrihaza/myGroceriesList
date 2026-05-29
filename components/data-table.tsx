"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  GripVerticalIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "lucide-react"
import {
  createRule,
  updateRule,
  deleteRule,
  reorderRules,
} from "@/app/actions/rules"
import type { Rule } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"

export const schema = z.object({
  id: z.string(),
  app_id: z.string(),
  data_collected: z.string(),
  purpose: z.string(),
  retention: z.string(),
  third_parties: z.string(),
  legal_basis: z.string(),
  order: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

const LEGAL_BASIS_OPTIONS = [
  "Consent",
  "Contract",
  "Legitimate interest",
  "Legal obligation",
] as const

type FormData = {
  data_collected: string
  purpose: string
  retention: string
  third_parties: string
  legal_basis: string
}

const EMPTY_FORM: FormData = {
  data_collected: "",
  purpose: "",
  retention: "",
  third_parties: "",
  legal_basis: "Consent",
}

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({ data: initialData }: { data: Rule[] }) {
  const router = useRouter()
  const isMobile = useIsMobile()

  const [data, setData] = React.useState<Rule[]>(() => initialData)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editingRule, setEditingRule] = React.useState<Rule | null>(null)
  const [form, setForm] = React.useState<FormData>(EMPTY_FORM)
  const [isSaving, setIsSaving] = React.useState(false)

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Sync local state when server refreshes props
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Populate form when editing rule changes
  React.useEffect(() => {
    setForm(
      editingRule
        ? {
            data_collected: editingRule.data_collected,
            purpose: editingRule.purpose,
            retention: editingRule.retention,
            third_parties: editingRule.third_parties,
            legal_basis: editingRule.legal_basis,
          }
        : EMPTY_FORM
    )
  }, [editingRule])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map((r) => r.id),
    [data]
  )

  function openCreate() {
    setEditingRule(null)
    setDrawerOpen(true)
  }

  function openEdit(rule: Rule) {
    setEditingRule(rule)
    setDrawerOpen(true)
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      if (editingRule) {
        await updateRule(editingRule.id, form)
        toast.success("Rule updated")
      } else {
        await createRule(form)
        toast.success("Rule created")
      }
      setDrawerOpen(false)
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRule(id)
      toast.success("Rule deleted")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return

    const oldIndex = data.findIndex((r) => r.id === active.id)
    const newIndex = data.findIndex((r) => r.id === over.id)
    const reordered = arrayMove(data, oldIndex, newIndex)

    setData(reordered)
    reorderRules(reordered.map((r) => r.id))
  }

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      accessorKey: "data_collected",
      header: "Data Collected",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.data_collected}</span>
      ),
    },
    {
      accessorKey: "purpose",
      header: "Purpose",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.purpose}</span>
      ),
    },
    {
      accessorKey: "retention",
      header: "Retention",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.retention}</span>
      ),
    },
    {
      accessorKey: "third_parties",
      header: "Third Parties",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.third_parties}</span>
      ),
    },
    {
      accessorKey: "legal_basis",
      header: "Legal Basis",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.legal_basis}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => openEdit(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, columnFilters, pagination },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <span className="text-sm font-medium text-muted-foreground">
          {table.getFilteredRowModel().rows.length} rule(s)
        </span>
        <Button variant="outline" size="sm" onClick={openCreate}>
          <PlusIcon />
          <span className="hidden lg:inline">Add Rule</span>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border mx-4 lg:mx-6">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No rules yet. Click &ldquo;Add Rule&rdquo; to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex w-full items-center gap-8 lg:w-fit ml-auto">
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Create / Edit Drawer */}
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent>
          <DrawerHeader className="gap-1">
            <DrawerTitle>
              {editingRule ? "Edit Rule" : "Add Rule"}
            </DrawerTitle>
            <DrawerDescription>
              {editingRule
                ? "Update this confidentiality rule."
                : "Define a new confidentiality rule for your privacy policy."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            <div className="flex flex-col gap-2">
              <Label htmlFor="data_collected">Data Collected</Label>
              <Input
                id="data_collected"
                placeholder="e.g. Email address"
                value={form.data_collected}
                onChange={(e) =>
                  setForm((f) => ({ ...f, data_collected: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Account authentication"
                value={form.purpose}
                onChange={(e) =>
                  setForm((f) => ({ ...f, purpose: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="retention">Retention</Label>
              <Input
                id="retention"
                placeholder="e.g. Until account deletion"
                value={form.retention}
                onChange={(e) =>
                  setForm((f) => ({ ...f, retention: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="third_parties">Third Parties</Label>
              <Input
                id="third_parties"
                placeholder="e.g. None / Firebase Auth"
                value={form.third_parties}
                onChange={(e) =>
                  setForm((f) => ({ ...f, third_parties: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="legal_basis">Legal Basis</Label>
              <Select
                value={form.legal_basis}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, legal_basis: v }))
                }
              >
                <SelectTrigger id="legal_basis" className="w-full">
                  <SelectValue placeholder="Select legal basis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LEGAL_BASIS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            {editingRule && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleDelete(editingRule.id)
                  setDrawerOpen(false)
                }}
              >
                Delete Rule
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
