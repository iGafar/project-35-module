import { Request, Response, Router } from "express";
import { connection } from "../../index";
import { v4 as uuidv4 } from "uuid";
import { OkPacket } from "mysql2";
import {
  DELETE_IMAGES_QUERY,
  INSERT_PRODUCT_IMAGES_QUERY,
  INSERT_PRODUCT_QUERY,
  REPLACE_PRODUCT_THUMBNAIL,
  UPDATE_PRODUCT_FIELDS,
} from "../services/queries";
import {
  enhanceProductsComments,
  enhanceProductsImages,
  getProductsFilterQuery,
} from "../helpers";
import {
  ICommentEntity,
  ImagesRemovePayload,
  SimilarsRemovePayload,
  ProductAddSimilarPayload,
  IProductEntity,
  IProductImageEntity,
  IProductSearchFilter,
  ProductAddImagesPayload,
  ProductCreatePayload,
  ISimilarEntity,
} from "../../types";
import {
  mapComments,
  mapImagesEntity,
  mapProductsEntity,
  mapSimilarEntity,
} from "../services/mapping";

export const productsRouter = Router();

const throwError = (res: Response, e: Error) => {
  console.debug(e.message);
  res.status(500);
  res.send("Something went wrong");
};

productsRouter.get("/", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const [productRows] = await connection.query<IProductEntity[]>(
      "SELECT * FROM products"
    );
    const [commentRows] = await connection.query<ICommentEntity[]>(
      "SELECT * FROM comments"
    );
    const [imageRows] = await connection.query<IProductImageEntity[]>(
      "SELECT * FROM images"
    );

    const products = mapProductsEntity(productRows);
    const withComments = enhanceProductsComments(products, commentRows);
    const withImages = enhanceProductsImages(withComments, imageRows);

    res.send(withImages);
  } catch (e) {
    throwError(res, e);
  }
});

productsRouter.get(
  "/search",
  async (req: Request<{}, {}, {}, IProductSearchFilter>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const [query, values] = getProductsFilterQuery(req.query);
      const [rows] = await connection.query<IProductEntity[]>(query, values);

      if (!rows?.length) {
        res.send([]);
        return;
      }

      const [commentRows] = await connection.query<ICommentEntity[]>(
        "SELECT * FROM comments"
      );
      const [imageRows] = await connection.query<IProductImageEntity[]>(
        "SELECT * FROM images"
      );

      const products = mapProductsEntity(rows);
      const withComments = enhanceProductsComments(products, commentRows);
      const withImages = enhanceProductsImages(withComments, imageRows);
      res.send(withImages);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const [rows] = await connection.query<IProductEntity[]>(
        "SELECT * FROM products WHERE product_id = ?",
        [req.params.id]
      );

      if (!rows?.[0]) {
        res.status(404);
        res.send(`Product with id ${req.params.id} is not found`);
        return;
      }

      const [comments] = await connection.query<ICommentEntity[]>(
        "SELECT * FROM comments WHERE product_id = ?",
        [req.params.id]
      );

      const [images] = await connection.query<IProductImageEntity[]>(
        "SELECT * FROM images WHERE product_id = ?",
        [req.params.id]
      );

      const product = mapProductsEntity(rows)[0];

      if (comments.length) {
        product.comments = mapComments(comments);
      }

      if (images.length) {
        product.images = mapImagesEntity(images);
        product.thumbnail =
          product.images.find((image) => image.main) || product.images[0];
      }

      res.send(product);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/",
  async (req: Request<{}, {}, ProductCreatePayload>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const { title, description, price, images } = req.body;
      const productId = uuidv4();
      await connection.query<OkPacket>(INSERT_PRODUCT_QUERY, [
        productId,
        title || null,
        description || null,
        price || null,
      ]);

      if (images) {
        const values = images.map((image) => [
          uuidv4(),
          image.url,
          productId,
          image.main,
        ]);
        await connection.query<OkPacket>(INSERT_PRODUCT_IMAGES_QUERY, [values]);
      }
      res.status(201);
      res.send({
        productId: productId,
        message: `Product with id:${productId} have been added!`,
      });
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const [rows] = await connection.query<IProductEntity[]>(
        "SELECT * FROM products WHERE product_id = ?",
        [req.params.id]
      );

      if (!rows?.[0]) {
        res.status(404);
        res.send(`Product with id ${req.params.id} is not found`);
        return;
      }

      await connection.query<OkPacket>(
        "DELETE FROM images WHERE product_id = ?",
        [req.params.id]
      );

      await connection.query<OkPacket>(
        "DELETE FROM comments WHERE product_id = ?",
        [req.params.id]
      );

      await connection.query<OkPacket>(
        "DELETE FROM similars WHERE similar_id = ?",
        [req.params.id]
      );
      await connection.query<OkPacket>(
        "DELETE FROM similars WHERE product_id = ?",
        [req.params.id]
      );

      await connection.query<OkPacket>(
        "DELETE FROM products WHERE product_id = ?",
        [req.params.id]
      );

      res.status(200);
      res.end();
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/add-images",
  async (req: Request<{}, {}, ProductAddImagesPayload>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const { productId, images } = req.body;

      if (!images?.length) {
        res.status(400);
        res.send("Images array is empty");
        return;
      }

      const values = images.map((image) => [
        uuidv4(),
        image.url,
        productId,
        image.main,
      ]);
      await connection.query<OkPacket>(INSERT_PRODUCT_IMAGES_QUERY, [values]);

      res.status(201);
      res.send(`Images for a product id:${productId} have been added!`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/remove-comments/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const [info] = await connection.query<OkPacket>(
        "DELETE FROM comments WHERE product_id = ?",
        [req.params.id]
      );

      res.status(200);
      res.send(`Comments have been removed!`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/remove-images/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const [info] = await connection.query<OkPacket>(
        "DELETE FROM images WHERE product_id = ?",
        [req.params.id]
      );

      res.status(200);
      res.send(`Images have been removed!`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/remove-images",
  async (req: Request<{}, {}, ImagesRemovePayload>, res: Response) => {
    try {
      const imagesToRemove = req.body;

      if (!imagesToRemove?.length) {
        res.status(400);
        res.send("Images array is empty");
        return;
      }

      const [info] = await connection.query<OkPacket>(DELETE_IMAGES_QUERY, [
        [imagesToRemove],
      ]);

      res.status(200);
      res.send(`Images have been removed!`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/update-thumbnail/:id",
  async (
    req: Request<{ id: string }, {}, { newThumbnailId: string }>,
    res: Response
  ) => {
    try {
      const [currentThumbnailRows] = await connection.query<
        IProductImageEntity[]
      >("SELECT * FROM images WHERE product_id=? AND main=?", [
        req.params.id,
        1,
      ]);

      if (!currentThumbnailRows?.length || currentThumbnailRows.length > 1) {
        res.status(400);
        res.send("Incorrect product id");
        return;
      }

      const [newThumbnailRows] = await connection.query<IProductImageEntity[]>(
        "SELECT * FROM images WHERE product_id=? AND image_id=?",
        [req.params.id, req.body.newThumbnailId]
      );

      if (newThumbnailRows?.length !== 1) {
        res.status(400);
        res.send("Incorrect new thumbnail id");
        return;
      }

      const currentThumbnailId = currentThumbnailRows[0].image_id;
      const [info] = await connection.query<OkPacket>(
        REPLACE_PRODUCT_THUMBNAIL,
        [
          currentThumbnailId,
          req.body.newThumbnailId,
          currentThumbnailId,
          req.body.newThumbnailId,
        ]
      );

      res.status(200);
      res.send("New product thumbnail has been set!");
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.patch(
  "/:id",
  async (
    req: Request<{ id: string }, {}, ProductCreatePayload>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const [rows] = await connection.query<IProductEntity[]>(
        "SELECT * FROM products WHERE product_id = ?",
        [id]
      );

      if (!rows?.[0]) {
        res.status(404);
        res.send(`Product with id ${id} is not found`);
        return;
      }

      const currentProduct = rows[0];

      await connection.query<OkPacket>(UPDATE_PRODUCT_FIELDS, [
        req.body.hasOwnProperty("title")
          ? req.body.title
          : currentProduct.title,
        req.body.hasOwnProperty("description")
          ? req.body.description
          : currentProduct.description,
        req.body.hasOwnProperty("price")
          ? req.body.price
          : currentProduct.price,
        id,
      ]);

      res.status(200);
      res.send(`Product id:${id} has been added!`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

//---------------------------

productsRouter.get(
  "/similars/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const [rows] = await connection.query<ISimilarEntity[]>(
        "SELECT * from similars where product_id = ? ORDER BY title",
        [req.params.id]
      );

      const similars = mapSimilarEntity(rows);

      res.send(similars);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.get(
  "/others/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const text_query = `SELECT 
 products.product_id as product_id,
 products.title as title,
 products.description as description,
 products.price as price,
 similars.row_id as row_id
 FROM  (SELECT * from products where product_id != ?)  as products
 LEFT JOIN (SELECT * FROM similars where product_id = ?) as similars
 on products.product_id = similars.similar_id
 where row_id is null
 ORDER BY products.title`;

      const [rows] = await connection.query<IProductEntity[]>(text_query, [
        req.params.id,
        req.params.id,
      ]);

      if (!rows?.[0]) {
        res.status(404);
        res.send(`Other products not similar id ${req.params.id} is not found`);
        return;
      }
      const products = mapProductsEntity(rows);
      res.send(products);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/remove-similars/:id",
  async (
    req: Request<{ id: string }, {}, SimilarsRemovePayload>,
    res: Response
  ) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const similarsToRemove = req.body;
      const productId = req.params.id;
      const [info] = await connection.query<OkPacket>(
        `DELETE FROM similars where product_id = ? and similar_id IN ?`,
        [productId, [similarsToRemove]]
      );

      if (info.affectedRows === 0) {
        res.status(404);
        res.send("No one image has been removed");
        return;
      }

      res.status(200);
      res.send(`Images have been removed!`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/remove-all-similars/:id",
  async (req: Request<{ id: string }, {}, {}>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const productId = req.params.id;
      const [info] = await connection.query<OkPacket>(
        `DELETE FROM similars where product_id = ?`,
        [productId]
      );

      res.status(200);
      res.send(`Images have been removed!`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/add-similar",
  async (req: Request<{}, {}, ProductAddSimilarPayload>, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const similarsToAdd = req.body;

      if (!similarsToAdd?.length) {
        res.status(400);
        res.send("Simmilar array is empty");
        return;
      }

      const similarsID = similarsToAdd.map((item) => item.similarId);

      const [productsRows] = await connection.query<IProductEntity[]>(
        "SELECT * FROM products where product_id IN ?",
        [[similarsID]]
      );

      const values = similarsToAdd.map((item) => {
        let similar = productsRows.find(
          (element) => (element.product_id = item.similarId)
        );
        return [
          uuidv4(),
          similar.title,
          similar.description,
          similar.price,
          item.productId,
          item.similarId,
        ];
      });

      await connection.query<OkPacket>(
        "INSERT INTO similars (row_id, title, description, price, product_id, similar_id) VALUES ?",
        [values]
      );

      res.status(201);
      res.send(`Images for a product id:${similarsToAdd} have been added!`);
    } catch (e) {
      throwError(res, e);
    }
  }
);
