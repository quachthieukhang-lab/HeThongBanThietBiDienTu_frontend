'use client';
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

interface Props { onClose: () => void; onSuccess: (form: any) => void; }

export default function AddProductModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState<any>({
    name: '', slug: '', categoryId: '', subcategoryId: '', brandId: '',
    specs: {}, images: [], thumbnail: '', isPublished: false, priceFrom: 0, priceTo: 0,
  });
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // you may load categories & subcategories similarly
  useEffect(() => {
    // load brands for select (simple)
    (async () => {
      try {
        const res = await apiFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/brands`);
        if (!res.ok) return;
        const data = await res.json();
        setBrands(data.items || []);
      } catch (e) { /* ignore */ }
    })();
  }, []);

  const handleChange = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  const addImage = (url: string) => setForm((s:any)=>({ ...s, images: [...(s.images||[]), url] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // minimal validation
      if (!form.name || !form.categoryId || !form.subcategoryId) {
        toast.error('Vui lòng điền tên, category và subcategory');
        setLoading(false);
        return;
      }
      await onSuccess(form);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Thêm thất bại');
    } finally { setLoading(false); }
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Thêm sản phẩm</Dialog.Title>
            <Dialog.Close asChild><button className="text-gray-400 hover:text-gray-600"><X/></button></Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium">Tên</label>
              <input required value={form.name} onChange={e=>handleChange('name', e.target.value)} className="w-full border rounded p-2"/>
            </div>

            <div>
              <label className="text-sm font-medium">Slug (tùy chọn)</label>
              <input value={form.slug} onChange={e=>handleChange('slug', e.target.value)} className="w-full border rounded p-2"/>
            </div>

            <div>
              <label className="text-sm font-medium">Brand</label>
              <select value={form.brandId} onChange={e=>handleChange('brandId', e.target.value)} className="w-full border rounded p-2">
                <option value=''>--Chọn--</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">CategoryId</label>
              <input placeholder="ID category" value={form.categoryId} onChange={e=>handleChange('categoryId', e.target.value)} className="w-full border rounded p-2"/>
            </div>

            <div>
              <label className="text-sm font-medium">SubcategoryId</label>
              <input placeholder="ID subcategory" value={form.subcategoryId} onChange={e=>handleChange('subcategoryId', e.target.value)} className="w-full border rounded p-2"/>
            </div>

            <div>
              <label className="text-sm font-medium">Thumbnail URL</label>
              <input value={form.thumbnail} onChange={e=>handleChange('thumbnail', e.target.value)} className="w-full border rounded p-2"/>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Images (URL)</label>
              <div className="flex gap-2">
                <input id="imgUrl" placeholder="https://..." className="border rounded p-2 flex-1"/>
                <button type="button" onClick={()=>{
                  const el = document.getElementById('imgUrl') as HTMLInputElement|null;
                  if (!el?.value) return;
                  addImage(el.value);
                  el.value = '';
                }} className="px-3 py-2 bg-indigo-600 text-white rounded">Thêm</button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {(form.images||[]).map((u:string,i:number)=>(
                  <div key={i} className="border rounded p-1">
                    <img src={u} alt="" className="h-16 w-16 object-cover"/>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Price From</label>
              <input type="number" value={form.priceFrom} onChange={e=>handleChange('priceFrom', Number(e.target.value))} className="w-full border rounded p-2"/>
            </div>

            <div>
              <label className="text-sm font-medium">Price To</label>
              <input type="number" value={form.priceTo} onChange={e=>handleChange('priceTo', Number(e.target.value))} className="w-full border rounded p-2"/>
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Specs (JSON)</label>
              <textarea value={JSON.stringify(form.specs || {}, null, 2)} onChange={e=>{
                try {
                  handleChange('specs', JSON.parse(e.target.value));
                } catch {
                  // ignore parse error until submit
                }
              }} className="w-full border rounded p-2 h-28"/>
              <p className="text-xs text-gray-400">Nhập object JSON phù hợp với attribute template</p>
            </div>

            <div className="col-span-2 flex justify-end gap-3 mt-2">
              <Dialog.Close asChild><button type="button" className="px-4 py-2 border rounded">Hủy</button></Dialog.Close>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Đang...' : 'Thêm'}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
