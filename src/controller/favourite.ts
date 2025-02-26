import { appDataSource } from "../config/database";
import { Favourite } from "../entities/favourite";

const faviouriteDataSource = appDataSource.getRepository(Favourite);

export const addToFaviourite = async (req: any, res: any) => {
  const { productId, userId } = req.body;
  try {
    const isItemIsAddedInFaviourite = await faviouriteDataSource.find(
      productId
    );
    console.log("isItemIsAddedInFaviourite", isItemIsAddedInFaviourite);
    if (isItemIsAddedInFaviourite.length === 0) {
      await faviouriteDataSource.insert({
        productid: productId,
        userid: userId,
      });

      res.status(200).json({ message: "Item is added in faviourite" });
    } else {
      res.status(400).json({ message: "Item is already added in faviourite" });
    }
  } catch (err) {
    res.status(200).json({ Error: err });
  }
};

export const getFaviouriteItems = async (req: any, res: any) => {
  const { userId } = req.body;
  try {
    let result: any = {};
    if (userId) {
      result = await faviouriteDataSource.find(userId);
      console.log(result, "resultresultresult");
    } else {
      result = await faviouriteDataSource
        .createQueryBuilder("favourite")
        .leftJoinAndSelect("favourite.userid", "user")
        .leftJoinAndSelect("favourite.productid", "product")
        .getMany();
    }
    res.status(200).json({ "All Favourite ": result });
  } catch (err) {
    res.status(200).json({ Error: err });
  }
};

export const removeFaviouriteItems = async (req: any, res: any) => {
  const { productId } = req.body;
  try {
    const result = await faviouriteDataSource.delete({ productid: productId });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
};
