import type { InventoryMovement } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface InventoryMovementTableProps {
    movements: InventoryMovement[];
}

const movementLabels: Record<InventoryMovement["type"], string> = {
    stock_in: "Stock In",
    stock_out: "Stock Out",
    adjustment: "Adjustment",
};

const movementClassNames: Record<InventoryMovement["type"], string> = {
    stock_in: "bg-emerald-100 text-emerald-700",
    stock_out: "bg-rose-100 text-rose-700",
    adjustment: "bg-amber-100 text-amber-700",
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function InventoryMovementTable({
    movements,
}: InventoryMovementTableProps) {
    return (
        <div className="min-h-0 flex-1 rounded-md border">
            <div className="h-full overflow-auto">
                <Table className="min-w-[1000px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky top-0 z-10 bg-background">
                                Date
                            </TableHead>
                            <TableHead className="sticky top-0 z-10 bg-background">
                                Product
                            </TableHead>
                            <TableHead className="sticky top-0 z-10 bg-background">
                                SKU
                            </TableHead>
                            <TableHead className="sticky top-0 z-10 bg-background">
                                Type
                            </TableHead>
                            <TableHead className="sticky top-0 z-10 bg-background text-right">
                                Qty
                            </TableHead>
                            <TableHead className="sticky top-0 z-10 bg-background text-right">
                                Before
                            </TableHead>
                            <TableHead className="sticky top-0 z-10 bg-background text-right">
                                After
                            </TableHead>
                            <TableHead className="sticky top-0 z-10 bg-background">
                                Reference
                            </TableHead>
                            <TableHead className="sticky top-0 z-10 bg-background">
                                Note
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {movements.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="h-32 text-center text-muted-foreground"
                                >
                                    No inventory movements found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            movements.map((movement) => (
                                <TableRow key={movement.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDate(movement.created_at)}
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {movement.product?.name ?? "-"}
                                    </TableCell>

                                    <TableCell>
                                        {movement.product?.sku ?? "-"}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            className={movementClassNames[movement.type]}
                                        >
                                            {movementLabels[movement.type]}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {movement.quantity}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {movement.stock_before}
                                    </TableCell>

                                    <TableCell className="text-right font-medium">
                                        {movement.stock_after}
                                    </TableCell>

                                    <TableCell>
                                        {movement.reference_no || "-"}
                                    </TableCell>

                                    <TableCell className="max-w-[220px] truncate">
                                        {movement.note || "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}