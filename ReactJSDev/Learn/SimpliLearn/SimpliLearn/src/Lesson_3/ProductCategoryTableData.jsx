import { PropTypes } from "prop-types";
import ProductRow from "./ProductRow";
import ProductCategoryRow from "./ProductCategoryRow";

export default function ProductCategoryTableData({ products, filterText, onlyInStock, sortColumn, sortDirection }) {
    const rows = [];
    const categoriesAdded = {};
    
    const sortedProducts = sortColumn
    ? [...products].sort((a, b) => {
          let aValue = a[sortColumn];
          let bValue = b[sortColumn];

          if (sortColumn !== 'price') {
              if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
              if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
              return 0;
          }

          aValue = parseInt(aValue.match(/\d/g), 10);
          bValue = parseInt(bValue.match(/\d/g), 10);
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      })
    : products;

    sortedProducts.forEach((product) => {
        if (filterText && !product.name.toLowerCase().includes(filterText.toLowerCase())) {
            return;
        }
        if (onlyInStock && !product.stocked) {
            return;
        }
        if (!categoriesAdded[product.category]) {
            rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            categoriesAdded[product.category] = true;
            rows.push(...sortedProducts.filter(p => p.category === product.category)            
            .filter(p => !filterText || p.name.toLowerCase().includes(filterText.toLowerCase()))
            .filter(p => !onlyInStock || p.stocked).map(p => <ProductRow product={p} key={p.name} />));
        }
    });

    return rows;
}

ProductCategoryTableData.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterText: PropTypes.string,
    onlyInStock: PropTypes.bool,
    sortColumn: PropTypes.string,
    sortDirection: PropTypes.string
}