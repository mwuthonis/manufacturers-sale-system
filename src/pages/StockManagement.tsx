import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Package, 
  Plus, 
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle
} from "lucide-react"

// --- AddStockModal component ---
function AddStockModal({ open, onOpenChange, onAddItems }) {
  const [items, setItems] = useState([
    { itemName: "", category: "", unitPrice: "", quantity: "" }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (idx, field, value) => {
    setItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddRow = () => {
    setItems(items => [...items, { itemName: "", category: "", unitPrice: "", quantity: "" }]);
  };

  const handleRemoveRow = idx => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Validate (simple)
    const valid = items.every(
      item => item.itemName && item.category && item.unitPrice && item.quantity
    );
    if (!valid) {
      setSubmitting(false);
      return;
    }
    // Pass new items up
    onAddItems(
      items.map(item => ({
        id: `STK${Math.floor(Math.random() * 100000)}`,
        name: item.itemName,
        category: item.category,
        currentStock: Number(item.quantity),
        minStock: 10,
        maxStock: 1000,
        unit: "unit",
        unitPrice: Number(item.unitPrice),
        supplier: "Manual Entry",
        lastUpdated: new Date().toISOString().slice(0, 10),
        status: "Normal"
      }))
    );
    setItems([{ itemName: "", category: "", unitPrice: "", quantity: "" }]);
    setSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock Items</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <Input
                placeholder="Item Name"
                value={item.itemName}
                onChange={e => handleChange(idx, "itemName", e.target.value)}
                className="flex-1"
                required
              />
              <Input
                placeholder="Category"
                value={item.category}
                onChange={e => handleChange(idx, "category", e.target.value)}
                className="flex-1"
                required
              />
              <Input
                placeholder="Unit Price"
                type="number"
                min={0}
                value={item.unitPrice}
                onChange={e => handleChange(idx, "unitPrice", e.target.value)}
                className="w-32"
                required
              />
              <Input
                placeholder="Quantity"
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => handleChange(idx, "quantity", e.target.value)}
                className="w-24"
                required
              />
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveRow(idx)}
                  className="ml-2"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <div>
            <Button type="button" variant="outline" onClick={handleAddRow}>
              <Plus className="w-4 h-4 mr-2" />
              Add Another Item
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              Save Items
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
// --- End AddStockModal ---

const StockManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [stockData, setStockData] = useState([
    /*{
      id: "STK001",
      name: "Steel Pipes - 2 inch",
      category: "Raw Materials",
      currentStock: 150,
      minStock: 50,
      maxStock: 500,
      unit: "pieces",
      unitPrice: 25.50,
      supplier: "Steel Corp Ltd",
      lastUpdated: "2024-01-15",
      status: "Normal"
    },
    {
      id: "STK002", 
      name: "Aluminum Sheets - 4x8",
      category: "Raw Materials",
      currentStock: 25,
      minStock: 30,
      maxStock: 200,
      unit: "sheets",
      unitPrice: 85.00,
      supplier: "Metal Supply Co",
      lastUpdated: "2024-01-14",
      status: "Low Stock"
    },
    {
      id: "STK003",
      name: "Welding Rods - 3.2mm",
      category: "Consumables",
      currentStock: 500,
      minStock: 100,
      maxStock: 1000,
      unit: "pieces",
      unitPrice: 2.25,
      supplier: "Weld Tech Industries",
      lastUpdated: "2024-01-16",
      status: "Normal"
    },
    {
      id: "STK004",
      name: "Safety Helmets",
      category: "Safety Equipment",
      currentStock: 75,
      minStock: 25,
      maxStock: 150,
      unit: "pieces",
      unitPrice: 15.00,
      supplier: "Safety First Ltd",
      lastUpdated: "2024-01-13",
      status: "Normal"
    }*/
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Low Stock":
        return <Badge variant="destructive" className="bg-warning text-warning-foreground">Low Stock</Badge>
      case "Out of Stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline" className="bg-success-light text-success border-success">Normal</Badge>
    }
  }

  const filteredStock = stockData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Add new items to stockData
  const handleAddItems = (newItems) => {
    setStockData(prev => [...prev, ...newItems]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
          <p className="text-muted-foreground">Monitor and manage your inventory levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {/* Replace this button with the modal trigger */}
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Stock Item
          </Button>
        </div>
      </div>

      {/* Modal */}
      <AddStockModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddItems={handleAddItems}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stockData.filter(item => item.status === "Low Stock").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${stockData.reduce((total, item) => total + (item.currentStock * item.unitPrice), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {new Set(stockData.map(item => item.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Inventory</CardTitle>
          <CardDescription>Manage your stock levels and track inventory movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by item name, category, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Stock Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min/Max</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.supplier}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated: {item.lastUpdated}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Min: {item.minStock}</div>
                        <div>Max: {item.maxStock}</div>
                      </div>
                    </TableCell>
                    <TableCell>${item.unitPrice}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StockManagement