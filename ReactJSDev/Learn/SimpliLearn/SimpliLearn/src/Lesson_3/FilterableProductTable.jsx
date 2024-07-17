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

function ProductTable({ PRODUCTS, filterText, onlyInStock }) {
    const header = ["Name", "Price"]
    const rows = [];
    let lastCategory = null;
    PRODUCTS.forEach((product) => {
        if (filterText && !product.name.toLowerCase().includes(filterText.toLowerCase())) {
            return;
        }
        if (onlyInStock && !product.stocked) {
            return;
        }
        if (product.category !== lastCategory) {
            rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
        }
        rows.push(<ProductRow product={product} key={product.name} />);
        lastCategory = product.category;
    });

    return (
        <table className="flex flex-col w-96">
            <thead className="flex flex-row font-bold bg-zinc-200">
                <tr>
                    {header.map((head, index) => (<th className="w-48" key={index}>{head}</th>))}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

ProductTable.propTypes = {
    PRODUCTS: PropTypes.arrayOf(PropTypes.object).isRequired,
    filterText: PropTypes.string,
    onlyInStock: PropTypes.bool
}

function SearchBar({ filterText, onlyInStock, onFilterTextChange, onOnlyInStockChange }) {
    const handleFilterTextChange = (event) => {
        onFilterTextChange(event.target.value);
    }
    const handleOnlyInStockChange = (event) => {
        onOnlyInStockChange(event.target.checked);
    }

    return (
        <form className="flex flex-col w-96">
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
    
    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-bold mb-3">Product Table</h1>
            <SearchBar filterText={filterText} onlyInStock={onlyInStock} onFilterTextChange={setFilterText} onOnlyInStockChange={setOnlyInStock} />
            <ProductTable PRODUCTS={PRODUCTS} filterText={filterText} onlyInStock={onlyInStock} />
        </div>
    );
}

export default FilterableProductTable;