import { db } from "@/server";
import { products } from "@/server/schema";
import React from "react";
import { DataTable } from "./data-table";
import placeHolerImg from "@/public/istockphoto-1147544807-612x612.jpg";
import { columns } from "./columns";

const Products = async () => {
  // const products = await db.query.products.findMany({
  //   with: {
  //     productVariants: {
  //       with: {
  //         variantImages: true,
  //         variantsTags: true,
  //       },
  //     },
  //   },
  //   orderBy: (products, { asc }) => [asc(products.id)],
  // });

  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantsTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  const productData = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        price: product.price,
        title: product.title,
        description: product.description,
        variants: [],
        imgUrl: placeHolerImg.src,
      };
    }

    return {
      id: product.id,
      price: product.price,
      title: product.title,
      description: product.description,
      variants: product.productVariants,
      imgUrl: product.productVariants[0].variantImages[0].image_url,
    };
  });

  return (
    <main>
      <DataTable data={productData} columns={columns} />
    </main>
  );
};

export default Products;
