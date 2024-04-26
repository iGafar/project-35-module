import { Router, Request, Response } from "express";
import {
  getProducts,
  searchProducts,
  getProduct,
  removeProduct,
  updateProduct,
  getOthers,
  getSimilars,
  addProduct,
} from "../models/products.model";
import { IProductFilterPayload } from "@Shared/types";
import { IProductEdit, IProductCreate } from "../types";
import { throwError } from "./helper";

export const productsRouter = Router();

productsRouter.get("/", async (_, res: Response) => {
  try {
    const products = await getProducts();
    res.render("products", {
      items: products,
      queryParams: {},
    });
  } catch (e) {
    throwError(res, e);
  }
});

productsRouter.get(
  "/search",
  async (req: Request<{}, {}, {}, IProductFilterPayload>, res: Response) => {
    try {
      const products = await searchProducts(req.query);
      res.render("products", {
        items: products,
        queryParams: req.query,
      });
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const product = await getProduct(req.params.id);
      const others = await getOthers(req.params.id);
      const similars = await getSimilars(req.params.id);

      if (product) {
        res.render("product/product", {
          item: {
            product: product,
            others: others,
            similars: similars,
          },
        });
      } else {
        res.render("product/empty-product", {
          id: req.params.id,
        });
      }
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.get(
  "/remove-product/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      if (req.session.username !== "admin") {
        res.status(403).send("Forbidden");
        return;
      }

      await removeProduct(req.params.id);
      res.redirect(`/${process.env.ADMIN_PATH}`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post(
  "/save/:id",
  async (req: Request<{ id: string }, {}, IProductEdit>, res: Response) => {
    try {
      await updateProduct(req.params.id, req.body);
      res.redirect(`/${process.env.ADMIN_PATH}/${req.params.id}`);
    } catch (e) {
      throwError(res, e);
    }
  }
);

productsRouter.post("/add", async (req: Request<{}, {}, {}>, res: Response) => {
  try {
    res.render("product/product-new");
  } catch (e) {
    throwError(res, e);
  }
});

productsRouter.post(
  "/addNewProduct",
  async (req: Request<{}, {}, IProductCreate>, res: Response) => {
    try {
      const product = await addProduct(req.body);
      const others = await getOthers(product.id);
      const similars = await getSimilars(product.id);

      if (product) {
        res.render("product/product", {
          item: {
            product: product,
            others: others,
            similars: similars,
          },
        });
      } else {
        res.render("product/empty-product", {
          id: product.id,
        });
      }
    } catch (e) {
      throwError(res, e);
    }
  }
);
