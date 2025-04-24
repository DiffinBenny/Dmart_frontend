import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { productaddAPI, producteditAPI } from "../../services/productServices";

const AddProduct = ({ initialData = null }) => {
  const isEditMode = !!initialData;
  const [showStockInput, setShowStockInput] = useState(false);
  const [additionalStock, setAdditionalStock] = useState("");

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: isEditMode ? producteditAPI : productaddAPI,
    mutationKey: [isEditMode ? "edit-product" : "add-product"],
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Product description is required"),
    category: Yup.string().required("Category is required"),
    subCategory: Yup.string().required("Sub Category is required"),
    price: Yup.number()
      .required("Base price is required")
      .positive("Price must be positive"),
    minQuantity: Yup.number()
      .required("Minimum quantity is required")
      .integer("Minimum quantity must be a whole number")
      .min(1, "Minimum quantity must be at least 1"),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot exceed 100%"),
    stock: Yup.number()
      .required("Stock is required")
      .integer("Stock must be a whole number"),
    images: isEditMode 
      ? Yup.mixed()
      : Yup.mixed()
          .test('fileType', 'Only images are allowed', (value) => {
            if (!value) return false;
            return Array.from(value).every(file => 
              ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
          })
  });

  const formik = useFormik({
    initialValues: {
      _id: initialData?._id || '',
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      subCategory: initialData?.subCategory || "",
      size: initialData?.size || "",
      volume: initialData?.volume || "",
      price: initialData?.price || "",
      minQuantity: initialData?.minQuantity || "",
      discount: initialData?.discount || "",
      stock: initialData?.stock || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key !== "images") {
            formData.append(key, values[key]);
          }
        });
        
        if (values.images) {
          Array.from(values.images).forEach(file => {
            formData.append("images", file);
          });
        }

        if (isEditMode) {
          formData.append("id", initialData._id);
        }
        
        const data = await mutateAsync(formData);
        
        if (!isEditMode) {
          resetForm();
        }
        alert(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
      } catch (error) {
        alert(error.response?.data?.message || error.message || `Failed to ${isEditMode ? 'update' : 'add'} product`);
      }
    }
  });

  const handleAddStock = () => {
    setShowStockInput(true);
  };

  const handleSaveStock = () => {
    const additional = parseInt(additionalStock) || 0;
    if (additional >= 0) {
      const newStock = parseInt(formik.values.stock || 0) + additional;
      formik.setFieldValue('stock', newStock);
      setShowStockInput(false);
      setAdditionalStock("");
    } else {
      alert("Please enter a valid positive number");
    }
  };

  const getSubCategoryOptions = () => {
    switch (formik.values.category?.toLowerCase()) {
      case "fashion":
        return ["Men", "Women", "Kids", "Footwear", "Others"];
      case "beauty":
        return ["Moisturizer", "Serum", "Sunscreen", "Others"];
      case "accessories":
        return ["Watches", "Bags", "Sunglasses", "Jewelry", "Others"];
      default:
        return [];
    }
  };

  return (
    <AddProductContainer>
      <FormContainer>
        <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>

        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          {/* General Information Section */}
          <Section>
            <h2>General Information</h2>
            
            <FormGroup>
              <Label>Product Name *</Label>
              <Input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product name"
              />
              {formik.touched.name && formik.errors.name && (
                <ErrorMessage>{formik.errors.name}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Description *</Label>
              <TextArea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter product description"
              />
              {formik.touched.description && formik.errors.description && (
                <ErrorMessage>{formik.errors.description}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormRow>
              <FormGroup style={{ flex: 1 }}>
                <Label>Category *</Label>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Category</option>
                  <option value="fashion">Fashion</option>
                  <option value="beauty">Beauty</option>
                  <option value="accessories">Accessories</option>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <ErrorMessage>{formik.errors.category}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup style={{ flex: 1 }}>
                <Label>Sub Category *</Label>
                <Select
                  name="subCategory"
                  value={formik.values.subCategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.category}
                >
                  <option value="">Select Sub Category</option>
                  {getSubCategoryOptions().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {formik.touched.subCategory && formik.errors.subCategory && (
                  <ErrorMessage>{formik.errors.subCategory}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
          </Section>

          {/* Product Specifications Section */}
          <Section>
            <h2>Product Specifications</h2>
            
            <FormGroup>
              <Label>Size</Label>
              <Select
                name="size"
                value={formik.values.size}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select Size (Optional)</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </Select>
              {formik.touched.size && formik.errors.size && (
                <ErrorMessage>{formik.errors.size}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Volume</Label>
              <Select
                name="volume"
                value={formik.values.volume}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select Volume (Optional)</option>
                <option value="100ml">100ml</option>
                <option value="200ml">200ml</option>
                <option value="500ml">500ml</option>
              </Select>
              {formik.touched.volume && formik.errors.volume && (
                <ErrorMessage>{formik.errors.volume}</ErrorMessage>
              )}
            </FormGroup>
          </Section>

          {/* Pricing and Inventory Section */}
          <Section>
            <h2>Pricing and Inventory</h2>
            
            <FormGroup>
              <Label>Price *</Label>
              <Input
                type="number"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter price"
              />
              {formik.touched.price && formik.errors.price && (
                <ErrorMessage>{formik.errors.price}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Minimum Quantity *</Label>
              <Input 
                type="number"
                name="minQuantity"
                value={formik.values.minQuantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter minimum quantity"
              />
              {formik.touched.minQuantity && formik.errors.minQuantity && (
                <ErrorMessage>{formik.errors.minQuantity}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                name="discount"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter discount percentage"
              />
              {formik.touched.discount && formik.errors.discount && (
                <ErrorMessage>{formik.errors.discount}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Stock *</Label>
              <StockContainer>
                <StockDisplay>{formik.values.stock || 0}</StockDisplay>
                <AddStockButton type="button" onClick={handleAddStock}>
                  Add Stock
                </AddStockButton>
              </StockContainer>
              
              {showStockInput && (
                <StockInputContainer>
                  <Input
                    type="number"
                    value={additionalStock}
                    onChange={(e) => setAdditionalStock(e.target.value)}
                    placeholder="Enter additional stock"
                    min="0"
                  />
                  <SaveStockButton type="button" onClick={handleSaveStock}>
                    Save
                  </SaveStockButton>
                </StockInputContainer>
              )}
              
              {formik.touched.stock && formik.errors.stock && (
                <ErrorMessage>{formik.errors.stock}</ErrorMessage>
              )}
            </FormGroup>
          </Section>

          {/* Product Images Section */}
          <Section>
            <h2>Product Images</h2>
            {isEditMode && initialData.images && initialData.images.length > 0 && (
              <ExistingImages>
                <Label>Current Images:</Label>
                <ImageGrid>
                  {initialData.images.map((image, index) => (
                    <ExistingImage key={index} src={image} alt={`Product ${index + 1}`} />
                  ))}
                </ImageGrid>
              </ExistingImages>
            )}
            <FormGroup>
              <Label>{isEditMode ? 'Update Images (Optional)' : 'Upload Images *'}</Label>
              <Input
                id="images"
                name="images"
                type="file"
                multiple
                onChange={(event) => {
                  if (event.target.files && event.target.files.length > 0) {
                    formik.setFieldValue("images", event.target.files);
                  } else {
                    formik.setFieldValue("images", null);
                  }
                }}
                onBlur={formik.handleBlur}
                accept="image/*"
              />
              {formik.touched.images && formik.errors.images && (
                <ErrorMessage>{formik.errors.images}</ErrorMessage>
              )}
            </FormGroup>
          </Section>

          {/* Buttons */}
          <ButtonGroup>
            <Button type="button" onClick={() => formik.resetForm()}>
              Reset
            </Button>
            <Button type="submit" primary disabled={isPending}>
              {isPending ? `${isEditMode ? 'Updating' : 'Adding'} Product...` : `${isEditMode ? 'Update' : 'Add'} Product`}
            </Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </AddProductContainer>
  );
};

export default AddProduct;

// Styled Components
const AddProductContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  width: 90%;
  max-width: 800px;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 2.2rem;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;

  h2 {
    font-size: 1.7rem;
    color: #333;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  background-color: white;
  color: #333;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.85rem;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  background-color: white;
  color: #333;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.85rem;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  background-color: white;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &:disabled {
    background-color: #f5f5f5;
    opacity: 0.7;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.85rem 1.75rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? "#007bff" : "#6c757d")};
  color: white;
  transition: background-color 0.3s ease;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => (props.primary ? "#0069d9" : "#5a6268")};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const ExistingImages = styled.div`
  margin-bottom: 1.5rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
`;

const ExistingImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const StockContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StockDisplay = styled.div`
  padding: 0.85rem;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  width: 100%;
`;

const AddStockButton = styled.button`
  padding: 0.85rem 1.75rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #28a745;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const StockInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SaveStockButton = styled.button`
  padding: 0.85rem 1.75rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0069d9;
  }
`;