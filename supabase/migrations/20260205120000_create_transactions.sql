CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  framework_id UUID REFERENCES frameworks(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 49.99,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'completed',
  customer_email TEXT,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
