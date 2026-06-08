import { useState, useRef } from "react";
import {
  ImagePlus,
  Upload,
  Trash2,
  Edit2,
  Save,
  X,
  Plus,
  Store,
  Tag,
  DollarSign,
  FileText,
  Phone,
  MapPin,
  Clock,
  Camera,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { Product } from "@/types";

const Materials = () => {
  const { products, store, addProduct, updateProduct, removeProduct, updateStore } = useAppStore();
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingStore, setEditingStore] = useState(false);
  const [newProduct, setNewProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: 0,
    discount: "",
    description: "",
    images: [],
  });
  const [storeForm, setStoreForm] = useState(store);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddProduct = () => {
    if (productForm.name && productForm.price) {
      addProduct({
        name: productForm.name!,
        price: productForm.price!,
        originalPrice: productForm.originalPrice,
        discount: productForm.discount,
        description: productForm.description,
        images: productForm.images?.length
          ? productForm.images
          : [`https://picsum.photos/400/400?random=${Date.now()}`],
        category: productForm.category,
      });
      setProductForm({
        name: "",
        price: 0,
        originalPrice: 0,
        discount: "",
        description: "",
        images: [],
      });
      setNewProduct(false);
    }
  };

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const dataUrl = await processFile(file);
        newImages.push(dataUrl);
      }
    }

    setProductForm({
      ...productForm,
      images: [...(productForm.images || []), ...newImages],
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const dataUrl = await processFile(file);
        newImages.push(dataUrl);
      }
    }

    setProductForm({
      ...productForm,
      images: [...(productForm.images || []), ...newImages],
    });
  };

  const removeImage = (index: number) => {
    const newImgs = [...(productForm.images || [])];
    newImgs.splice(index, 1);
    setProductForm({ ...productForm, images: newImgs });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ImagePlus className="w-7 h-7 text-primary-400" />
          素材导入
        </h1>
        <p className="text-gray-400">上传商品图片、填写价格和优惠信息，维护门店基础资料</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title mb-0">
                <Tag className="w-5 h-5 text-primary-400" />
                商品列表
              </h2>
              <button
                onClick={() => setNewProduct(true)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                添加商品
              </button>
            </div>

            {newProduct && (
              <div className="mb-5 p-5 rounded-xl bg-primary-500/10 border border-primary-500/20 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold text-white">新增商品</h3>
                  <button
                    onClick={() => setNewProduct(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">商品名称 *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="input-field"
                      placeholder="请输入商品名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">分类</label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="input-field"
                      placeholder="如：主食、饮品"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">售价 *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="input-field"
                      placeholder="¥"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">原价</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="input-field"
                      placeholder="¥"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1.5">优惠标签</label>
                    <input
                      type="text"
                      value={productForm.discount}
                      onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                      className="input-field"
                      placeholder="如：限时7折、买一送一"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1.5">商品描述</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="input-field min-h-[80px] resize-none"
                      placeholder="介绍商品的特色和亮点"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1.5">商品图片</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={handleImageUpload}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                        dragOver
                          ? "border-primary-500 bg-primary-500/10"
                          : "border-white/20 hover:border-primary-500/50"
                      }`}
                    >
                      <div className="flex flex-wrap gap-3 justify-center mb-4">
                        {productForm.images?.map((img, i) => (
                          <div
                            key={i}
                            className="relative group"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-20 h-20 rounded-lg object-cover border border-white/10"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(i);
                              }}
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-sm text-gray-300">
                          点击或拖拽图片到此处上传
                        </p>
                        <p className="text-xs text-gray-500">
                          支持 JPG、PNG、GIF 格式，可多选
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-5">
                  <button onClick={() => setNewProduct(false)} className="btn-secondary text-sm">
                    取消
                  </button>
                  <button onClick={handleAddProduct} className="btn-primary text-sm">
                    保存商品
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/20 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="flex gap-2 flex-shrink-0">
                      {product.images.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover border border-white/10"
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingProduct === product.id ? (
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            defaultValue={product.name}
                            className="input-field text-sm"
                            onBlur={(e) => updateProduct(product.id, { name: e.target.value })}
                          />
                          <input
                            type="number"
                            defaultValue={product.price}
                            className="input-field text-sm"
                            onBlur={(e) =>
                              updateProduct(product.id, { price: Number(e.target.value) })
                            }
                          />
                          <input
                            type="text"
                            defaultValue={product.discount}
                            className="input-field text-sm"
                            onBlur={(e) => updateProduct(product.id, { discount: e.target.value })}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-white">{product.name}</h3>
                            {product.category && (
                              <span className="badge bg-primary-500/15 text-primary-400 border border-primary-500/30">
                                {product.category}
                              </span>
                            )}
                            {product.discount && (
                              <span className="badge bg-accent-orange/15 text-accent-orange border border-accent-orange/30">
                                {product.discount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-accent-orange">
                              ¥{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ¥{product.originalPrice}
                              </span>
                            )}
                          </div>
                          {product.description && (
                            <p className="text-sm text-gray-400 mt-1">{product.description}</p>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          editingProduct === product.id
                            ? setEditingProduct(null)
                            : setEditingProduct(product.id)
                        }
                        className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-primary-500/20 border border-white/10 hover:border-primary-500/30 flex items-center justify-center transition-all"
                      >
                        {editingProduct === product.id ? (
                          <Save className="w-4 h-4 text-primary-400" />
                        ) : (
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-accent-red/20 border border-white/10 hover:border-accent-red/30 flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-accent-red" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title mb-0">
                <Store className="w-5 h-5 text-primary-400" />
                门店信息
              </h2>
              <button
                onClick={() => setEditingStore(!editingStore)}
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                {editingStore ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {editingStore ? "保存" : "编辑"}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Store className="w-3 h-3" /> 门店名称
                </label>
                {editingStore ? (
                  <input
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                    className="input-field text-sm"
                    onBlur={() => {
                      updateStore(storeForm);
                    }}
                  />
                ) : (
                  <p className="text-white font-medium">{store.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 门店地址
                </label>
                {editingStore ? (
                  <input
                    value={storeForm.address}
                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                    className="input-field text-sm"
                    onBlur={() => updateStore(storeForm)}
                  />
                ) : (
                  <p className="text-gray-300 text-sm">{store.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> 联系电话
                </label>
                {editingStore ? (
                  <input
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="input-field text-sm"
                    onBlur={() => updateStore(storeForm)}
                  />
                ) : (
                  <p className="text-gray-300 text-sm">{store.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 营业时间
                </label>
                {editingStore ? (
                  <input
                    value={storeForm.businessHours}
                    onChange={(e) => setStoreForm({ ...storeForm, businessHours: e.target.value })}
                    className="input-field text-sm"
                    onBlur={() => updateStore(storeForm)}
                  />
                ) : (
                  <p className="text-gray-300 text-sm">{store.businessHours}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> 门店简介
                </label>
                {editingStore ? (
                  <textarea
                    value={storeForm.description}
                    onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                    className="input-field text-sm min-h-[60px] resize-none"
                    onBlur={() => updateStore(storeForm)}
                  />
                ) : (
                  <p className="text-gray-300 text-sm">{store.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="card-title mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent-orange" />
              素材统计
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-dark-800/50 text-center">
                <p className="text-2xl font-bold text-white">{products.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">商品数量</p>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/50 text-center">
                <p className="text-2xl font-bold text-white">
                  {products.reduce((acc, p) => acc + p.images.length, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">图片总数</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
