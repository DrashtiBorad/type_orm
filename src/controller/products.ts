import { S3 } from "@aws-sdk/client-s3";
import { appDataSource } from "../config/database";
import { Product } from "../entities/products";
import { IncomingForm } from "formidable";
import fs from "fs";
import { Categories } from "../entities/categories";

const productDataSource = appDataSource.getRepository(Product);
const categoriesDataSource = appDataSource.getRepository(Categories);

export const client = new S3({
  region: "ap-south-1",
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESSKEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

export const addProducts = async (req: any, res: any) => {
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(400).json({ error: "File upload failed" });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const fileStream = fs.createReadStream(
      file.map((list: any) => list.filepath)[0]
    );

    const uniqueKey = `product_images/${Date.now()}-${
      file.map((list: any) => list.originalFilename)[0]
    }`;

    try {
      await client.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: uniqueKey,
        Body: fileStream,
        ContentType: `${file.map((list: any) => list.mimetype)[0]}`,
      });

      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${uniqueKey}`;

      const {
        name,
        description,
        price,
        is_featured_product,
        is_top_categories,
        our_productType_categoriesId,
      } = fields;

      const categoryIdBasedOnName = await categoriesDataSource.find({
        where: {
          categories_name: our_productType_categoriesId[0],
        },
      });

      await productDataSource
        .createQueryBuilder()
        .insert()
        .into("product")
        .values({
          name: name[0],
          description: description[0],
          price: Number(price),
          is_featured_product: is_featured_product[0] === "true",
          is_top_categories: is_top_categories[0] === "true",
          our_productType_category: categoryIdBasedOnName[0].id,
          image: fileUrl,
        })
        .execute();

      res.status(200).json({
        message: "Product added successfully",
      });
    } catch (uploadErr) {
      res.status(500).json({
        error: "Failed to upload to S3 or save product data",
        uploadErr,
      });
    }
  });
};

export const getProducts = async (req: any, res: any) => {
  const { is_featured_product, is_top_categories, our_productType_category } =
    req.body;

  try {
    const queryBuilder = productDataSource;
    const getProducts: any[] = [];
    const getProductIdBaseOnName = await categoriesDataSource.find({
      where: {
        categories_name: our_productType_category,
      },
    });

    if (is_featured_product && is_top_categories) {
      getProducts.push({ is_featured_product, is_top_categories });
    } else if (is_featured_product) {
      getProducts.push({ is_featured_product });
    } else if (is_top_categories) {
      getProducts.push({ is_top_categories });
    } else if (our_productType_category) {
      getProducts.push({
        our_productType_category: { id: getProductIdBaseOnName[0].id },
      });
    }

    const result = await queryBuilder.find({
      where: getProducts,
      relations: ["our_productType_category"],
    });

    res.status(200).json({ Products: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const product = await productDataSource.findOne({
      where: { id },
      relations: ["our_productType_category"],
    });

    res.status(200).json({ Products: product });
  } catch (error) {
    res.status(400).json({ error: "Product not found" });
    return;
  }
};

export const deleteProducts = async (req: any, res: any) => {
  const { productId } = req.body;
  try {
    await productDataSource.delete(productId);

    res.status(200).json("Product Deleted Successfully.");
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const updateProducts = async (req: any, res: any) => {
  const { id, ...otherValues } = req.body;
  try {
    const result = await productDataSource
      .createQueryBuilder("product")
      .update()
      .set(otherValues)
      .where("product.id = :id", { id })
      .execute();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json("");
  }
};
