import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd

app = FastAPI(
    title="BloomCakes Backend API",
    description="Lightweight backend APIs reading mock products data from Excel sheets",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXCEL_FILE_PATH = os.path.join(os.path.dirname(__file__), "products.xlsx")

# Mock databases models representation
class CakeItem(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    price: int
    category: str
    imageUrl: str
    isBestseller: bool
    rating: float

class OrderSummaryItem(BaseModel):
    cakeId: str
    name: str
    weight: str
    price: int
    quantity: int

class OrderSubmission(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    addressLine1: str
    landmark: Optional[str] = None
    city: str
    pincode: str
    date: str
    timeSlot: str
    occasion: str
    customOccasion: Optional[str] = None
    items: List[OrderSummaryItem]
    activePromo: Optional[str] = None
    discountAmount: int = 0
    totalAmount: int

def read_products_from_excel() -> List[dict]:
    """Helper method to load product rows dynamically from local Excel database."""
    if not os.path.exists(EXCEL_FILE_PATH):
        return []
    try:
        df = pd.read_excel(EXCEL_FILE_PATH)
        # Standardize NaN values to None for clean JSON outputs representation
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")
    except Exception as e:
        print(f"Error reading Excel sheet: {e}")
        return []

@app.get("/")
def read_root():
    return {"message": "Welcome to BloomCakes Backend API. Visit /docs for Swagger specifications documentation."}

@app.get("/pincodes")
def get_serviceable_pincodes():
    return ["380001", "380009", "380015", "380054", "382481", "380058", "380021"]

@app.get("/products", response_model=List[CakeItem])
def get_products():
    """Retrieve all cake catalog items from the Excel sheet."""
    products = read_products_from_excel()
    if not products:
        raise HTTPException(status_code=404, detail="No products found in database.")
    return products

@app.get("/products/{slug}", response_model=CakeItem)
def get_product_by_slug(slug: str):
    """Retrieve a single cake product matched by its unique slug from the Excel database."""
    products = read_products_from_excel()
    for prod in products:
        if prod.get("slug") == slug:
            return prod
    raise HTTPException(status_code=404, detail="Product not found.")

@app.post("/orders")
def submit_order(order: OrderSubmission):
    # Process order log / database entry simulation
    print(f"Processed order for {order.name} - Total: ₹{order.totalAmount}")
    return {
        "status": "success",
        "order_id": f"BC-ORD-{int(order.phone[-4:])}-{order.date.replace('-', '')}",
        "message": "Order processed successfully"
    }
