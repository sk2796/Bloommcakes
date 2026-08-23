export type OccasionType = 'birthday' | 'anniversary' | 'wedding' | 'kids' | 'corporate' | 'other'

export interface CustomCakeOrder {
  occasion: OccasionType
  occasionNotes: string
  flavor: string
  size: string
  shape: string
  customMessage: string
  specialInstructions: string
  deliveryDate: string
  deliveryTimeSlot: string
  deliveryAddress: string
  customerName: string
  customerPhone: string
  customerEmail: string
}
