import { useEffect, useState } from "react";

export default function Pagination({ current, count, setCurrent }) {
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    setTotalPage(Math.ceil(count / 10));
  }, [count]);

  const handleClick = (page) => {
    setCurrent(page);
  };

  return (
    <div className="flex w-full justify-center p-4">
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-sm">
          {current > 1 && (
            <li onClick={() => handleClick(current - 1)}>
              <div className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer">
                Previous
              </div>
            </li>
          )}
          {[...Array(totalPage).keys()].map((item) => {
            return (
              <li onClick={() => handleClick(item + 1)} key={item + 1}>
                <div
                  className={`flex items-center justify-center px-3 h-8 cursor-pointer border border-gray-300 ${
                    current === item + 1
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  } `}
                >
                  {item + 1}
                </div>
              </li>
            );
          })}
          {current < totalPage && (
            <li onClick={() => handleClick(current + 1)}>
              <div className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer">
                Next
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
