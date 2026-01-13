import React from 'react';

/**
 * DataTable Component - Bảng dữ liệu dùng chung
 * * @param {Array} columns - Cấu hình cột (header, accessor, render function)
 * @param {Array} data - Dữ liệu hiển thị
 * @param {Function} actions - Hàm render nút thao tác (Sửa/Xóa) cho từng dòng (Optional)
 * @param {Boolean} loading - Trạng thái đang tải dữ liệu
 */
const DataTable = ({ columns, data = [], actions, loading = false }) => {
  
  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-gray-500 dark:text-gray-400 animate-pulse">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
        {/* HEADER */}
        <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 whitespace-nowrap">
                {col.header}
              </th>
            ))}
            {/* Nếu có actions truyền vào thì thêm cột Thao tác */}
            {actions && <th className="px-6 py-4 text-right">Thao tác</th>}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {/* Nếu cột có hàm render riêng (vd: badge trạng thái) thì dùng nó, ngược lại hiển thị text thuần */}
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                
                {/* Cột Action (Sửa/Xóa) */}
                {actions && (
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            /* TRƯỜNG HỢP KHÔNG CÓ DỮ LIỆU */
            <tr>
              <td 
                colSpan={columns.length + (actions ? 1 : 0)} 
                className="px-6 py-8 text-center text-gray-400 italic"
              >
                Không có dữ liệu hiển thị.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;