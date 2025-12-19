-- Addresses
create index if not exists idx_addresses_user_id
on public.addresses (user_id);

-- pincode column does not exist, so skip this index
-- create index if not exists idx_addresses_pincode
-- on public.addresses (pincode);

create index if not exists idx_addresses_user_default
on public.addresses (user_id, is_default);

-- Stock notifications
create index if not exists idx_stock_notifications_product_id
on public.stock_notifications (product_id);

create index if not exists idx_stock_notifications_product_user
on public.stock_notifications (product_id, user_id);

-- Order status history
create index if not exists idx_order_status_history_order_id
on public.order_status_history (order_id);

create index if not exists idx_order_status_history_order_created
on public.order_status_history (order_id, created_at desc);
