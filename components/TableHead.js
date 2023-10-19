export default function TableHead() {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
      <tr>
        <th scope="col" className="px-6 py-3">
          Name
        </th>
        <th scope="col" className="px-6 py-3">
          Height
        </th>
        <th scope="col" className="px-6 py-3">
          Mass
        </th>
        <th scope="col" className="px-6 py-3">
          Hair Color
        </th>
        <th scope="col" className="px-6 py-3">
          Skin Color
        </th>
        <th scope="col" className="px-6 py-3">
          Action
        </th>
      </tr>
    </thead>
  );
}
