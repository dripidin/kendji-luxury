-- Phase 17: Global Settings, Integrations & Localization

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS brand_name_ar TEXT DEFAULT 'كندجي للمجوهرات الفاخرة';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '+213550000000';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS customer_service_phone TEXT DEFAULT '+213 550 12 34 56';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS customer_service_email TEXT DEFAULT 'contact@kendji-luxury.dz';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS business_address TEXT DEFAULT 'Alger Centre, 16000 Alger, Algérie';

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS delivery_settings JSONB DEFAULT '{"cod_enabled": true, "default_method": "DOMICILE", "custom_fees": {}}'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS integrations JSONB DEFAULT '{"courier": {"active_provider": "YALIDINE", "enabled": true}, "telegram": {"enabled": false, "bot_token": "", "chat_id": "", "events": ["new_order", "shipment_created", "delivered"]}, "meta": {"pixel_id": "", "capi_enabled": false, "capi_token": ""}}'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS localization JSONB DEFAULT '{"default_language": "fr", "supported_languages": ["fr", "ar", "en"]}'::jsonb;

UPDATE site_settings
SET 
  brand_name = COALESCE(brand_name, 'KenDji Luxury'),
  brand_name_ar = COALESCE(brand_name_ar, 'كندجي للمجوهرات الفاخرة'),
  customer_service_email = COALESCE(customer_service_email, 'contact@kendji-luxury.dz'),
  customer_service_phone = COALESCE(customer_service_phone, '+213 550 12 34 56'),
  business_address = COALESCE(business_address, 'Alger Centre, 16000 Alger, Algérie'),
  delivery_settings = COALESCE(delivery_settings, '{"cod_enabled": true, "default_method": "DOMICILE", "custom_fees": {}}'::jsonb),
  integrations = COALESCE(integrations, '{"courier": {"active_provider": "YALIDINE", "enabled": true}, "telegram": {"enabled": false, "bot_token": "", "chat_id": "", "events": ["new_order", "shipment_created", "delivered"]}, "meta": {"pixel_id": "", "capi_enabled": false, "capi_token": ""}}'::jsonb),
  localization = COALESCE(localization, '{"default_language": "fr", "supported_languages": ["fr", "ar", "en"]}'::jsonb)
WHERE id = 1;
