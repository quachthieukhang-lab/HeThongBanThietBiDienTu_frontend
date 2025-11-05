// 'use client';
// import React from 'react';
// import * as ScrollArea from '@radix-ui/react-scroll-area';
// import { Pencil, Trash2 } from 'lucide-react';

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// export default function BrandTable({ brands, onEdit, onDelete }: any) {
//   return (
//     <div className="w-full rounded-2xl shadow-xl border border-gray-200 bg-white overflow-hidden">
//       <ScrollArea.Root className="w-full h-[600px] rounded-b-2xl">
//         <ScrollArea.Viewport className="w-full h-full overflow-auto">
//           <table className="min-w-full table-auto border-collapse">
//             <thead className="bg-indigo-100 text-gray-700 sticky top-0 z-10 shadow-sm">
//               <tr>
//                 {['Logo', 'Tên', 'Slug', 'Hành động'].map((header, i) => (
//                   <th
//                     key={i}
//                     className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide border-b border-gray-200"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100 text-sm">
//               {brands.length > 0 ? (
//                 brands.map((b: any, idx: number) => (
//                   <tr
//                     key={b._id}
//                     className={`transition-colors duration-200 hover:bg-indigo-50 ${
//                       idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                     }`}
//                   >
//                     <td className="px-5 py-3">
//                       {b.logoUrl ? (
//                         <img
//                           src={`${BASE_URL}/${b.logoUrl}`} // ✅ thêm BASE_URL ở đây
//                           alt={b.name}
//                           className="h-10 w-10 object-contain rounded-lg border"
//                           onError={(e) => (e.currentTarget.src = '/no-image.png')}
//                         />
//                       ) : (
//                         <span className="text-gray-400 italic">Không có</span>
//                       )}
//                     </td>
//                     <td className="px-5 py-3 font-medium text-gray-800">{b.name}</td>
//                     <td className="px-5 py-3 text-gray-600">{b.slug}</td>
//                     <td className="px-5 py-3 text-center">
//                       <div className="flex justify-center gap-3">
//                         <button
//                           title="Chỉnh sửa"
//                           onClick={() => onEdit(b)}
//                           className="p-2 rounded-md text-blue-600 hover:bg-blue-100 hover:scale-110 transition"
//                         >
//                           <Pencil size={18} />
//                         </button>
//                         <button
//                           title="Xóa"
//                           onClick={() => onDelete(b._id)}
//                           className="p-2 rounded-md text-red-600 hover:bg-red-100 hover:scale-110 transition"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="text-center py-10 text-gray-500 text-sm italic bg-gray-50"
//                   >
//                     Không có thương hiệu nào
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </ScrollArea.Viewport>

//         <ScrollArea.Scrollbar
//           className="flex select-none touch-none p-0.5 bg-gray-100 transition hover:bg-gray-200"
//           orientation="vertical"
//         >
//           <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-full" />
//         </ScrollArea.Scrollbar>
//       </ScrollArea.Root>
//     </div>
//   );
// }
'use client';
import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Pencil, Trash2 } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export default function BrandTable({ brands, onEdit, onDelete }: any) {
  return (
    <div className="w-full rounded-2xl shadow-xl border border-gray-200 bg-white overflow-hidden">
      <ScrollArea.Root className="w-full h-[600px] rounded-b-2xl">
        <ScrollArea.Viewport className="w-full h-full overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-100 text-gray-700 sticky top-0 z-10 shadow-sm">
              <tr>
                {['Logo', 'Tên', 'Slug', 'Hành động'].map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {brands.length > 0 ? (
                brands.map((b: any, idx: number) => (
                  <tr
                    key={b._id}
                    className={`transition-colors duration-200 hover:bg-indigo-50 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {/* Logo */}
                    <td className="px-5 py-4 align-middle">
                      {b.logoUrl ? (
                        <img
                          src={`${BASE_URL}/${b.logoUrl}`}
                          alt={b.name}
                          className="h-12 w-12 object-contain rounded-lg border bg-white p-1"
                          onError={(e) => (e.currentTarget.src = '/no-image.png')}
                        />
                      ) : (
                        <span className="text-gray-400 italic">Không có</span>
                      )}
                    </td>

                    {/* Tên */}
                    <td className="px-5 py-4 align-middle font-medium text-gray-800">
                      {b.name}
                    </td>

                    {/* Slug */}
                    <td className="px-5 py-4 align-middle text-gray-600">{b.slug}</td>

                    {/* Hành động */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex justify-start items-center gap-3">
                        <button
                          title="Chỉnh sửa"
                          onClick={() => onEdit(b)}
                          className="p-2.5 rounded-md text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          title="Xóa"
                          onClick={() => onDelete(b._id)}
                          className="p-2.5 rounded-md text-red-600 hover:bg-red-100 hover:scale-105 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-500 text-sm italic bg-gray-50"
                  >
                    Không có thương hiệu nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-gray-100 transition hover:bg-gray-200"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-gray-400 rounded-full" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
