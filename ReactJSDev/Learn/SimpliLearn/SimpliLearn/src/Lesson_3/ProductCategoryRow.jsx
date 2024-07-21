import { PropTypes } from "prop-types";

export default function ProductCategoryRow({ category }) {
    return (
        <tr>
            <th className="font-semibold bg-zinc-100" colSpan={2}>{category}</th>
        </tr>
    );
}

ProductCategoryRow.propTypes = {
    category: PropTypes.string.isRequired
}