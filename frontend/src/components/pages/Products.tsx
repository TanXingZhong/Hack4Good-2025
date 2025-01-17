import { Row, Col } from "reactstrap";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllProducts, Product as ProductType } from "../../api/product";
import Product from "../dashboard/Product";

interface ProductDataType {
  _id: string;
  image: string;
  title: string;
  price: number;
  description: string;
  quantity: number;
}

export default function Products() {
  const [productData, setProductData] = useState<ProductDataType[]>([]);
  useEffect(() => {
    getAllProducts().then((response) => {
      if (response.status === 200) {
        console.log(response);
        setProductData(response.productInfo.data.map((p: ProductType) => {
          return {
            _id: p._id,
            image: p.imageUrl,
            title: p.name,
            price: p.price,
            description: p.description,
            quantity: p.countInStock,
          }
        }));
      } else {
        setProductData([]);
      }
    });
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
    >
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Products
      </Typography>

      <Row>
        {productData.map((item, index) => (
          <Col xs="12" sm="6" md="4" key={index}>
            <Product
              id={item._id}
              image={item.image}
              title={item.title}
              subtitle=""
              price={item.price.toString()}
              description={item.description}
              quantity={item.quantity}
            />
          </Col>
        ))}
      </Row>
    </Box>
  );
}
