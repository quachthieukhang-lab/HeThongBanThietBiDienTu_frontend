'use client';
import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

export default function VariantModal({ product, onClose, onUpdateVariants }: any) {
  const [variants, setVariants] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  useEffect(()=> { if (!product) return; load(); }, [product]);

  const load = async () => {
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/products/${product._id}/variants`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setVariants(data || []);
    } catch (err) { console.error(err); toast.error('Tải variants thất bại'); }
  };

  const createVariant = async (form:any) => {
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/products/${product._id}/variants`, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      toast.success('Thêm variant OK');
      load();
      onUpdateVariants?.();
    } catch (err:any) { toast.error(err?.message || 'Thất bại'); }
  };

  const deleteVariant = async (id:string) => {
    if (!confirm('Xóa variant?')) return;
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/products/${product._id}/variants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      toast.success('Đã xóa');
      load();
      onUpdateVariants?.();
    } catch (err:any) { toast.error(err?.message || 'Xóa thất bại'); }
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">Variants: {product.name}</Dialog.Title>
            <Dialog.Close asChild><button className="text-gray-400 hover:text-gray-600"><X/></button></Dialog.Close>
          </div>

          <div className="mb-4">
            <button onClick={() => setOpenAdd(true)} className="px-3 py-2 bg-green-600 text-white rounded">Thêm variant</button>
          </div>

          <div className="space-y-3 max-h-72 overflow-auto">
            {variants.map(v => (
              <div key={v._id} className="flex justify-between items-center border p-3 rounded">
                <div>
                  <div className="font-medium">{v.sku || '—'}</div>
                  <div className="text-sm text-gray-600">Giá: {v.price} — Stock: {v.stock}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>deleteVariant(v._id)} className="px-2 py-1 bg-red-600 text-white rounded">Xóa</button>
                </div>
              </div>
            ))}
            {variants.length===0 && <div className="text-gray-500">Chưa có variant</div>}
          </div>

          {/* Add variant inline simple form */}
          {openAdd && <AddVariantInline onCancel={()=>setOpenAdd(false)} onCreate={async (f:any)=>{ await createVariant(f); setOpenAdd(false); }} />}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AddVariantInline({ onCancel, onCreate }: any) {
  const [form, setForm] = useState({ sku:'', barcode:'', price:0, compareAtPrice:0, stock:0, attributes: {}, images: [] });
  return (
    <div className="mt-4 border-t pt-4">
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="SKU" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} className="border p-2"/>
        <input placeholder="Barcode" value={form.barcode} onChange={e=>setForm({...form, barcode:e.target.value})} className="border p-2"/>
        <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} className="border p-2"/>
        <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock:Number(e.target.value)})} className="border p-2"/>
        <div className="col-span-2 flex justify-end gap-2 mt-2">
          <button onClick={onCancel} className="px-3 py-2 border rounded">Hủy</button>
          <button onClick={()=>onCreate(form)} className="px-3 py-2 bg-indigo-600 text-white rounded">Thêm</button>
        </div>
      </div>
    </div>
  );
}
