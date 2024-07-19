import { useState } from 'react';
import { PropTypes } from 'prop-types';
import PRODUCTS from "./data";

function ProductCategoryRow({ category }) {
    return (
        <tr>
            <th className="font-semibold bg-zinc-100" colSpan={2}>{category}</th>
        </tr>
    );
}

ProductCategoryRow.propTypes = {
    category: PropTypes.string.isRequired
}

function ProductRow({ product }) {
    return (
        <tr>
            <td className="w-48 text-start pl-6">{ product.stocked ? product.name: <span className='text-red-600'>{product.name}</span> }</td>
            <td className="w-48 text-end pr-6">{product.price}</td>
        </tr>
    );
}

ProductRow.propTypes = {
    product: PropTypes.object.isRequired
}

function ProductRowMultiColumn({ product }) {
    return (
        <tr>
            <td className="w-48 text-start pl-6">{ product.stocked ? product.name: <span className='text-red-600'>{product.name}</span> }</td>
            <td className="w-48 text-start">{product.category}</td>
            <td className="w-48 text-end pr-6">{product.price}</td>
        </tr>
    );
}

ProductRowMultiColumn.propTypes = {
    product: PropTypes.object.isRequired
}

function ProductTable({ header, products, sortColumn, sortDirection, handleSort }) {
    return (
        <>
            <table className={`flex flex-col w-${48 * header.length}`}>
                <thead className="flex flex-row font-bold bg-zinc-200">
                    <tr>
                        {header.map((head, index) => (<th className="w-48 cursor-pointer" key={index} onClick={() => handleSort(head.toLowerCase())}>
                            {head}
                            {sortColumn === head.toLowerCase() && (
                                <span>{sortDirection === 'asc' ? ' ⬆️' : ' ⬇️'}</span>
                            )}
                        </th>))}
                    </tr>
                </thead>
                <tbody>
                    {products}
                </tbody>
            </table>
        </>
    );
}

ProductTable.propTypes = {
    header: PropTypes.arrayOf(PropTypes.string).isRequired,
    products: PropTypes.object.isRequired,
    sortColumn: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
    handleSort: PropTypes.func.isRequired
}

function ProductCategoryTableData({ PRODUCTS, filterText, onlyInStock, sortColumn, sortDirection }) {
    const rows = [];
    const categoriesAdded = {};
    
    const sortedProducts = sortColumn
    ? [...PRODUCTS].sort((a, b) => {
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
    : PRODUCTS;

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
    PRODUCTS: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterText: PropTypes.string,
    onlyInStock: PropTypes.bool,
    sortColumn: PropTypes.string,
    sortDirection: PropTypes.string
}

function ProductPaginationTableData({ PRODUCTS, filterText, onlyInStock, sortColumn, sortDirection }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(PRODUCTS.length / itemsPerPage);

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
    ? [...PRODUCTS].sort((a, b) => {
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
    : PRODUCTS;


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
    PRODUCTS: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterText: PropTypes.string,
    onlyInStock: PropTypes.bool,
    sortColumn: PropTypes.string,
    sortDirection: PropTypes.string
}

function SearchBar({ filterText, onlyInStock, onFilterTextChange, onOnlyInStockChange }) {
    const handleFilterTextChange = (event) => {
        onFilterTextChange(event.target.value);
    }
    const handleOnlyInStockChange = (event) => {
        onOnlyInStockChange(event.target.checked);
    }

    return (
        <form className="flex flex-col">
            <input id="filterText" className="border-2 border-zinc-300 rounded" type="text" placeholder="Search..." value={filterText} onChange={handleFilterTextChange} />
            <label className="flex">
                <input id="onlyInStock" className='mr-2' type="checkbox" checked={onlyInStock} onChange={handleOnlyInStockChange} />
                Only show products in stock
            </label>
        </form>
    );
}

SearchBar.propTypes = {
    filterText: PropTypes.string,
    onlyInStock: PropTypes.bool,
    onFilterTextChange: PropTypes.func,
    onOnlyInStockChange: PropTypes.func
}

function FilterableProductTable() {
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };
    
    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-bold mb-3">Product Table</h1>
            <SearchBar filterText={filterText} onlyInStock={onlyInStock} onFilterTextChange={setFilterText} onOnlyInStockChange={setOnlyInStock} />
            {/* <ProductTable header={["Name", "Price"]} sortColumn={sortColumn} sortDirection={sortDirection} handleSort={handleSort}
                products={<ProductCategoryTableData PRODUCTS={PRODUCTS} filterText={filterText} onlyInStock={onlyInStock} sortColumn={sortColumn} sortDirection={sortDirection} />} 
            /> */}
            <ProductTable header={["Name", "Category", "Price"]} sortColumn={sortColumn} sortDirection={sortDirection} handleSort={handleSort}
                products={<ProductPaginationTableData PRODUCTS={PRODUCTS} filterText={filterText} onlyInStock={onlyInStock} sortColumn={sortColumn} sortDirection={sortDirection} />} 
            />
        </div>
    );
}

export default FilterableProductTable;