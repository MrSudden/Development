import { PropTypes } from "prop-types";

export default function SearchBar({ filterText, onlyInStock, onFilterTextChange, onOnlyInStockChange }) {
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