import { appDataSource } from "../config/database";
import { ProductCart } from "../entities/cart";

const cartDataSource = appDataSource.getRepository(ProductCart);

export const addToCart = async (req: any, res: any) => {
  const { quantity, userId, productId } = req.body;
  console.log("Repository Metadata:", cartDataSource.metadata.columns);

  try {
    const ifProductExist = await cartDataSource.findOne({
      where: {
        userid: { id: userId },
        productid: { id: productId },
      },
    });
    console.log("ifProductExistifProductExist", ifProductExist);
    if (ifProductExist) {
      ifProductExist.quantity += quantity;
      console.log("ifProductExist.quantity", ifProductExist.quantity);
      await cartDataSource.update(
        { productid: productId },
        { quantity: ifProductExist.quantity }
      );

      res
        .status(200)
        .json({ message: "Product quantity update successfully." });
    } else {
      await cartDataSource.insert({
        productid: productId,
        quantity: quantity,
        userid: userId,
      });
      res.status(200).json({ message: "product is added in Cart" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getItemsFromCart = async (req: any, res: any) => {
  const { userId } = req.body;
  try {
    const queryBuilder = cartDataSource.createQueryBuilder("product_cart");
    if (userId) {
      queryBuilder
        .leftJoinAndSelect("product_cart.productid", "product")
        .where("product_cart.userid = :userId", { userId });
    } else {
      queryBuilder
        .leftJoinAndSelect("product_cart.userid", "user")
        .leftJoinAndSelect("product_cart.productid", "product");
    }
    const result = await queryBuilder.getMany();
    res.status(200).json({ "All Product": result });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
};

export const removeFormCart = async (req: any, res: any) => {
  const { productId } = req.body;
  try {
    const result = await cartDataSource.delete({ productid: productId });
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
};
