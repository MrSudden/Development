import { PropTypes } from "prop-types";

export default function ProductRow({ product }) {
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