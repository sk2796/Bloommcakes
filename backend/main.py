import os
import hmac
import hashlib
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import razorpay
from dotenv import load_dotenv

# Load credentials from .env configurations file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

# Initialize Razorpay Client wrapper
razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

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
PINCODES_FILE_PATH = os.path.join(os.path.dirname(__file__), "pincodes.xlsx")

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

class PincodeItem(BaseModel):
    pincode: str
    city: str

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

class CreateOrderRequest(BaseModel):
    amount: int  # in paise
    currency: str = "INR"
    receipt: Optional[str] = None

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

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

def read_pincodes_from_excel() -> List[dict]:
    """Helper method to load pincodes and associated cities dynamically from local Excel database."""
    if not os.path.exists(PINCODES_FILE_PATH):
        return []
    try:
        df = pd.read_excel(PINCODES_FILE_PATH)
        df['pincode'] = df['pincode'].astype(str)
        # Standardize NaN values to None for clean JSON outputs representation
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")
    except Exception as e:
        print(f"Error reading pincodes Excel sheet: {e}")
        return []

@app.get("/")
def read_root():
    return {"message": "Welcome to BloomCakes Backend API. Visit /docs for Swagger specifications documentation."}

@app.get("/pincodes")
def check_pincode(code: str):
    """Check if a specific pincode is serviceable by searching the Excel sheet."""
    pincodes = read_pincodes_from_excel()
    for item in pincodes:
        if item.get("pincode") == code.strip():
            return {"serviceable": True, "city": item.get("city"), "state": item.get("state")}
    return {"serviceable": False, "city": None, "state": None}

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

@app.post("/api/create-order")
def create_razorpay_order(req: CreateOrderRequest):
    """Create order record identifier in Razorpay gateway client."""
    if not razorpay_client:
        raise HTTPException(status_code=401, detail="Razorpay credentials not initialized.")
    
    if req.amount < 100:
        raise HTTPException(status_code=400, detail="Minimum amount must be 100 paise.")

    try:
        order_data = {
            "amount": req.amount,
            "currency": req.currency,
            "receipt": req.receipt or "rcpt_bloomcakes",
            "payment_capture": 1
        }
        order = razorpay_client.order.create(data=order_data)
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"]
        }
    except Exception as e:
        print(f"Razorpay API Error: {e}")
        raise HTTPException(status_code=500, detail=f"Razorpay API Order creation failed: {str(e)}")

@app.post("/api/verify-payment")
def verify_payment_signature(req: VerifyPaymentRequest):
    """Verify cryptographic validity of payment signature generated client-side."""
    if not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=401, detail="Razorpay secret key configurations unavailable.")

    # Format verification message payload data
    msg = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
    
    try:
        # Generate hash verification signatures
        generated_signature = hmac.new(
            key=RAZORPAY_KEY_SECRET.encode("utf-8"),
            msg=msg.encode("utf-8"),
            digestmod=hashlib.sha256
        ).hexdigest()

        if generated_signature == req.razorpay_signature:
            return {"status": "success", "message": "Payment signature verified successfully"}
        else:
            raise HTTPException(status_code=400, detail="Signature mismatch validation error")
    except Exception as e:
        print(f"Verification Failure: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/orders")
def submit_order(order: OrderSubmission):
    # Process order log / database entry simulation
    print(f"Processed order for {order.name} - Total: ₹{order.totalAmount}")
    return {
        "status": "success",
        "order_id": f"BC-ORD-{int(order.phone[-4:])}-{order.date.replace('-', '')}",
        "message": "Order processed successfully"
    }
