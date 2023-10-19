import TableHead from "./TableHead";
import TableRow from "./TableRow";

export default function Table({ data, itemToDelete }) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 border border-gray-200 rounded-lg border-separate">
        <TableHead />
        <tbody>
          {data.map((item) => (
            <TableRow item={item} key={item.name} deleteItem={itemToDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
