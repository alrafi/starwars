export default function TableRow({ item, deleteItem }) {
  return (
    <tr className="bg-gray-50 border-b ">
      <th scope="row" className="px-6 py-4 text-gray-500 whitespace-nowrap ">
        {item.name}
      </th>
      <td className="px-6 py-4">{item.height}</td>
      <td className="px-6 py-4">{item.mass}</td>
      <td className="px-6 py-4">{item.hair_color}</td>
      <td className="px-6 py-4">{item.skin_color}</td>
      <td className="px-6 py-4">
        {item?.isManual ? (
          <span
            className="bg-red-400 text-white text-sm rounded-lg px-4 py-1 cursor-pointer"
            onClick={() => deleteItem(item)}
          >
            Delete
          </span>
        ) : (
          ""
        )}
      </td>
    </tr>
  );
}
