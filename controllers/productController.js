const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

const createProduct = asyncHandler(async(req,res)=> {
    const {name, sku, category, quantity, price, description} = req.body;

    //Validation
    if(!name || !category || !quantity || !price || !description) {
        res.status(400)
        throw new Error("Please fill in all fields")
     }

    //Handle image upload
    
    let fileData = {

    }

    if(req.file) {
        //save image to cloudinary
        let uploadedFile;

        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "inventory-app",
                resource_type: "image"  
            })
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
                
        }

        fileData = {
            fileName: req.file.originalname,
            filepath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2)

        }
    }

    //Create product
    const product = await Product.create({
        user: req.user.id,
        name,sku,category,quantity,price,description,
        image: fileData        
    })

    res.status(201).json(product)

    })

    // Get all products
    const getProducts = asyncHandler(async(req,res)=> {
        const products = await Product.find({user: req.user.id}).sort("-createdAt"); // as we are sorting in desc order we need to add "-""
        //Product.find(); // find will give all the products

        res.status(200).json(products)
    })

    // Get single products
    const getProduct = asyncHandler(async(req,res)=> {
       const product = await Product.findById(req.params.id) // params we will get from url
       // if product does not exists
       if(!product) {
            res.status(404)
            throw new Error("Product not found")
       }
       //match product to its user
       if(product.user.toString() !== req.user.id) { //req.user.id we can access if the route is protected & we need to access it as id if we are using outside and if we are using in inside a model to call db we need to send _id
        res.status(401)
        throw new Error("User not authorized")
       }

       res.status(200).json(product)
    })

    //Delete product

    const deleteProduct = asyncHandler(async (req,res)=> {
        const product = await Product.findById(req.params.id) // params we will get from url
       // if product does not exists
       if(!product) {
            res.status(404)
            throw new Error("Product not found")
       }
       //match product to its user
       if(product.user.toString() !== req.user.id) { //req.user.id we can access if the route is protected & we need to access it as id if we are using outside and if we are using in inside a model to call db we need to send _id
        res.status(401)
        throw new Error("User not authorized")
       }
       console.log(product);
        await product.deleteOne(); //remove is deprecated
        res.status(200).json({ message: "product deleted."})
    })


    //Update product 

    const updateProduct = asyncHandler(async(req,res)=> {
        const {name, category, quantity, price, description} = req.body;
        const {id} = req.params
        
        const product = await Product.findById(id);
        
        // if product does not exist
        if(!product){
            res.status(404)
            throw new Error("Product not found")
        }

        //match product to its user
        if(product.user.toString() !== req.user.id) { //req.user.id we can access if the route is protected & we need to access it as id if we are using outside and if we are using in inside a model to call db we need to send _id
        res.status(401)
        throw new Error("User not authorized")
        }
        //Handle image upload
        
        let fileData = {}
    
        if(req.file) {
            //save image to cloudinary
            let uploadedFile;
    
            try {
                uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                    folder: "inventory-app",
                    resource_type: "image"  
                })
            } catch (error) {
                res.status(500)
                throw new Error("Image could not be uploaded")
                    
            }
    
            fileData = {
                fileName: req.file.originalname,
                filepath: uploadedFile.secure_url,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2)
    
            }
        }
    
        //update product

        const updatedProduct = await Product.findByIdAndUpdate(
            {_id : id},
            { name,
            category,
            quantity,
            price,
            description,
            image: Object.keys(fileData).length === 0 ? product?.image : fileData},
            {new:true,
            runValidators: true}
            )        
    
        res.status(200).json(updatedProduct)
    
        })



module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}