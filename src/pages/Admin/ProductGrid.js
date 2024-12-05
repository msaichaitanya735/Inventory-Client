import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Grid.css'; // Import a common CSS file for styling
import AddProductModal from './AddProductModal';

const ProductGrid = () => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [editableProductId, setEditableProductId] = useState(null);
  const [editableProduct, setEditableProduct] = useState({
    name: '',
    description: '',
    category: '',
    imgURL: '',
    unitsOfMeasure: '',
  });

    useEffect(() => {
    // Replace 'api/products' with the actual endpoint to fetch products
    axios.get('https://saichaitanyamuthyala.com/inventory/fetchallproducts')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
      console.log({products});
      axios.get(' https://saichaitanyamuthyala.com/inventory/fetchallcategories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
      console.log(categories);


      
  }, []);

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  const handleAddProduct = (newProduct) => {
    // Add the new product to the products state
    setProducts([...products, newProduct]);
    // Close the modal
    handleCloseAddProductModal();
  };
  const getCategoryName = (categoryId) => {
    console.log({categoryId})
    console.log({categories})
    const category = categories.find((cat) => cat.categoryID === categoryId);
return category ? category.name : 'Unknown Category';
  };
  const productsWithCategories = products.map((product) => ({
    ...product,
    category: getCategoryName(product.categoryID),
  }));
  const handleEditClick = (productId) => {
    setEditableProductId(productId);
    // Set initial values for the editable product
    const productToEdit = productsWithCategories.find(product => product.productID === productId);
    setEditableProduct({
      name: productToEdit.name,
      description: productToEdit.description,
      category: productToEdit.category,
      imgURL: productToEdit.imgURL,
      unitsOfMeasure: productToEdit.unitsOfMeasure,
    });
  };
  console.log({productsWithCategories});
  const handleInputChange = (field, value) => {
    // Update the state based on the input field being changed
    setEditableProduct({
      ...editableProduct,
      [field]: value,
    });
  };

  const handleSaveClick = (productid) => {
    
    const {description, imgURL } = editableProduct;
    const params = {
        productid : productid,
        description: description,
        imgURL : imgURL
    }
    const param = params.toString();
    console.log({param});
    console.log({productid, description, imgURL })
    const apiUrl = `https://saichaitanyamuthyala.com/inventory/updateproduct?productId=${productid}&description=${description}&imgURL=${imgURL}`;

    // Handle saving changes to the backend if needed
    // Update the productData array or make an API call to update the product
    // For simplicity, let's just log the updated product and productId
    axios.put(apiUrl)
        .then((response) => {
          // Handle the success response
          console.log('Update Successful:', response.data);
    
          // If needed, you can update your local state or perform additional actions
        })
        .catch((error) => {
          // Handle errors
          console.error('Error updating product:', error);
        })
        .finally(() => {
          // Reset editableProductId after the request is complete
          setEditableProductId(null);
        });
    console.log('Updated Product:', editableProduct);
    console.log('Product ID:', productid);
    setEditableProductId(null);
  };

  return (
    <div>
    <h2>
              <button onClick={handleOpenAddProductModal}>Add Product</button>
              <AddProductModal
        isOpen={isAddProductModalOpen}
        onRequestClose={handleCloseAddProductModal}
        onAddProduct={handleAddProduct}
      />
              
    </h2>
      <h2>Product Grid</h2>
      <div className="card-grid">
        {productsWithCategories.map(product => (
          <div key={product.productID} className="card">
            {editableProductId === product.productID ? (
              // Edit mode
              <>
                <label>Product Name:</label>
                <input
                  type="text"
                  value={editableProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                <label>Description:</label>
                <input
                  type="text"
                  value={editableProduct.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <label>Category:</label>
                <input
                  type="text"
                  value={editableProduct.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
                <label>Image URL:</label>
                <input
                  type="text"
                  value={editableProduct.imgURL}
                  onChange={(e) => handleInputChange('imgURL', e.target.value)}
                />
               
                <button onClick={() => handleSaveClick(product.productID)}>Submit</button>
              </>
            ) : (
              // Display mode
              <>
               <img src={product.imgURL} alt={product.name} className="card-image" />
            <h3>{product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Category: {product.category}</p>
                <button onClick={() => handleEditClick(product.productID)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;




