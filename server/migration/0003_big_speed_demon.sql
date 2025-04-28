ALTER TABLE "orderProduct" ADD COLUMN "orderID" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "customerId" text;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_orderID_orders_id_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;