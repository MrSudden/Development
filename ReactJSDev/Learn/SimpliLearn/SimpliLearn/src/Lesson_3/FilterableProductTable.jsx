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

function ProductTable({ PRODUCTS }) {
    const header = ["Name", "Price"]
    const rows = [];
    let lastCategory = null;
    PRODUCTS.forEach(product => {
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
    PRODUCTS: PropTypes.arrayOf(PropTypes.object).isRequired
}

function SearchBar() {
    return (
        <form className="flex flex-col w-96">
            <input id="filterText" className="border-2 border-zinc-300 rounded" type="text" placeholder="Search..." /> {/* Add id or name attribute to form field element */}
            <p className="flex">
                <input id="onlyInStock" className='mr-2' type="checkbox" />
                Only show products in stock
            </p>
        </form>
    );
}

function FilterableProductTable() {

    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-bold mb-3">Product Table</h1>
            <SearchBar />
            <ProductTable PRODUCTS={PRODUCTS} />
        </div>
    );
}

export default FilterableProductTable;