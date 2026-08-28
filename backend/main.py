from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="BloomCakes Backend API",
    description="Lightweight backend APIs for BloomCakes platform occasion order flow details",
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

# Mock databases models representation
class CakeItem(BaseModel):
    id: str
    name: str
    price: int
    category: str
    imageUrl: str
    description: Optional[str] = None

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

@app.get("/")
def read_root():
    return {"message": "Welcome to BloomCakes Backend API. Visit /docs for Swagger specifications documentation."}

@app.get("/pincodes")
def get_serviceable_pincodes():
    return ["380001", "380009", "380015", "380054", "382481", "380058", "380021"]

@app.post("/orders")
def submit_order(order: OrderSubmission):
    # Process order log / database entry simulation
    print(f"Processed order for {order.name} - Total: ₹{order.totalAmount}")
    return {
        "status": "success",
        "order_id": f"BC-ORD-{int(order.phone[-4:])}-{order.date.replace('-', '')}",
        "message": "Order processed successfully"
    }
