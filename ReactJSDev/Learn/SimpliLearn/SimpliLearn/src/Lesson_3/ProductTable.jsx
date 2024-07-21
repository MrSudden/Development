import { PropTypes } from "prop-types";

export default function ProductTable({ header, products, sortColumn, sortDirection, handleSort }) {
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