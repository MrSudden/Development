import { useState } from 'react';
import { PropTypes } from "prop-types";
import ProductRowMultiColumn from "./ProductRowMultiColumn";

export default function ProductPaginationTableData({ products, filterText, onlyInStock, sortColumn, sortDirection }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 5;

        let startButton = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
        let endButton = startButton + maxButtons - 1;

        if (endButton > totalPages) {
            endButton = totalPages;
            startButton = Math.max(endButton - maxButtons + 1, 1);
        }

        if (currentPage > 1) {
            buttons.push(
                <button
                    key="prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="text-sm p-0 m-0 w-8 h-8 mx-1 rounded-full bg-zinc-200"
                >
                    {'<'}
                </button>
            );
        }

        for (let i = startButton; i <= endButton; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`text-sm p-0 m-0 w-8 h-8 mx-1 rounded-full ${
                        currentPage === i ? 'bg-blue-500' : 'bg-zinc-200'
                    }`}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages) {
            buttons.push(
                <button
                    key="next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="text-sm p-0 m-0 w-8 h-8 mx-1 rounded-full bg-zinc-200"
                >
                    {'>'}
                </button>
            );
        }

        return buttons;
    };
    
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


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = sortedProducts.filter((product) => {
        if (filterText && !product.name.toLowerCase().includes(filterText.toLowerCase())) {
            return false;
        }
        if (onlyInStock && !product.stocked) {
            return false;
        }
        return true;
    }).slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            {currentProducts.map((product, index) => (
                <ProductRowMultiColumn product={product} key={index} />
            ))}
            <tr className="flex flex-row place-content-center mt-2">
                <td colSpan={3}>{renderPaginationButtons()}</td>
            </tr>
        </>
    );
}

ProductPaginationTableData.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterText: PropTypes.string,
    onlyInStock: PropTypes.bool,
    sortColumn: PropTypes.string,
    sortDirection: PropTypes.string
}