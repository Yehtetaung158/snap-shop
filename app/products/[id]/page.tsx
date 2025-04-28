import AddToCart from "@/components/cart/add-to-cart";
import ImageSlider from "@/components/products/image-slider";
import VariantPicker from "@/components/products/variantPicker";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import React from "react";

type DetailProductProps = {
  params: {
    id: number;
  };
};

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantsTags: true,
      product: true,
    },
  });
  if (data) {
    const idArr = data.map((d) => ({
      id: d.id.toString(),
    }));
    return idArr;
  }
  return [];
}

const DetailPage = async ({ params }: DetailProductProps) => {
  const productWithVariants = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, params.id),
    with: {
      product: {
        with: {
          productVariants: {
            with: {
              variantImages: true,
              variantsTags: true,
            },
          },
        },
      },
    },
  });
  return (
    <main>
      {productWithVariants && (
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          <div className="lg:flex-1">
            <ImageSlider
              variants={productWithVariants.product.productVariants}
            />
          </div>
          <div className="lg:flex-1">
            <h2 className="font-bold text-2xl">
              {productWithVariants.product.title}
            </h2>
            <p className="text-xs bg-gray-200 font-medium w-fit p-1 rounded-md my-2">
              {productWithVariants.productType} Variant
            </p>
            <hr className="mb-4 mt-3" />
            <div
              className=" leading-8"
              dangerouslySetInnerHTML={{
                __html: productWithVariants.product.description,
              }}
            />
            <p className="text-2xl font-bold my-2">
              {productWithVariants.product.price.toLocaleString("USD", {
                currency: "MMk",
                minimumFractionDigits: 2,
              })}
            </p>
            <div className="flex gap-2 items-center">
              <p className="font-medium">Colors :</p>
              {productWithVariants.product.productVariants.map((v) => (
                <VariantPicker
                  key={v.id}
                  {...v}
                  title={productWithVariants.product.title}
                  price={productWithVariants.product.price}
                  image={v.variantImages[0].image_url}
                  productId={v.productId}
                />
              ))}
            </div>
            <AddToCart />

          </div>
        </div>
      )}
    </main>
  );
};

export default DetailPage;
