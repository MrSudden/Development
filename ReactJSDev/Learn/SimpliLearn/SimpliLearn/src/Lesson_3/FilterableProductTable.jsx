import { useState } from 'react';
import PRODUCTS from "./data";
import SearchBar from "./SearchBar";
import ProductTable from "./ProductTable";
import ProductCategoryTableData from "./ProductCategoryTableData";
import ProductPaginationTableData from "./ProductPaginationTableData";

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
        <div className="flex flex-row gap-4">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-3">Product Table</h1>
                <SearchBar filterText={filterText} onlyInStock={onlyInStock} onFilterTextChange={setFilterText} onOnlyInStockChange={setOnlyInStock} />
                <ProductTable header={["Name", "Price"]} sortColumn={sortColumn} sortDirection={sortDirection} handleSort={handleSort}
                    products={<ProductCategoryTableData PRODUCTS={PRODUCTS} filterText={filterText} onlyInStock={onlyInStock} sortColumn={sortColumn} sortDirection={sortDirection} />} 
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-3">Product Table</h1>
                <SearchBar filterText={filterText} onlyInStock={onlyInStock} onFilterTextChange={setFilterText} onOnlyInStockChange={setOnlyInStock} />
                <ProductTable header={["Name", "Category", "Price"]} sortColumn={sortColumn} sortDirection={sortDirection} handleSort={handleSort}
                    products={<ProductPaginationTableData PRODUCTS={PRODUCTS} filterText={filterText} onlyInStock={onlyInStock} sortColumn={sortColumn} sortDirection={sortDirection} />} 
                />
            </div>
        </div>
    );
}

export default FilterableProductTable;