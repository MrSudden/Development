import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from "./SearchBar";
import ProductTable from "./ProductTable";
import ProductCategoryTableData from "./ProductCategoryTableData";
import ProductPaginationTableData from "./ProductPaginationTableData";

function FilterableProductTable() {
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [sortColumn, setSortColumn] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [products, setproducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchproducts = async () => {
            const cancelToken = axios.CancelToken.source();
            setLoading(true);
            try {
                await axios.get("http://localhost:8000/data").then(response => {
                    return response.data
                }).then(data => {
                    setproducts(data["products"]);
                })
            } catch (error) {
                if (axios.isCancel(error)) console.count("Axios Cancelled");
                setError(error);
            }
            setLoading(false);
            return () => cancelToken.cancel();
        };

        fetchproducts();
    }, []);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };
    
    return (
        loading ? <p>Loading...</p> : error ? <p>Error: {error.message}</p> :
        <div className="flex flex-row gap-4">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-3">Product Table</h1>
                <SearchBar filterText={filterText} onlyInStock={onlyInStock} onFilterTextChange={setFilterText} onOnlyInStockChange={setOnlyInStock} />
                <ProductTable header={["Name", "Price"]} sortColumn={sortColumn} sortDirection={sortDirection} handleSort={handleSort}
                    products={<ProductCategoryTableData products={products} filterText={filterText} onlyInStock={onlyInStock} sortColumn={sortColumn} sortDirection={sortDirection} />} 
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-3">Product Table</h1>
                <SearchBar filterText={filterText} onlyInStock={onlyInStock} onFilterTextChange={setFilterText} onOnlyInStockChange={setOnlyInStock} />
                <ProductTable header={["Name", "Category", "Price"]} sortColumn={sortColumn} sortDirection={sortDirection} handleSort={handleSort}
                    products={<ProductPaginationTableData products={products} filterText={filterText} onlyInStock={onlyInStock} sortColumn={sortColumn} sortDirection={sortDirection} />} 
                />
            </div>
        </div>
    );
}

export default FilterableProductTable;