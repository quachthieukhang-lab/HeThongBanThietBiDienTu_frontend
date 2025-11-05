'use client';
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

interface Props { product: any; onClose: ()=>void; onUpdateSuccess: (id:string, form:any) => void; }

export default function UpdateProductModal({ product, onClose, onUpdateSuccess }: Props) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(()=> setForm(product ? { ...product } : null), [product]);

  if (!form) return null;

  const set = (k:string, v:any) => setForm((s:any)=> ({ ...s, [k]: v }));

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdateSuccess(product._id, form);
      onClose();
    } catch (err:any) {
      toast.error(err?.message || 'Cập nhật thất bại');
    } finally { setLoading(false); }
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Cập nhật sản phẩm</Dialog.Title>
            <Dialog.Close asChild><button className="text-gray-400 hover:text-gray-600"><X/></button></Dialog.Close>
          </div>

          <form onSubmit={submit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm">Tên</label>
              <input value={form.name} onChange={e=>set('name', e.target.value)} className="w-full border rounded p-2"/>
            </div>
            <div><label className="text-sm">Slug</label><input value={form.slug||''} onChange={e=>set('slug', e.target.value)} className="w-full border rounded p-2"/></div>
            <div><label className="text-sm">BrandId</label><input value={form.brandId||''} onChange={e=>set('brandId', e.target.value)} className="w-full border rounded p-2"/></div>
            <div><label className="text-sm">Thumbnail</label><input value={form.thumbnail||''} onChange={e=>set('thumbnail', e.target.value)} className="w-full border rounded p-2"/></div>
            <div><label className="text-sm">Price From</label><input type="number" value={form.priceFrom||0} onChange={e=>set('priceFrom', Number(e.target.value))} className="w-full border rounded p-2"/></div>
            <div><label className="text-sm">Price To</label><input type="number" value={form.priceTo||0} onChange={e=>set('priceTo', Number(e.target.value))} className="w-full border rounded p-2"/></div>

            <div className="col-span-2">
              <label className="text-sm">Images (JSON array of URLs)</label>
              <textarea value={JSON.stringify(form.images||[], null, 2)} onChange={e=>{
                try { set('images', JSON.parse(e.target.value)); } catch {}
              }} className="w-full border rounded p-2 h-28"/>
            </div>

            <div className="col-span-2">
              <label className="text-sm">Specs (JSON)</label>
              <textarea value={JSON.stringify(form.specs||{}, null, 2)} onChange={e=>{
                try { set('specs', JSON.parse(e.target.value)); } catch {}
              }} className="w-full border rounded p-2 h-28"/>
            </div>

            <div className="col-span-2 flex justify-end gap-3">
              <Dialog.Close asChild><button type="button" className="px-4 py-2 border rounded">Hủy</button></Dialog.Close>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Đang...' : 'Lưu'}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
