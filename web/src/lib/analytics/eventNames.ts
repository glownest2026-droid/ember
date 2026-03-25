export const EVENTS = {
  PAGE_VIEW: 'page_view',
  SIGN_IN_COMPLETED: 'sign_in_completed',
  CHILD_PROFILE_CREATED: 'child_profile_created',
  CHILD_PROFILE_UPDATED: 'child_profile_updated',
  SHORTLIST_VIEWED: 'shortlist_viewed',
  RETAILER_OUTBOUND_CLICKED: 'retailer_outbound_clicked',
  PRODUCT_SAVED: 'product_saved',
  GIFT_PAGE_VIEWED: 'gift_page_viewed',
  GIFT_PAGE_SHARED: 'gift_page_shared',
  GARAGE_ITEM_ADDED: 'garage_item_added',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

