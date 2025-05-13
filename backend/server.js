import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dssqayo2h",
  api_key: "261987676858859",
  api_secret: "379zSKTQlWyRcTuTDULCiNFZ6gA",
});

//App configuration
const app = express();

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

//Database Connection
try {
  mongoose.connect(
    "mongodb+srv://deepakbohara048:t2RdgDsIxZXcDybA@cluster0.fjtszm7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("✅mongoDB connected successfully");
} catch (error) {
  console.log("❌MongoDB connecton error", error);
}
app.get("/", (req, res) => {
  res.send("Hello from jwellary backend");
});

//Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
});

//Category Table
const categoryTable = mongoose.model("categoryTable", categorySchema);

//Banner Schema
const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});

// Banner Table
const BannerTable = mongoose.model("BannerTable", bannerSchema);

//Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  previousPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  rating: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categoryTable",
    required: true,
  },
  imageUrl: { type: String, required: true },
});

//Product Table
const ProductTable = mongoose.model("ProductTable", productSchema);

//Category Routes
//Create
app.post("/api/category", upload.single("imageUrl"), async (req, res) => {
  try {
    const categoryAlreadyExist = await categoryTable.findOne({
      name: req.body.name,
    });
    if (categoryAlreadyExist) {
      return res.status(409).json({
        success: false,
        data: null,
        msg: "Name already exist",
      });
    }

    console.log(req.file);

    //Image Upload Funcationality
    const uploadResult = await cloudinary.uploader
      .upload(req.file.path)
      .catch((error) => {
        return res.status(500).json({
          success: false,
          data: null,
          msg: "Something went image upload failed",
          error: error,
        });
      });

    console.log(uploadResult);

    const newlyCreatedCategory = await categoryTable.create({
      ...req.body,
      imageUrl: uploadResult.secure_url,
    });
    return res.status(200).json({
      success: true,
      data: newlyCreatedCategory,
      msg: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Get All
app.get("/api/category", async (req, res) => {
  try {
    const allCategories = await categoryTable.find();
    return res.status(200).json({
      success: true,
      data: allCategories,
      msg: "allCategory created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Get Single
app.get("/api/category/:id", async (req, res) => {
  try {
    const singleCategory = await categoryTable.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: singleCategory,
      msg: "Get single category success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Update
app.patch("/api/category/:id", upload.single("imageUrl"), async (req, res) => {
  try {
    if (req.file) {
      //Image Upload Funcationality
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path)
        .catch((error) => {
          return res.status(500).json({
            success: false,
            data: null,
            msg: "Something went image upload failed",
            error: error,
          });
        });

      const updatedCategory = await categoryTable.findByIdAndUpdate(
        req.params.id,
        { ...req.body, imageUrl: uploadResult.secure_url },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: updatedCategory,
        msg: "Updated category successfully",
      });
    }

    const updatedCategory = await categoryTable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: updatedCategory,
      msg: "Updated category successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Delete
app.delete("/api/category/:id", async (req, res) => {
  try {
    const deletedCategory = await categoryTable.findByIdAndDelete(
      req.params.id
    );
    return res.status(200).json({
      success: true,
      data: deletedCategory,
      msg: "deleted category successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Create
app.post("/api/banner", upload.single("imageUrl"), async (req, res) => {
  try {
    //Image Upload Funcationality
    const uploadResult = await cloudinary.uploader
      .upload(req.file.path)
      .catch((error) => {
        return res.status(500).json({
          success: false,
          data: null,
          msg: "Something went image upload failed",
          error: error,
        });
      });

    console.log(uploadResult);

    const newlyCreatedBanner = await BannerTable.create({
      imageUrl: uploadResult.secure_url,
    });
    return res.status(200).json({
      success: true,
      data: newlyCreatedBanner,
      msg: "Banner created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Get All
app.get("/api/banner", async (req, res) => {
  try {
    const allBanners = await BannerTable.find();
    return res.status(200).json({
      success: true,
      data: allBanners,
      msg: "All Banners fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Get Single
app.get("/api/banner/:id", async (req, res) => {
  try {
    const singleBanner = await BannerTable.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: singleBanner,
      msg: "Single banner find successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Update
app.patch("/api/banner/:id", async (req, res) => {});

//Delete
app.delete("/api/banner/:id", async (req, res) => {
  try {
    const deletedBanner = await BannerTable.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: deletedBanner,
      msg: "Deleted banner successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Product Route

//Create
app.post("/api/products", upload.single("imageUrl"), async (req, res) => {
  console.log(req.file);

  try {
    const productAlreadyExist = await ProductTable.findOne({
      name: req.body.name,
    });
    if (productAlreadyExist) {
      return res.status(409).json({
        success: false,
        msg: "Name already exist",
        data: null,
      });
    }

    const uploadResult = await cloudinary.uploader
      .upload(req.file.path)
      .catch((error) => {
        return res.status(500).json({
          success: false,
          data: null,
          msg: "Something went image upload failed",
          error: error,
        });
      });

    const newlyCreatedProduct = await ProductTable.create({
      ...req.body,
      imageUrl: uploadResult.secure_url,
    });
    return res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
      msg: "product created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Get all products

app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await ProductTable.find();
    return res.status(200).json({
      success: true,
      data: allProducts,
      msg: "All  products fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Get single product

app.get("/api/products/:id", async (req, res) => {
  try {
    const singleProducts = await ProductTable.findById(req.params.id);
    return res.status(200).json({
      success: true,
      data: singleProducts,
      msg: "Single product find successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Update product
app.patch("/api/products/:id", upload.single("imageUrl"), async (req, res) => {
  try {
    //Iff user upload new image
    if (req.file) {
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path)
        .catch((error) => {
          return res.status(500).json({
            success: false,
            data: null,
            msg: "Something went image upload failed",
            error: error,
          });
        });

      const updatedProduct = await ProductTable.findByIdAndUpdate(
        req.params.id,
        { ...req.body, imageUrl: uploadResult.secure_url }
      );

      return res.status(200).json({
        success: true,
        data: updatedProduct,
        msg: "Product updated successfully",
      });
    }

    const updatedProduct = await ProductTable.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      msg: "Product updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

//Delete products
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await ProductTable.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: deletedProduct,
      msg: "deleted  product successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      msg: "Something went wrong",
      error: error,
    });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
